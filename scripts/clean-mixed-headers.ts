/**
 * P2b data fix — strip English editorial notes from a few clean Devanagari verses.
 *
 * A handful of verses have a real, complete Devanagari śloka with an English
 * editorial annotation stuck in the `sanskrit` field — e.g. a source credit
 * ("By Dr. … Lucknow, India. <verse>"), a "(verses missing)" note, or a
 * Brahmasutra variant-reading label ("पाठभेद 1.4.5 and 6 combined ॐ … ॐ").
 * For these, dropping the non-Devanagari characters cleanly recovers the verse.
 *
 * This is an EXPLICIT allowlist, not a heuristic. The 52 mixed-script lines
 * flagged by the audit are heterogeneous, and a blanket "strip Latin" rule is
 * unsafe: it would reduce the Purana canto-header blobs to just their title
 * (losing verse 1.1.1, which is embedded there in romanized form) and would
 * turn transliterated-English lines into garbage. Those need a seed-pipeline
 * fix, not a data patch — see DATA_QUALITY_BACKLOG.md (P2b). Only verses
 * individually verified to contain ONE complete Devanagari verse plus a purely
 * editorial English annotation are listed here.
 *
 * Usage:
 *   tsx scripts/clean-mixed-headers.ts            # dry run (shows before/after)
 *   tsx scripts/clean-mixed-headers.ts --write    # apply in place
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
  "scriptures-full"
);
const WRITE = process.argv.includes("--write");

// id → set of verse `number`s to clean. Each verified by hand: the Devanagari
// core is a single complete verse, the stripped text is purely English editorial.
const ALLOWLIST: Record<string, string[]> = {
  atharvaveda: ["93.1"], // source credit prefix
  manusmriti: ["3.57"], // "(verses missing in M.)" note
  brahmasutra: ["1.4.6", "2.4.4", "3.1.9", "3.2.26", "4.4.18"], // पाठभेद variant labels
};

// Keep Devanagari (incl. ॐ ॥ । ऽ, vowel signs, danda) and whitespace; drop all
// Latin, ASCII digits/punctuation and GRETIL markup. Collapse runs of spaces.
function devanagariOnly(s: string): string {
  return s.replace(/[^ऀ-ॿ\s]/g, "").replace(/\s+/g, " ").trim();
}

interface Verse { number?: number | string; sanskrit?: string; [k: string]: unknown }
interface Scripture { id: string; chapters: { verses: Verse[] }[]; [k: string]: unknown }

let cleaned = 0;
for (const [id, numbers] of Object.entries(ALLOWLIST)) {
  const path = join(DIR, `${id}.json`);
  const doc = JSON.parse(readFileSync(path, "utf-8")) as Scripture;
  const want = new Set(numbers);
  let touched = false;

  for (const c of doc.chapters) {
    for (const v of c.verses) {
      if (!want.has(String(v.number))) continue;
      const before = v.sanskrit ?? "";
      // Only touch the entry carrying the English editorial note. Some files
      // reuse a verse number (e.g. atharvaveda has two "93.1"); the clean
      // Devanagari one has no Latin and must be left exactly as-is.
      if (!/[A-Za-z]/.test(before)) continue;
      const after = devanagariOnly(before);
      if (after && after !== before) {
        console.log(`  [${id} v${v.number}]`);
        console.log(`    before: ${JSON.stringify(before.slice(0, 80))}`);
        console.log(`    after:  ${JSON.stringify(after.slice(0, 80))}`);
        v.sanskrit = after;
        touched = true;
        cleaned++;
      }
    }
  }
  if (touched && WRITE) writeFileSync(path, JSON.stringify(doc, null, 2) + "\n", "utf-8");
}

console.log(
  `\n${WRITE ? "Cleaned" : "[dry run] Would clean"} ${cleaned} verses.` +
    (WRITE ? "" : "\nRe-run with --write to apply.")
);
