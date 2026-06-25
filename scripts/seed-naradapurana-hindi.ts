/**
 * Seed Hindi for Narada Purana chapters 7–167 from Gita Press condensed cache.
 *
 * Chapters 1–6 keep curated highlights unless `--force`.
 * Purva/Uttara streams map globally across Book 1 (ch 7–124) and Book 2 (ch 125–167).
 *
 * Prerequisite: python scripts/extract-naradapurana-hindi.py
 * Run: npm run seed:naradapurana-hindi
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
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/naradapuran.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/naradapurana-hindi.json");
const CURATED_CHAPTER_END = 6;
const BOOK2_CHAPTER_START = 125;
const FORCE = process.argv.includes("--force");

interface HindiCache {
  source: string;
  license: string;
  purva: string[];
  uttara: string[];
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
  log(`Seeding Narada Purana Hindi from Gita Press cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as HindiCache;

  const book1Chapters = scripture.chapters.filter(
    (ch) => ch.number > CURATED_CHAPTER_END && ch.number < BOOK2_CHAPTER_START,
  );
  const book2Chapters = scripture.chapters.filter((ch) => ch.number >= BOOK2_CHAPTER_START);

  const book1VerseCount = book1Chapters.reduce((n, ch) => n + ch.verses.length, 0);
  const book2VerseCount = book2Chapters.reduce((n, ch) => n + ch.verses.length, 0);

  const purvaMapped = mapSequential(cache.purva, book1VerseCount);
  const uttaraMapped = mapSequential(cache.uttara, book2VerseCount);

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  let purvaCursor = 0;
  for (const chapter of book1Chapters) {
    purvaCursor = fillChapterVerses(purvaMapped, purvaCursor, chapter.verses.length, (index, text) => {
      const verse = chapter.verses[index];
      if (hasHindi(verse.hindi) && !FORCE) {
        skipped++;
        return;
      }
      verse.hindi = text;
      filled++;
    });
  }

  let uttaraCursor = 0;
  for (const chapter of book2Chapters) {
    uttaraCursor = fillChapterVerses(
      uttaraMapped,
      uttaraCursor,
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

  for (const chapter of scripture.chapters) {
    if (chapter.number > CURATED_CHAPTER_END) continue;
    skipped += chapter.verses.filter((v) => hasHindi(v.hindi)).length;
  }

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