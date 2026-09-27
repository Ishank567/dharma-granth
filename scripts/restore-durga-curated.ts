/**
 * Re-apply non-empty curated Durga fields after a translation seed.
 *
 * Durga's published text splits speakers and some half-verses into separate
 * records, so curated verse numbers are not reliable. Match normalized
 * Sanskrit first and remove only values known to have come from the curated
 * source before re-applying them at the correct verse.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { durgasaptashati } from "../data/scriptures/durgasaptashati";
import { normalizeSanskrit } from "./lib/curated-merge";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = resolve(ROOT, "public/data/scriptures-full/durgasaptashati.json");

type PubVerse = {
  number: number | string;
  sanskrit?: string;
  translation?: string;
  hindi?: string;
  commentary?: string;
  explanation?: string;
  wordMeaning?: string;
  transliteration?: string;
  science?: string;
  lifeLesson?: string;
  keywords?: string[];
};

const doc = JSON.parse(readFileSync(PUB, "utf8")) as {
  chapters: { number: number; verses: PubVerse[] }[];
};

const valueFields = [
  "hindi",
  "commentary",
  "explanation",
  "wordMeaning",
  "science",
  "lifeLesson",
] as const;

const knownCuratedValues = new Set<string>();
for (const chapter of durgasaptashati.chapters) {
  for (const verse of chapter.verses) {
    const values = [
      verse.hindi,
      verse.explanation,
      verse.science,
      verse.lifeLesson,
    ];
    for (const value of values) {
      if (value?.trim()) knownCuratedValues.add(value.trim());
    }
  }
}

let removed = 0;
for (const chapter of doc.chapters) {
  for (const verse of chapter.verses) {
    for (const field of valueFields) {
      const value = verse[field];
      if (
        value?.trim() &&
        (knownCuratedValues.has(value.trim()) ||
          /\?{2,}/.test(value))
      ) {
        delete verse[field];
        removed++;
      }
    }
  }
}

// Preserve the corpus-wide reading-note convention introduced for complete
// English texts. These fallbacks are deliberately replaced by richer curated
// fields below wherever a trustworthy Sanskrit match exists.
for (const chapter of doc.chapters) {
  for (const verse of chapter.verses) {
    const translation = verse.translation?.trim();
    if (!translation) continue;
    if (!verse.wordMeaning?.trim()) verse.wordMeaning = translation;
    if (!verse.commentary?.trim()) {
      verse.commentary =
        `Plain sense of this Devi Mahatmyam verse (F.E. Pargiter, public domain): ${translation}`;
    }
    if (!verse.explanation?.trim()) verse.explanation = verse.commentary;
  }
}

const fingerprint = (value = "") =>
  normalizeSanskrit(value).replace(/[^\u0900-\u097F]/g, "");

const published = doc.chapters.flatMap((chapter) =>
  chapter.verses.map((verse) => ({ chapter: chapter.number, verse })),
);

let restored = 0;
let unmatched = 0;
for (const curatedCh of durgasaptashati.chapters) {
  for (const cv of curatedCh.verses) {
    // IDs 1000+ are mechanically generated full-text records. Their old
    // enrichment fields were produced by the number-based merge bug; only
    // the hand-authored highlight records are authoritative here.
    if (Number(cv.id) >= 1000) continue;
    const hasCuratedContent = Boolean(
      cv.translation?.trim() ||
        cv.hindi?.trim() ||
        cv.explanation?.trim() ||
        cv.science?.trim() ||
        cv.lifeLesson?.trim(),
    );
    if (!hasCuratedContent) continue;

    const curatedFp = fingerprint(cv.sanskrit);
    const curatedStart = curatedFp.slice(0, 24);
    const hit = published.find(({ verse }) => {
      const pubFp = fingerprint(verse.sanskrit);
      return curatedFp.length >= 12 && (
        pubFp === curatedFp ||
        pubFp.includes(curatedFp) ||
        curatedFp.includes(pubFp) ||
        (curatedStart.length >= 20 && pubFp.includes(curatedStart))
      );
    });
    if (!hit) {
      unmatched++;
      console.warn(`No Sanskrit match for ${curatedCh.id}:${cv.id}`);
      continue;
    }
    const target = hit.verse;

    if (cv.translation?.trim()) target.translation = cv.translation.trim();
    if (cv.hindi?.trim()) target.hindi = cv.hindi.trim();
    if (cv.explanation?.trim()) {
      const explanation = cv.explanation.trim();
      target.commentary = explanation;
      target.explanation = explanation;
      target.wordMeaning = explanation;
    }
    if (cv.transliteration?.trim()) {
      target.transliteration = cv.transliteration.trim();
    }
    if (cv.science?.trim()) target.science = cv.science.trim();
    if (cv.lifeLesson?.trim()) target.lifeLesson = cv.lifeLesson.trim();
    if (cv.keywords?.length) target.keywords = cv.keywords;
    restored++;
    console.log(
      `Restored curated ${curatedCh.id}:${cv.id} to ${hit.chapter}:${target.number}`,
    );
  }
}

writeFileSync(PUB, JSON.stringify(doc, null, 2) + "\n", "utf8");
console.log(
  `Removed ${removed} known curated values; restored ${restored} field sets; unmatched ${unmatched}`,
);
