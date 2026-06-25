/**
 * Seed Hindi for Garuda Purana chapters 4–317 from Gita Press condensed cache.
 *
 * Chapters 1–3 keep curated highlights unless `--force`.
 * Achara/Dharma/Brahma kandas map to Books 1–3 (ch 4–239, 240–288, 289–317).
 *
 * Prerequisite: python scripts/extract-garudapurana-hindi.py
 * Run: npm run seed:garudapurana-hindi
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
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/garudpurana.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/garudapurana-hindi.json");
const CURATED_CHAPTER_END = 3;
const BOOK2_CHAPTER_START = 240;
const BOOK3_CHAPTER_START = 289;
const FORCE = process.argv.includes("--force");

interface HindiCache {
  source: string;
  license: string;
  achara: string[];
  dharma: string[];
  brahma: string[];
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
  log(`Seeding Garuda Purana Hindi from Gita Press cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as HindiCache;

  const acharaChapters = scripture.chapters.filter(
    (ch) => ch.number > CURATED_CHAPTER_END && ch.number < BOOK2_CHAPTER_START,
  );
  const dharmaChapters = scripture.chapters.filter(
    (ch) => ch.number >= BOOK2_CHAPTER_START && ch.number < BOOK3_CHAPTER_START,
  );
  const brahmaChapters = scripture.chapters.filter((ch) => ch.number >= BOOK3_CHAPTER_START);

  const acharaVerseCount = acharaChapters.reduce((n, ch) => n + ch.verses.length, 0);
  const dharmaVerseCount = dharmaChapters.reduce((n, ch) => n + ch.verses.length, 0);
  const brahmaVerseCount = brahmaChapters.reduce((n, ch) => n + ch.verses.length, 0);

  const acharaMapped = mapSequential(cache.achara, acharaVerseCount);
  const dharmaMapped = mapSequential(cache.dharma, dharmaVerseCount);
  const brahmaMapped = mapSequential(cache.brahma, brahmaVerseCount);

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  let acharaCursor = 0;
  for (const chapter of acharaChapters) {
    acharaCursor = fillChapterVerses(acharaMapped, acharaCursor, chapter.verses.length, (index, text) => {
      const verse = chapter.verses[index];
      if (hasHindi(verse.hindi) && !FORCE) {
        skipped++;
        return;
      }
      verse.hindi = text;
      filled++;
    });
  }

  let dharmaCursor = 0;
  for (const chapter of dharmaChapters) {
    dharmaCursor = fillChapterVerses(
      dharmaMapped,
      dharmaCursor,
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

  let brahmaCursor = 0;
  for (const chapter of brahmaChapters) {
    brahmaCursor = fillChapterVerses(
      brahmaMapped,
      brahmaCursor,
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