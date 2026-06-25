/**
 * Seed English translations for Harivamsha Purana (adhyāyas 4–119) from
 * M.N. Dutt's translation (1897, public domain).
 *
 * Chapters 1–3 keep curated highlights unless missing or `--force`.
 *
 * Prerequisite: python scripts/extract-harivanshpuran-dutt.py
 * Run: npm run seed:harivanshpuran-translations
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import { hasTranslation } from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/harivanshpuran.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/harivanshpuran-translations.json");
const SOURCE = "https://www.gutenberg.org/ebooks/18531";
const CURATED_CHAPTER_END = 3;
const FIRST_TRANSLATED_CHAPTER = 4;

const FORCE = process.argv.includes("--force");

type TranslationCache = Record<string, Record<string, string>>;

function shouldFill(chapterNum: number, existing?: string): boolean {
  if (FORCE) return true;
  if (chapterNum <= CURATED_CHAPTER_END && hasTranslation(existing)) return false;
  return !hasTranslation(existing);
}

async function main(): Promise<void> {
  log(`Seeding Harivamsha Purana from Dutt cache${FORCE ? " [force]" : ""}…`);

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
      "M.N. Dutt translation (1897, Project Gutenberg) — prose rendering based on the Harivamsha.",
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