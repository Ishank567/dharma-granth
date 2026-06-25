/**
 * Seed English translations for Linga Purana (adhyāyas 4–108) from
 * G.V. Tagare / J.L. Shastri translation (Motilal Banarsidass).
 *
 * Chapters 1–3 keep curated highlights unless missing or `--force`.
 *
 * Prerequisite: python scripts/extract-lingapuran-tagare.py
 * Run: npm run seed:lingapuran-translations
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import { hasTranslation } from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/lingapuran.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/lingapuran-translations.json");
const SOURCE =
  "https://archive.org/details/in.ernet.dli.2015.460751; https://archive.org/details/in.ernet.dli.2015.459303; https://archive.org/details/LingaPuranaJ.L.ShastriPart2";
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
  log(`Seeding Linga Purana from Tagare/Shastri OCR cache${FORCE ? " [force]" : ""}…`);

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
      "G.V. Tagare / J.L. Shastri translation (Motilal Banarsidass) — mapped to GRETIL rks adhyāyas.",
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