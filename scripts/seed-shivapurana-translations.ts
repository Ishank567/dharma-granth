/**
 * Seed English translations for Shiva Purana (Samhitas 7–11) from
 * J.L. Shastri translation (Motilal Banarsidass).
 *
 * Chapters 1–6 keep curated highlights unless missing or `--force`.
 *
 * Prerequisite: python scripts/extract-shivapurana-tagare.py
 * Run: npm run seed:shivapurana-translations
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import { hasTranslation } from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/shivpurana.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/shivapurana-translations.json");
const SOURCE =
  "https://archive.org/details/dli.bengal.10689.12959; https://archive.org/details/dli.bengal.10689.12960";
const CURATED_CHAPTER_END = 6;
const FIRST_TRANSLATED_CHAPTER = 7;

const FORCE = process.argv.includes("--force");

type TranslationCache = Record<string, Record<string, string>>;

function shouldFill(chapterNum: number, existing?: string): boolean {
  if (FORCE) return true;
  if (chapterNum <= CURATED_CHAPTER_END && hasTranslation(existing)) return false;
  return !hasTranslation(existing);
}

async function main(): Promise<void> {
  log(`Seeding Shiva Purana from Shastri OCR cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as TranslationCache;

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const chapter of scripture.chapters) {
    if (chapter.number < FIRST_TRANSLATED_CHAPTER) continue;
    const chapterCache = cache[String(chapter.number)];

    for (const verse of chapter.verses) {
      const key = String(verse.number);
      const text = chapterCache?.[key];

      if (!text) {
        if (!hasTranslation(verse.translation)) missing++;
        continue;
      }

      if (!shouldFill(chapter.number, verse.translation)) {
        skipped++;
        continue;
      }

      verse.translation = text;
      filled++;
    }
  }

  const total = scripture.chapters.reduce((n, c) => n + c.verses.length, 0);
  const translated = scripture.chapters.reduce(
    (n, c) => n + c.verses.filter((v) => hasTranslation(v.translation)).length,
    0,
  );

  scripture.source = {
    ...scripture.source,
    translationRepo: SOURCE,
    translationLicense:
      "J.L. Shastri translation (Motilal Banarsidass) — Samhitas 7–11 mapped from parts III–IV OCR with global-stream fallback.",
    translationFetchedAt: new Date().toISOString(),
  };

  const out = writeScripture(scripture);
  log(`✓ ${out}`);
  log(`  filled ${filled} · kept ${skipped} curated · still missing ${missing}`);
  log(`  coverage: ${translated}/${total} (${Math.round((translated / total) * 100)}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});