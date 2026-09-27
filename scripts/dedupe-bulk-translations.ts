/**
 * Collapse bulk-mapped translation / Hindi / wordMeaning text in the published full JSONs.
 *
 * The Purana and Mahabharata seed scripts attached one passage-level English
 * (or Hindi OCR) text to every verse of the passage, so the same value sits on
 * up to ~3,000 consecutive verses whose Sanskrit differs. Each of those verses
 * then displays a "translation" that is not its own.
 *
 * For `translation`, `hindi` and `wordMeaning`, a value is treated as bulk-mapped when it
 * occurs on 6+ verses of the same scripture. Within each chapter, the value is
 * kept on the first verse of every consecutive run and removed from the rest
 * of that run. Verses whose Sanskrit equals the run's first verse are left
 * alone (those are duplicated verse records, not bulk mapping).
 * No verse counts change.
 *
 *   npx tsx scripts/dedupe-bulk-translations.ts          (dry-run)
 *   npx tsx scripts/dedupe-bulk-translations.ts --write
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
const FIELDS = ["translation", "hindi", "wordMeaning"] as const;
type Field = (typeof FIELDS)[number];

interface Verse {
  number?: number | string;
  sanskrit?: string;
  translation?: string;
  hindi?: string;
  wordMeaning?: string;
  [k: string]: unknown;
}
interface Scripture {
  id: string;
  chapters: { number?: number | string; verses: Verse[] }[];
}

function dedupeField(doc: Scripture, field: Field): { removed: number; bytes: number } {
  const freq = new Map<string, number>();
  for (const ch of doc.chapters) {
    for (const v of ch.verses) {
      const t = (v[field] || "").trim();
      if (t) freq.set(t, (freq.get(t) || 0) + 1);
    }
  }

  let removed = 0;
  let bytes = 0;
  for (const ch of doc.chapters) {
    let runValue = "";
    let runSanskrit = "";
    for (const v of ch.verses) {
      const t = (v[field] || "").trim();
      if (!t || t !== runValue) {
        runValue = t;
        runSanskrit = (v.sanskrit || "").trim();
        continue;
      }
      if ((freq.get(t) || 0) < DUP_THRESHOLD) continue;
      if ((v.sanskrit || "").trim() === runSanskrit) continue;
      bytes += Buffer.byteLength(JSON.stringify(t));
      delete v[field];
      removed++;
    }
  }
  return { removed, bytes };
}

function main(): void {
  const files = readdirSync(DIR).filter((f) => f.endsWith(".json")).sort();
  const totals: Record<Field, number> = { translation: 0, hindi: 0, wordMeaning: 0 };
  let bytesSaved = 0;

  for (const file of files) {
    const doc = JSON.parse(readFileSync(join(DIR, file), "utf8")) as Scripture;
    const counts: Record<Field, number> = { translation: 0, hindi: 0, wordMeaning: 0 };
    for (const field of FIELDS) {
      const { removed, bytes } = dedupeField(doc, field);
      counts[field] = removed;
      totals[field] += removed;
      bytesSaved += bytes;
    }
    if (!counts.translation && !counts.hindi && !counts.wordMeaning) continue;

    console.log(
      `${doc.id}: removed ${counts.translation} repeated translations, ` +
        `${counts.hindi} repeated Hindi, ${counts.wordMeaning} repeated wordMeaning`,
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
    `\n${WRITE ? "Removed" : "Would remove"} ${totals.translation} translations, ` +
      `${totals.hindi} Hindi, ${totals.wordMeaning} wordMeaning (~${(bytesSaved / 1024 / 1024).toFixed(1)}MB) ` +
      `across ${files.length} scriptures.`,
  );
}

main();
