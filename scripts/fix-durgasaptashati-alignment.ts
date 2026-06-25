/**
 * P3 fix — re-align durgasaptashati curated translations to matching Sanskrit.
 *
 * The old mergeCuratedChapters keyed by verse-number suffix ("1.3" → id 3),
 * spreading translations onto wrong verses. This script strips misaligned
 * fields and re-applies via the predefined chapter.id + verse.id structure
 * (seeded "2.10" ↔ curated ch2 id10).
 *
 * Usage:
 *   npx tsx scripts/fix-durgasaptashati-alignment.ts
 *   npx tsx scripts/fix-durgasaptashati-alignment.ts --write
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { FullScripture } from "./lib/scripture-schema";
import { stripMisalignedCuratedFields } from "./lib/curated-merge";

const PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
  "scriptures-full",
  "durgasaptashati.json",
);
const WRITE = process.argv.includes("--write");

const doc = JSON.parse(readFileSync(PATH, "utf-8")) as FullScripture;
const before = doc.chapters
  .flatMap((c) => c.verses)
  .filter((v) => v.translation?.trim() || v.hindi?.trim()).length;

const { chapters, stripped, aligned } = stripMisalignedCuratedFields(
  doc.chapters,
  "durgasaptashati",
);
doc.chapters = chapters;
doc.totalVerses = chapters.reduce((s, c) => s + c.verses.length, 0);

const after = doc.chapters
  .flatMap((c) => c.verses)
  .filter((v) => v.translation?.trim() || v.hindi?.trim()).length;

console.log(`Before: ${before} verses with translation/hindi`);
console.log(`Stripped misaligned: ${stripped}`);
console.log(`Aligned (kept/re-applied): ${aligned}`);
console.log(`After:  ${after} verses with translation/hindi`);

if (WRITE) {
  writeFileSync(PATH, JSON.stringify(doc, null, 2) + "\n", "utf-8");
  console.log(`\nWrote ${PATH}`);
} else {
  console.log("\n[dry run] Re-run with --write to apply.");
}