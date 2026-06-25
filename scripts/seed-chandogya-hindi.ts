/**
 * Seed Hindi for Chandogya Upanishad from Gita Press Shankara-bhashya Hindi tika
 * (archive.org phAO_chandogya-upanishad-gita-press-gorakhpur).
 *
 * OCR commentary blocks are mapped sequentially to published verses; curated
 * `hindi` highlights are preserved unless `--force`.
 *
 * Prerequisite: python scripts/extract-chandogya-hindi.py
 * Run: npm run seed:chandogya-hindi
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  countHindi,
  flattenVerses,
  hasHindi,
  mapSequential,
} from "./lib/hindi-seed";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/chandogya.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/chandogya-hindi.json");
const FORCE = process.argv.includes("--force");

interface HindiCache {
  source: string;
  license: string;
  blocks: string[];
}

async function main(): Promise<void> {
  log(`Seeding Chandogya Hindi from Gita Press cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as HindiCache;
  const rows = flattenVerses(scripture.chapters);
  const mapped = mapSequential(cache.blocks, rows.length);

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  rows.forEach(({ verse }, index) => {
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