/**
 * Seed Hindi for Vishnu Purana from Gita Press Hindi translation cache.
 *
 * Hindi blocks are mapped per amsha (book 1–6). Chapters 1–3 keep curated
 * highlights unless `--force`.
 *
 * Prerequisite: python scripts/extract-vishnupurana-hindi.py
 * Run: npm run seed:vishnupurana-hindi
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  countHindi,
  hasHindi,
  mapSequential,
} from "./lib/hindi-seed";
import { FullChapter, FullScripture, log, writeScripture } from "./lib/scripture-schema";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/vishnupurana.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/vishnupurana-hindi.json");
const CURATED_CHAPTER_END = 3;
const FORCE = process.argv.includes("--force");

interface HindiCache {
  source: string;
  license: string;
  books: Record<string, string[]>;
  bookOffsets?: Record<string, number>;
}

function bookNumber(chapter: FullChapter): number {
  const match = chapter.title.match(/^Book\s+(\d+)/);
  if (!match) {
    throw new Error(`Could not parse book number from chapter title: ${chapter.title}`);
  }
  return Number(match[1]);
}

async function main(): Promise<void> {
  log(`Seeding Vishnu Purana Hindi from Gita Press cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as HindiCache;

  const byBook = new Map<number, FullChapter[]>();
  for (const chapter of scripture.chapters) {
    const book = bookNumber(chapter);
    const group = byBook.get(book) ?? [];
    group.push(chapter);
    byBook.set(book, group);
  }

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const [book, chapters] of [...byBook.entries()].sort((a, b) => a[0] - b[0])) {
    const offset = cache.bookOffsets?.[String(book)] ?? 0;
    const blocks = (cache.books[String(book)] ?? []).slice(offset);
    const targets: Array<{ chapter: FullChapter; verse: FullChapter["verses"][number] }> = [];

    for (const chapter of chapters) {
      for (const verse of chapter.verses) {
        if (chapter.number <= CURATED_CHAPTER_END && hasHindi(verse.hindi) && !FORCE) {
          skipped++;
          continue;
        }
        if (hasHindi(verse.hindi) && !FORCE) {
          skipped++;
          continue;
        }
        targets.push({ chapter, verse });
      }
    }

    const mapped = mapSequential(blocks, targets.length);
    targets.forEach(({ verse }, index) => {
      const text = mapped[index]?.trim();
      if (!text) {
        missing++;
        return;
      }
      verse.hindi = text;
      filled++;
    });
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