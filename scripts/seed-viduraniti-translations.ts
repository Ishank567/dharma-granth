/**
 * Seed English translations for Vidura Niti (chapters 4–8 / adhyāyas 36–40)
 * from KM Ganguli's Mahabharata translation (public domain).
 *
 * Chapters 1–3 keep curated highlights unless missing or `--force`.
 *
 * Prerequisite: python scripts/extract-viduraniti-pdf.py
 * Run: npx tsx scripts/seed-viduraniti-translations.ts
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import { hasTranslation } from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/viduraniti.json");
const CACHE_PATH = resolve(ROOT, "scripts/cache/viduraniti-translations.json");
const GANGULI_SOURCE = "https://www.sacred-texts.com/hin/m05/index.htm";
const CURATED_CHAPTER_END = 3;

const FORCE = process.argv.includes("--force");

type TranslationCache = Record<string, Record<string, string>>;

function extractAdhyaya(chapter: { verses: { sanskrit?: string }[] }): number | null {
  const header = chapter.verses[0]?.sanskrit ?? "";
  const m = header.match(/अध्यायः\s*([०-९\d]+)/);
  if (!m) return null;
  const dev = "०१२३४५६७८९";
  let n = "";
  for (const ch of m[1]) {
    const idx = dev.indexOf(ch);
    n += idx >= 0 ? String(idx) : ch;
  }
  const num = Number(n);
  return Number.isFinite(num) ? num : null;
}

function verseIndex(verseNumber: number | string): number {
  const n = String(verseNumber);
  return /^\d+$/.test(n) ? Number(n) : 0;
}

function shouldFill(chapterNum: number, existing?: string): boolean {
  if (FORCE) return true;
  if (chapterNum <= CURATED_CHAPTER_END && hasTranslation(existing)) return false;
  return !hasTranslation(existing);
}

async function main(): Promise<void> {
  log(`Seeding Vidura Niti from Ganguli PDF cache${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8")) as TranslationCache;

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const chapter of scripture.chapters) {
    const adhyaya = extractAdhyaya(chapter);
    if (!adhyaya) continue;

    const adhyayaVerses = cache[String(adhyaya)];
    if (!adhyayaVerses) {
      missing += chapter.verses.length;
      continue;
    }

    for (const verse of chapter.verses) {
      const idx = verseIndex(verse.number);
      const text = adhyayaVerses[String(idx)];

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
    translationRepo: GANGULI_SOURCE,
    translationLicense:
      "KM Ganguli Mahabharata translation (1883–1896), sacred-texts.com — public domain.",
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