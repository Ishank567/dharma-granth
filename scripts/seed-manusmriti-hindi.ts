/**
 * Seed Hindi for Manusmriti chapters 5–12 from Dwivedi Hindi translation cache.
 *
 * Chapters 1–4 keep curated highlights unless `--force`.
 *
 * Prerequisite: python scripts/extract-manusmriti-hindi.py
 * Run: npm run seed:manusmriti-hindi
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
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/manusmriti.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/manusmriti-hindi.json");
const CURATED_CHAPTER_END = 4;
const FORCE = process.argv.includes("--force");

interface HindiCache {
  source: string;
  license: string;
  chapters: Record<string, string[]>;
}

async function main(): Promise<void> {
  log(`Seeding Manusmriti Hindi from Dwivedi cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as HindiCache;

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const chapter of scripture.chapters) {
    if (chapter.number <= CURATED_CHAPTER_END) {
      skipped += chapter.verses.filter((v) => hasHindi(v.hindi)).length;
      continue;
    }

    const blocks = cache.chapters[String(chapter.number)] ?? [];
    const mapped = mapSequential(blocks, chapter.verses.length);

    chapter.verses.forEach((verse, index) => {
      const text = mapped[index]?.trim();
      if (!text) {
        if (!hasHindi(verse.hindi)) missing++;
        return;
      }
      if (hasHindi(verse.hindi) && !FORCE) {
        skipped++;
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