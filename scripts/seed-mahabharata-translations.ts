/**
 * Seed English translations for Mahabharata parvas 8–18 from
 * Kisari Mohan Ganguli's translation (public domain, sacred-texts.com).
 *
 * Parvas 1–7 keep curated highlights unless missing or `--force`.
 *
 * Prerequisite: python scripts/extract-mahabharata-ganguli.py
 * Run: npm run seed:mahabharata-translations
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import { hasTranslation } from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/mahabharata.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/mahabharata-translations.json");
const SOURCE =
  "https://archive.org/details/TheMahabharataOfKrishna-dwaipayanaVyasa; https://sacred-texts.com/hin/";
const CURATED_PARVA_END = 7;
const FIRST_TRANSLATED_PARVA = 8;

const FORCE = process.argv.includes("--force");

type TranslationCache = Record<string, Record<string, string>>;

function shouldFill(parvaNum: number, existing?: string): boolean {
  if (FORCE) return true;
  if (parvaNum <= CURATED_PARVA_END && hasTranslation(existing)) return false;
  return !hasTranslation(existing);
}

async function main(): Promise<void> {
  log(`Seeding Mahabharata from Ganguli cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as TranslationCache;

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const chapter of scripture.chapters) {
    if (chapter.number < FIRST_TRANSLATED_PARVA) continue;
    const parvaCache = cache[String(chapter.number)];

    for (const verse of chapter.verses) {
      const key = String(verse.number);
      const text = parvaCache?.[key];

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
      "Kisari Mohan Ganguli translation (1883–1896, public domain) — Ganguli sections mapped to DharmicData internal chapters with global-stream fallback.",
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