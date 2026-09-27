/**
 * Strip bulk-mapped translator commentary from the published full JSONs.
 *
 * The Tagare/Ganguli/Pargiter seed scripts mapped end-of-book "Sense:" notes
 * onto every verse of a passage, so identical English notes sit on tens of
 * thousands of verses they don't belong to (one note × up to 1,949 verses).
 * A commentary value that repeats 6+ times within one scripture is bulk
 * mapping, not per-verse commentary.
 *
 * Removes `commentary` only when BOTH hold:
 *   1. the exact value occurs on 6+ verses of the same scripture, and
 *   2. the value is a translator artifact — starts with "Sense:" (OCR
 *      variants included) or a footnote marker.
 * Curated thematic notes (which do repeat across highlight verses) and
 * genuine 1–5× notes are left untouched. No verse counts change.
 *
 * Also removes `wordMeaning` wherever it is an exact copy of `translation`:
 * the seed scripts filled it by copying the translation, so the reader showed
 * the same English twice (अनुवाद and सरल अर्थ).
 *
 *   npx tsx scripts/strip-duplicate-commentary.ts          (dry-run)
 *   npx tsx scripts/strip-duplicate-commentary.ts --write
 *   npm run shard:scriptures   (afterwards, to refresh ch-*.json shards)
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
  "scriptures-full",
);
const WRITE = process.argv.includes("--write");
const DUP_THRESHOLD = 6;

interface Verse {
  number?: number | string;
  commentary?: string;
  translation?: string;
  wordMeaning?: string;
  [k: string]: unknown;
}
interface Scripture {
  id: string;
  chapters: { number?: number | string; verses: Verse[] }[];
}

// "Sense:", "Sense¬" (OCR), "sense —", leading quotes already trimmed.
const TRANSLATOR_NOTE = /^sense[^a-z]|^sense\b/i;
// Footnote-style openers: superscript digits, "Note ...", "Footnote ...".
const FOOTNOTE_NOTE = /^[¹²³⁴⁵⁶⁷⁸⁹⁰]|\b(note|footnote)\s|^sup[.\s]/i;

function isBulkTranslatorNote(value: string): boolean {
  const v = value.trim();
  return TRANSLATOR_NOTE.test(v) || FOOTNOTE_NOTE.test(v);
}

function main(): void {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".json")).sort();
  let totalStripped = 0;
  let totalMeaning = 0;
  let bytesSaved = 0;

  for (const file of files) {
    const doc = JSON.parse(readFileSync(join(DIR, file), "utf8")) as Scripture;

    const freq = new Map<string, number>();
    for (const ch of doc.chapters) {
      for (const v of ch.verses) {
        const c = (v.commentary || "").trim();
        if (c) freq.set(c, (freq.get(c) || 0) + 1);
      }
    }
    const junk = new Set<string>();
    for (const [value, n] of freq) {
      if (n >= DUP_THRESHOLD && isBulkTranslatorNote(value)) junk.add(value);
    }
    let stripped = 0;
    let meaning = 0;
    for (const ch of doc.chapters) {
      for (const v of ch.verses) {
        const c = (v.commentary || "").trim();
        if (c && junk.has(c)) {
          bytesSaved += Buffer.byteLength(JSON.stringify(c));
          delete v.commentary;
          stripped++;
        }
        const w = (v.wordMeaning || "").trim();
        if (w && w === (v.translation || "").trim()) {
          bytesSaved += Buffer.byteLength(JSON.stringify(w));
          delete v.wordMeaning;
          meaning++;
        }
      }
    }
    if (!stripped && !meaning) continue;
    totalStripped += stripped;
    totalMeaning += meaning;
    const keptDup = [...freq.entries()].filter(
      ([v, n]) => n >= DUP_THRESHOLD && !junk.has(v),
    ).length;
    console.log(
      `${doc.id}: stripped ${stripped} bulk notes (${junk.size} distinct), ` +
        `${meaning} wordMeaning copies of translation` +
        `${keptDup ? `; kept ${keptDup} curated repeated notes` : ""}`,
    );

    if (WRITE) {
      writeFileSync(
        join(DIR, file),
        JSON.stringify(doc, null, 2) + "\n",
        "utf8",
      );
    }
  }

  console.log(
    `\n${WRITE ? "Wrote" : "Would strip"} ${totalStripped} commentary fields, ` +
      `${totalMeaning} wordMeaning copies ` +
      `(~${(bytesSaved / 1024 / 1024).toFixed(1)}MB) across ${files.length} scriptures.`,
  );
}

main();
