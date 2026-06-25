/**
 * Seed Hindi for Brahmanda Purana chapters 4–156 from Gita Press cache.
 *
 * Chapters 1–3 keep curated highlights unless `--force`.
 * Book 1 (ch 4–38) and Books 2–3 (ch 39–156) map from separate OCR streams.
 *
 * Prerequisite: python scripts/extract-brahmandapurana-hindi.py
 * Run: npm run seed:brahmandapurana-hindi
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  countHindi,
  hasHindi,
  mapSequential,
} from "./lib/hindi-seed";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/brahmandpuran.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/brahmandapurana-hindi.json");
const CURATED_CHAPTER_END = 3;
const BOOK2_CHAPTER_START = 39;
const FORCE = process.argv.includes("--force");

interface HindiCache {
  source: string;
  license: string;
  book1: string[];
  book23: string[];
}

function fillChapterVerses(
  mapped: string[],
  startIndex: number,
  verseCount: number,
  onFill: (verseIndex: number, text: string) => void,
): number {
  for (let index = 0; index < verseCount; index++) {
    const text = mapped[startIndex + index]?.trim();
    if (text) onFill(index, text);
  }
  return startIndex + verseCount;
}

async function main(): Promise<void> {
  log(`Seeding Brahmanda Purana Hindi from Gita Press cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as HindiCache;

  const book1Chapters = scripture.chapters.filter(
    (ch) => ch.number > CURATED_CHAPTER_END && ch.number < BOOK2_CHAPTER_START,
  );
  const book23Chapters = scripture.chapters.filter((ch) => ch.number >= BOOK2_CHAPTER_START);

  const book1VerseCount = book1Chapters.reduce((n, ch) => n + ch.verses.length, 0);
  const book23VerseCount = book23Chapters.reduce((n, ch) => n + ch.verses.length, 0);

  const book1Mapped = mapSequential(cache.book1, book1VerseCount);
  const book23Mapped = mapSequential(cache.book23, book23VerseCount);

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  let book1Cursor = 0;
  for (const chapter of book1Chapters) {
    book1Cursor = fillChapterVerses(book1Mapped, book1Cursor, chapter.verses.length, (index, text) => {
      const verse = chapter.verses[index];
      if (hasHindi(verse.hindi) && !FORCE) {
        skipped++;
        return;
      }
      verse.hindi = text;
      filled++;
    });
  }

  let book23Cursor = 0;
  for (const chapter of book23Chapters) {
    book23Cursor = fillChapterVerses(
      book23Mapped,
      book23Cursor,
      chapter.verses.length,
      (index, text) => {
        const verse = chapter.verses[index];
        if (hasHindi(verse.hindi) && !FORCE) {
          skipped++;
          return;
        }
        verse.hindi = text;
        filled++;
      },
    );
  }

  skipped += scripture.chapters
    .filter((ch) => ch.number <= CURATED_CHAPTER_END)
    .reduce((n, ch) => n + ch.verses.filter((v) => hasHindi(v.hindi)).length, 0);

  for (const chapter of scripture.chapters) {
    if (chapter.number <= CURATED_CHAPTER_END) continue;
    for (const verse of chapter.verses) {
      if (!hasHindi(verse.hindi)) missing++;
    }
  }

  scripture.source = {
    ...scripture.source,
    hindiRepo: cache.source,
    hindiLicense: cache.license,
    hindiFetchedAt: new Date().toISOString(),
  };

  const out = writeScripture(scripture);
  const stats = countHindi(scripture);
  log(`✓ ${out}`);
  log(`  filled ${filled} · kept ${skipped} curated · still missing ${missing}`);
  log(
    `  coverage: ${stats.withHindi}/${stats.total} (${Math.round((stats.withHindi / stats.total) * 100)}%)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});