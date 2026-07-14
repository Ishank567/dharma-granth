/**
 * Seed English translations for Durga Saptashati (Devi Mahatmyam)
 * from F. Eden Pargiter's Markandeya Purana (1904, public domain).
 *
 * Prerequisite: python scripts/extract-durgasaptashati-pargiter.py
 * Run: npx tsx scripts/seed-durgasaptashati-translations.ts
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import { hasTranslation } from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(
  ROOT,
  "public/data/scriptures-full/durgasaptashati.json",
);
const CACHE_PATH = resolve(
  ROOT,
  "scripts/cache/durgasaptashati-translations.json",
);
const PARGITER_SOURCE = "https://archive.org/details/markandeyapurana00parguoft";

const FORCE = process.argv.includes("--force");

type TranslationCache = Record<string, Record<string, string>>;

async function main(): Promise<void> {
  log(
    `Seeding Durga Saptashati from Pargiter OCR cache${FORCE ? " [force]" : ""}…`,
  );

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(
    readFileSync(CACHE_PATH, "utf8"),
  ) as TranslationCache;

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const chapter of scripture.chapters) {
    const chapterCache = cache[String(chapter.number)];

    for (const verse of chapter.verses) {
      const key = String(verse.number);
      const text = chapterCache?.[key];

      if (!text) {
        if (!hasTranslation(verse.translation)) missing++;
        continue;
      }

      if (!FORCE && hasTranslation(verse.translation)) {
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
    translationRepo: PARGITER_SOURCE,
    translationLicense:
      "F. Eden Pargiter translation of Markandeya Purana Devi-mahatmya (1904), Asiatic Society of Bengal — public domain. OCR-aligned; sequential mapping where verse counts differ.",
    translationFetchedAt: new Date().toISOString(),
  } as FullScripture["source"];

  const out = writeScripture(scripture);
  log(`✓ ${out}`);
  log(`  filled ${filled} · kept ${skipped} curated · still missing ${missing}`);
  log(
    `  coverage: ${translated}/${total} (${Math.round((translated / total) * 100)}%)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
