/**
 * Re-apply non-empty curated Durga translations after a force-seed.
 * Matches by chapter.id + verse.id (same structure as fix-durgasaptashati-alignment).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { durgasaptashati } from "../data/scriptures/durgasaptashati";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB = resolve(ROOT, "public/data/scriptures-full/durgasaptashati.json");

type PubVerse = {
  number: number | string;
  translation?: string;
  hindi?: string;
  commentary?: string;
  explanation?: string;
  wordMeaning?: string;
  transliteration?: string;
};

const doc = JSON.parse(readFileSync(PUB, "utf8")) as {
  chapters: { number: number; verses: PubVerse[] }[];
};

let restored = 0;
for (const curatedCh of durgasaptashati.chapters) {
  const pubCh = doc.chapters.find((c) => c.number === curatedCh.id);
  if (!pubCh) continue;

  for (const cv of curatedCh.verses) {
    const tr = (cv.translation || "").trim();
    if (tr.length < 20) continue;

    // Prefer verse number "ch.id" match, else bare id suffix
    const candidates = [
      `${curatedCh.id}.${cv.id}`,
      String(cv.id),
    ];
    let target = pubCh.verses.find((v) =>
      candidates.includes(String(v.number)),
    );
    // bulk seeded ids 1001+ map to sequential verse numbers in chapter
    if (!target && cv.id >= 1000) {
      const idx = cv.id - 1000; // 1-based offset within chapter often
      // try matching by sanskrit start
      const sa = (cv.sanskrit || "").replace(/[^\u0900-\u097F]/g, "").slice(0, 20);
      if (sa) {
        target = pubCh.verses.find((v) => {
          const psa = String((v as { sanskrit?: string }).sanskrit || "")
            .replace(/[^\u0900-\u097F]/g, "")
            .slice(0, 20);
          return psa === sa;
        });
      }
    }
    if (!target) continue;

    target.translation = tr;
    if (cv.hindi?.trim()) target.hindi = cv.hindi.trim();
    if (cv.explanation?.trim()) {
      target.commentary = cv.explanation.trim();
      target.explanation = cv.explanation.trim();
      if (!target.wordMeaning?.trim()) {
        target.wordMeaning = cv.explanation.trim();
      }
    }
    if (cv.transliteration?.trim()) {
      target.transliteration = cv.transliteration.trim();
    }
    restored++;
  }
}

writeFileSync(PUB, JSON.stringify(doc, null, 2) + "\n", "utf8");
console.log(`Restored ${restored} curated Durga verse field sets`);
