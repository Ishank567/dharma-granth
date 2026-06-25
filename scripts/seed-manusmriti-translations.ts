/**
 * Seed English translations for Manusmriti from Georg Bühler's translation
 * (sacred-texts.com/hin/manu, public domain, 1886).
 *
 * Chapters 1–4 keep curated highlights unless missing or `--force`.
 *
 * Run: npx tsx scripts/seed-manusmriti-translations.ts
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import {
  fetchManuHtml,
  hasTranslation,
  parseManuPage,
} from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/manusmriti.json");
const CACHE_DIR = resolve(ROOT, "scripts/cache/manusmriti-buhler");
const MANU_BASE = "https://www.sacred-texts.com/hin/manu";
const CURATED_CHAPTER_END = 4;

const FORCE = process.argv.includes("--force");

/** JSON verse numbers that diverge from Bühler's numbering. */
const MANUSMRITI_PATCHES: Record<string, string> = {
  "6:76":
    "Let him quit this dwelling, composed of the five elements, where the bones are the beams, which is held together by tendons (instead of cords), where the flesh and the blood are the mortar, which is thatched with the skin, which is foul-smelling, filled with urine and ordure, infested by old age and sorrow, the seat of disease, harassed by pain, gloomy with passion, and perishable.",
  "6:77":
    "Let him quit this dwelling, composed of the five elements, where the bones are the beams, which is held together by tendons (instead of cords), where the flesh and the blood are the mortar, which is thatched with the skin, which is foul-smelling, filled with urine and ordure, infested by old age and sorrow, the seat of disease, harassed by pain, gloomy with passion, and perishable.",
  "7:255":
    "Having eaten there something for the second time, and having been recreated by the sound of music, let him go to rest and rise at the proper time free from fatigue.",
};

function verseIndex(chapterNum: number, verseNumber: number | string): number {
  const n = String(verseNumber);
  if (n.includes(".")) {
    const [ch, verse] = n.split(".");
    if (Number(ch) === chapterNum && /^\d+$/.test(verse)) {
      return Number(verse);
    }
  }
  if (/^\d+$/.test(n)) return Number(n);
  return 0;
}

function shouldFill(chapterNum: number, existing?: string): boolean {
  if (FORCE) return true;
  if (chapterNum <= CURATED_CHAPTER_END && hasTranslation(existing)) return false;
  return !hasTranslation(existing);
}

async function main(): Promise<void> {
  log(`Seeding Manusmriti from Bühler (sacred-texts)${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const byChapter = new Map<number, Map<number, string>>();

  for (let chapter = 1; chapter <= 12; chapter++) {
    const html = fetchManuHtml(MANU_BASE, chapter, CACHE_DIR);
    byChapter.set(chapter, parseManuPage(html));
    log(`  fetched chapter ${chapter} (${byChapter.get(chapter)!.size} verses)`);
  }

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const chapter of scripture.chapters) {
    const chapterVerses = byChapter.get(chapter.number);
    if (!chapterVerses) continue;

    for (const verse of chapter.verses) {
      const idx = verseIndex(chapter.number, verse.number);
      const patch =
        MANUSMRITI_PATCHES[`${chapter.number}:${verse.number}`] ??
        (idx > 0 ? MANUSMRITI_PATCHES[`${chapter.number}:${idx}`] : undefined);
      const text = patch ?? (idx > 0 ? chapterVerses.get(idx) : undefined);

      if (!text) {
        if (!hasTranslation(verse.translation)) missing++;
        continue;
      }

      const isPatch = Boolean(patch);
      if (!isPatch && !shouldFill(chapter.number, verse.translation)) {
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
    translationRepo: `${MANU_BASE}/manu.htm`,
    translationLicense:
      "Georg Bühler translation (1886), sacred-texts.com — public domain.",
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