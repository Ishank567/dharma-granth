/**
 * P0 data fix — convert romanized Sanskrit to Devanagari.
 *
 * ~24 scriptures in public/data/scriptures-full/*.json store their `sanskrit`
 * field as romanized text ("granthaprastāvanā śriyaṃ…") instead of Devanagari,
 * because they were seeded from a romanized source without the transliteration
 * step that scripts/seed-puranas.ts applies to sanskritdocuments ITRANS files.
 * This migration runs those fields through @indic-transliteration/sanscript,
 * the same library already used elsewhere in the repo.
 *
 * The romanized files use two different schemes, and converting with the wrong
 * one produces garbage, so the script detects each file's scheme:
 *   - IAST   — diacritics, e.g. `āśvine śuklapakṣe` (the big Puranas).
 *   - ITRANS — ASCII capitals, e.g. `ghrAtA draShTA eva.n` (smaller
 *              Upanishads/sutras). IAST always carries non-ASCII diacritics;
 *              ITRANS is pure ASCII — that's the discriminator.
 *
 * Behaviour:
 *   - Auto-detects romanized files (samples a mid verse — matches
 *     scripts/audit-data-quality.py), so you don't maintain a hand-list.
 *   - Detects each file's scheme (iast vs itrans) and converts accordingly.
 *   - Per verse, only converts a `sanskrit` value that is actually romanized
 *     (Latin-heavy). Already-Devanagari verses are left untouched, so the
 *     script is idempotent and safe to re-run.
 *   - Preserves the original romanization in the `transliteration` field when
 *     that field is empty (keeps it available, fills a real gap).
 *   - Skips GRETIL header-artifact lines (".. Title ..##") so they aren't
 *     mangled — those are the separate P2 cleanup.
 *
 * Usage:
 *   tsx scripts/migrate-romanize-to-devanagari.ts            # dry run (report only)
 *   tsx scripts/migrate-romanize-to-devanagari.ts --write    # apply in place
 *
 * Git is the backup — review the diff before committing.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Sanscript from "@indic-transliteration/sanscript";

const DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
  "scriptures-full"
);

const WRITE = process.argv.includes("--write");

const HAS_DEV = /[ऀ-ॿ]/; // any Devanagari
const HAS_LAT = /[A-Za-z]/; // any ASCII Latin
// Non-ASCII Latin letters (IAST diacritics: ā ī ū ṛ ṝ ḷ ṃ ḥ ṅ ñ ṭ ḍ ṇ ś ṣ …).
const DIACRITIC = /[À-ɏḀ-ỿ]/;
// Pure-metadata artifacts (GRETIL leakage): Upanishad title lines
// (".. X Upanishad ..##"), bare section markers (".. 8.."), and \endtitles.
// Deliberately precise — must NOT match real verses that merely begin with
// ".." (e.g. harivanshpuran elisions). Shared with the P2 removal script
// (scripts/strip-header-artifacts.ts).
const ARTIFACT = /[ou]panisha[dt]\s*\.\.|^\s*\.\.\s*\d+\s*\.\.|endtitles/i;

type Scheme = "iast" | "itrans";

interface Verse {
  number?: number | string;
  sanskrit?: string;
  transliteration?: string;
  [k: string]: unknown;
}
interface Scripture {
  id: string;
  chapters: { verses: Verse[] }[];
  [k: string]: unknown;
}

function allVerses(doc: Scripture): Verse[] {
  return doc.chapters.flatMap((c) => c.verses);
}

/**
 * Verses safe to transliterate: PURELY romanized `sanskrit` (has Latin, zero
 * Devanagari) and not a metadata artifact. Requiring zero Devanagari is what
 * protects the mangled mixed-script chapter-title lines found in some
 * already-Devanagari files (e.g. "॥ ष्रिमद् … shrImadbhAgavataM ..") — those
 * mix scripts, so we leave them alone (a separate data issue) rather than
 * Frankenstein them further.
 */
function romanizedVerses(doc: Scripture): Verse[] {
  return allVerses(doc).filter((v) => {
    const s = v.sanskrit ?? "";
    return HAS_LAT.test(s) && !HAS_DEV.test(s) && !ARTIFACT.test(s);
  });
}

/**
 * A file needs conversion if it has any purely-romanized verse. Checking "any"
 * (not a sampled middle verse) means a file that's mostly converted but has a
 * few stranded romanized verses is still picked up — and once everything is
 * Devanagari this returns false, so the script stays idempotent.
 */
function isRomanizedFile(doc: Scripture): boolean {
  return romanizedVerses(doc).length > 0;
}

/**
 * Detect a romanized file's scheme. IAST always carries non-ASCII diacritics
 * (visarga/anusvara/long vowels appear in virtually every śloka); ITRANS is
 * pure ASCII. So: any diacritic anywhere → iast, else itrans.
 */
function detectScheme(doc: Scripture): Scheme {
  return romanizedVerses(doc).some((v) => DIACRITIC.test(v.sanskrit ?? ""))
    ? "iast"
    : "itrans";
}

let filesChanged = 0;
let versesChanged = 0;
const report: string[] = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json")).sort()) {
  const path = join(DIR, file);
  const doc = JSON.parse(readFileSync(path, "utf-8")) as Scripture;
  if (!isRomanizedFile(doc)) continue;
  const scheme = detectScheme(doc);

  let converted = 0;
  for (const v of romanizedVerses(doc)) {
    const src = v.sanskrit as string;
    const deva = Sanscript.t(src, scheme, "devanagari");
    if (deva === src) continue;
    // Keep the romanization as transliteration if we'd otherwise lose it.
    if (!(v.transliteration ?? "").trim()) v.transliteration = src;
    v.sanskrit = deva;
    converted++;
  }

  if (converted) {
    filesChanged++;
    versesChanged += converted;
    report.push(`  ${doc.id.padEnd(22)} ${scheme.padEnd(6)} ${converted} verses`);
    if (WRITE) writeFileSync(path, JSON.stringify(doc, null, 2) + "\n", "utf-8");
  }
}

console.log(
  `${WRITE ? "Converted" : "[dry run] Would convert"} romanized → Devanagari:\n`
);
console.log(report.join("\n") || "  (nothing to convert — already Devanagari)");
console.log(
  `\n${filesChanged} files, ${versesChanged} verses.` +
    (WRITE ? "" : "\nRe-run with --write to apply.")
);
