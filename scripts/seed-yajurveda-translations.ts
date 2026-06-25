/**
 * Seed English translations for Yajur Veda (adhyāyas 5–40) from Griffith's
 * White Yajur Veda (sacred-texts.com/hin/wyv, public domain, 1899).
 *
 * Chapters 1–4 keep curated highlights unless missing or `--force`.
 *
 * Run: npx tsx scripts/seed-yajurveda-translations.ts
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import {
  fetchWyvHtml,
  hasTranslation,
  parseGriffithYajurBook,
} from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/yajurveda.json");
const CACHE_DIR = resolve(ROOT, "scripts/cache/yajurveda-griffith");
const WYV_BASE = "https://www.sacred-texts.com/hin/wyv";
const CURATED_CHAPTER_END = 4;
const FIRST_GRIFFITH_CHAPTER = 5;

const FORCE = process.argv.includes("--force");

/** Griffith numbering quirks and omitted blocks. */
const YAJURVEDA_PATCHES: Record<string, string> = {
  // Griffith labels this verse 68; our JSON uses 58.
  "23:58":
    "Sixfold its form, its syllables a hundred, eighty burnt-offerings, just three brands for kindling. To thee I tell the rites of sacrificing. Seven Hotars worship in appointed season.",
  // Griffith mislabels this verse as "S5" (OCR for 86).
  "20:86":
    "She who awakens sounds of joy, inspires our hymns, Sarasvatî, she hath allowed our sacrifice.",
  // Griffith prints this block as a second "21" after verse 23.
  "36:24":
    "Through hundred autumns may we see that bright Eye, God-appointed, rise, A hundred autumns may we live. Through hundred autumns may we hear; through hundred autumns clearly speak: through hundred autumns live content; a hundred autumns, yea, beyond a hundred autumns may we see.",
};

function verseIndex(chapterNum: number, verseNumber: number | string): number {
  const n = String(verseNumber);
  if (n.includes(".")) {
    const [ch, verse] = n.split(".");
    if (Number(ch) === chapterNum && /^\d+$/.test(verse)) return Number(verse);
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
  log(`Seeding Yajur Veda from Griffith (sacred-texts)${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const byChapter = new Map<number, Map<number, string>>();

  for (const chapter of scripture.chapters) {
    if (chapter.number < FIRST_GRIFFITH_CHAPTER) continue;
    const html = fetchWyvHtml(WYV_BASE, chapter.number, CACHE_DIR);
    byChapter.set(chapter.number, parseGriffithYajurBook(html, chapter.verses.length));
    log(`  fetched adhyāya ${chapter.number} (${byChapter.get(chapter.number)!.size} verses)`);
  }

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const chapter of scripture.chapters) {
    const chapterVerses = byChapter.get(chapter.number);

    for (const verse of chapter.verses) {
      const idx = verseIndex(chapter.number, verse.number);
      const patch =
        YAJURVEDA_PATCHES[`${chapter.number}:${verse.number}`] ??
        (idx > 0 ? YAJURVEDA_PATCHES[`${chapter.number}:${idx}`] : undefined);
      const text = patch ?? (chapterVerses && idx > 0 ? chapterVerses.get(idx) : undefined);

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
    translationRepo: `${WYV_BASE}/index.htm`,
    translationLicense:
      "Ralph T.H. Griffith translation (1899), sacred-texts.com — public domain.",
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