/**
 * Seed Hindi for Vidura Niti (chapters 4–8) from Gita Press Hanuman Prasad Poddar anuvad.
 *
 * Chapters 1–3 keep curated highlights unless `--force`.
 *
 * Prerequisite: python scripts/extract-viduraniti-hindi.py
 * Run: npm run seed:viduraniti-hindi
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
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/viduraniti.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/viduraniti-hindi.json");
const CURATED_CHAPTER_END = 3;
const FORCE = process.argv.includes("--force");

interface HindiCache {
  source: string;
  license: string;
  blocks: string[];
}

async function main(): Promise<void> {
  log(`Seeding Vidura Niti Hindi from Gita Press cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as HindiCache;

  const seedVerses = scripture.chapters
    .filter((ch) => ch.number > CURATED_CHAPTER_END)
    .flatMap((ch) => ch.verses);

  const mapped = mapSequential(cache.blocks, seedVerses.length);

  let filled = 0;
  let skipped = 0;
  let missing = 0;
  let cursor = 0;

  for (const chapter of scripture.chapters) {
    if (chapter.number <= CURATED_CHAPTER_END) {
      skipped += chapter.verses.filter((v) => hasHindi(v.hindi)).length;
      continue;
    }

    for (const verse of chapter.verses) {
      const text = mapped[cursor]?.trim();
      cursor++;

      if (!text) {
        if (!hasHindi(verse.hindi)) missing++;
        continue;
      }
      if (hasHindi(verse.hindi) && !FORCE) {
        skipped++;
        continue;
      }
      verse.hindi = text;
      filled++;
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