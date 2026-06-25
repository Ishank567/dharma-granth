/**
 * Seed Hindi for Brahma Purana chapters 5–246 from Gita Press condensed cache.
 *
 * Chapters 1–4 keep curated highlights unless `--force`.
 * Main body (ch 5–140) and Gautami-Mahatmya (ch 141–246) map from separate streams.
 *
 * Prerequisite: python scripts/extract-brahmapurana-hindi.py
 * Run: npm run seed:brahmapurana-hindi
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
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/brahmapuran.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/brahmapurana-hindi.json");
const CURATED_CHAPTER_END = 4;
const GAUTAMI_CHAPTER_START = 141;
const FORCE = process.argv.includes("--force");

interface HindiCache {
  source: string;
  license: string;
  main: string[];
  gautami: string[];
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
  log(`Seeding Brahma Purana Hindi from Gita Press cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as HindiCache;

  const mainChapters = scripture.chapters.filter(
    (ch) => ch.number > CURATED_CHAPTER_END && ch.number < GAUTAMI_CHAPTER_START,
  );
  const gautamiChapters = scripture.chapters.filter((ch) => ch.number >= GAUTAMI_CHAPTER_START);

  const mainVerseCount = mainChapters.reduce((n, ch) => n + ch.verses.length, 0);
  const gautamiVerseCount = gautamiChapters.reduce((n, ch) => n + ch.verses.length, 0);

  const mainMapped = mapSequential(cache.main, mainVerseCount);
  const gautamiMapped = mapSequential(cache.gautami, gautamiVerseCount);

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  let mainCursor = 0;
  for (const chapter of mainChapters) {
    mainCursor = fillChapterVerses(mainMapped, mainCursor, chapter.verses.length, (index, text) => {
      const verse = chapter.verses[index];
      if (hasHindi(verse.hindi) && !FORCE) {
        skipped++;
        return;
      }
      verse.hindi = text;
      filled++;
    });
  }

  let gautamiCursor = 0;
  for (const chapter of gautamiChapters) {
    gautamiCursor = fillChapterVerses(
      gautamiMapped,
      gautamiCursor,
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