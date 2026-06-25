/**
 * Seed English translations for Skanda Purana Revakhanda (adhyāyas 5–116)
 * from G.V. Tagare's translation (Motilal Banarsidass, UNESCO Indian Series).
 *
 * Chapters 1–4 keep curated highlights unless missing or `--force`.
 *
 * Prerequisite: python scripts/extract-skandapuran-tagare.py
 * Run: npm run seed:skandapuran-translations
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import { hasTranslation } from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/skandapuran.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/skandapuran-translations.json");
const SOURCE =
  "https://archive.org/details/in.ernet.dli.2015.100076; https://archive.org/details/the-skanda-purana-vol-25-ancient-indian-tradition-and-mythology";
const CURATED_CHAPTER_END = 4;
const FIRST_TRANSLATED_CHAPTER = 5;

const FORCE = process.argv.includes("--force");

type TranslationCache = Record<string, Record<string, string>>;

function shouldFill(chapterNum: number, existing?: string): boolean {
  if (FORCE) return true;
  if (chapterNum <= CURATED_CHAPTER_END && hasTranslation(existing)) return false;
  return !hasTranslation(existing);
}

async function main(): Promise<void> {
  log(`Seeding Skanda Purana from Tagare OCR cache${FORCE ? " [force]" : ""}…`);

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
      "G.V. Tagare translation (Motilal Banarsidass, UNESCO Indian Series) — Revakhanda; mapped to GRETIL rks adhyāyas.",
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