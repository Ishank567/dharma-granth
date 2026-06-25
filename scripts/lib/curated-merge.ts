/**
 * Merge hand-authored curated verses (data/scriptures/*.ts) into seeded JSON.
 *
 * Matching order:
 *  1. Structural — `chapter.id` + `verse.id` (seeded `number` like "2.10" → ch2 id10)
 *  2. Sanskrit / transliteration fingerprint — fallback when numbering diverges
 */
import Sanscript from "@indic-transliteration/sanscript";
import { canonicalVerseId } from "../../lib/canonical-verse-id";
import type { FullChapter, FullVerse } from "./scripture-schema";
import { getScripture } from "../../data/scriptures";

interface CuratedVerse {
  id: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  explanation?: string;
  meaning?: string;
  science?: string;
  lifeLesson?: string;
  keywords?: string[];
}

export function normalizeSanskrit(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0951-\u0954\u0900-\u0903]/g, "")
    .normalize("NFC")
    .replace(/[।॥|]/g, " ")
    .replace(/["""''`]/g, "")
    .replace(/ँ/g, "ं")
    .replace(/\s+/g, " ")
    .replace(/##.*?##/g, "")
    .trim();
}

function sanskritFingerprint(s: string, maxLen = 0): string {
  const fp = normalizeSanskrit(s)
    .replace(/[^\u0900-\u097Fa-zA-Z]/g, "")
    .toLowerCase();
  return maxLen > 0 ? fp.slice(0, maxLen) : fp;
}

function transliterationFingerprint(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\\'`.{}³]/g, "")
    .replace(/\{m\+\}/g, "m")
    .replace(/aa/g, "a")
    .replace(/ii/g, "i")
    .replace(/uu/g, "u")
    .replace(/ch/g, "c")
    .replace(/sh/g, "s")
    .replace(/[^a-z]/g, "")
    .slice(0, 60);
}

const TRANSLIT_SCHEMES = ["iast", "itrans", "hk"] as const;

function translitToSanskritFingerprint(s: string): string {
  for (const scheme of TRANSLIT_SCHEMES) {
    try {
      const deva = Sanscript.t(s, scheme, "devanagari");
      if (/[\u0900-\u097F]/.test(deva)) return sanskritFingerprint(deva);
    } catch {
      /* try next scheme */
    }
  }
  return transliterationFingerprint(s);
}

export { canonicalVerseId } from "../../lib/canonical-verse-id";

/** Last segment only — legacy fallback when chapter context is unknown. */
function verseLookupKey(num: number | string): string {
  const s = String(num);
  return s.includes(".") ? (s.split(".").pop() ?? s) : s;
}

function applyCurated(verse: FullVerse, curated: CuratedVerse): FullVerse {
  return {
    ...verse,
    sanskrit: verse.sanskrit || curated.sanskrit,
    transliteration: verse.transliteration || curated.transliteration || "",
    translation: verse.translation || curated.translation,
    hindi: verse.hindi || curated.hindi,
    wordMeaning: verse.wordMeaning || curated.meaning,
    commentary: verse.commentary,
    explanation: verse.explanation || curated.explanation,
    science: verse.science || curated.science,
    lifeLesson: verse.lifeLesson || curated.lifeLesson,
    keywords: verse.keywords?.length ? verse.keywords : curated.keywords,
  };
}

export function findCuratedVerse(
  curatedVerses: CuratedVerse[],
  pubVerse: FullVerse,
  index: number,
  chapterNumber?: number,
): CuratedVerse | undefined {
  if (chapterNumber !== undefined) {
    const key = canonicalVerseId(chapterNumber, pubVerse.number);
    const byStructure = curatedVerses.find((v) => String(v.id) === key);
    if (byStructure) return byStructure;
  }

  const pubFp = sanskritFingerprint(pubVerse.sanskrit ?? "");
  const pubTr = transliterationFingerprint(pubVerse.transliteration ?? "");

  if (pubFp.length >= 12) {
    const exact = curatedVerses.find(
      (v) => sanskritFingerprint(v.sanskrit ?? "") === pubFp,
    );
    if (exact) return exact;

    const byOverlap = curatedVerses.find((v) => {
      const cv = sanskritFingerprint(v.sanskrit ?? "", 80);
      if (!cv) return false;
      return pubFp.startsWith(cv.slice(0, 40)) || cv.startsWith(pubFp.slice(0, 40));
    });
    if (byOverlap) return byOverlap;

    const pubNorm = normalizeSanskrit(pubVerse.sanskrit ?? "");
    if (pubNorm.length >= 12) {
      let best: CuratedVerse | undefined;
      let bestLen = 0;
      for (const cv of curatedVerses) {
        const cur = normalizeSanskrit(cv.sanskrit ?? "");
        if (!cur || cur.length <= pubNorm.length) continue;
        if (cur.includes(pubNorm) && cur.length > bestLen && cv.translation?.trim()) {
          best = cv;
          bestLen = cur.length;
        }
      }
      if (best) return best;
    }
  }

  if (pubTr.length >= 20) {
    const byTr = curatedVerses.find((cv) => {
      const cvTr = transliterationFingerprint(cv.transliteration ?? "");
      if (!cvTr) return false;
      return pubTr.startsWith(cvTr.slice(0, 30)) || cvTr.startsWith(pubTr.slice(0, 30));
    });
    if (byTr) return byTr;
  }

  const key = verseLookupKey(pubVerse.number);
  const byId = curatedVerses.find((v) => String(v.id) === key);
  if (byId) {
    const curatedFp = sanskritFingerprint(byId.sanskrit ?? "");
    if (!pubFp || !curatedFp || pubFp.startsWith(curatedFp.slice(0, 20)) || curatedFp.startsWith(pubFp.slice(0, 20))) {
      return byId;
    }
  }

  if (index >= 0 && index < curatedVerses.length) return curatedVerses[index];

  return undefined;
}

export function mergeCuratedChapters(id: string, seeded: FullChapter[]): FullChapter[] {
  const curated = getScripture(id);
  if (!curated) return seeded;

  const curatedByChapter = new Map(curated.chapters.map((chapter) => [chapter.id, chapter]));
  const seededNumbers = new Set(seeded.map((c) => c.number));
  const finalChapters = seeded.map((chapter): FullChapter => {
    const curatedChapter = curatedByChapter.get(chapter.number);
    if (!curatedChapter) return chapter;

    return {
      ...chapter,
      title: chapter.title || curatedChapter.title,
      titleSanskrit: chapter.titleSanskrit || curatedChapter.titleSanskrit,
      verses: chapter.verses.map((verse, index) => {
        const curatedVerse = findCuratedVerse(
          curatedChapter.verses,
          verse,
          index,
          chapter.number,
        );
        if (!curatedVerse) return verse;
        return applyCurated(verse, curatedVerse);
      }),
    };
  });

  for (const cc of curated.chapters) {
    if (!seededNumbers.has(cc.id)) {
      finalChapters.push({
        number: cc.id,
        title: cc.title,
        titleSanskrit: cc.titleSanskrit,
        verses: cc.verses.map((v) => ({
          number: v.id,
          sanskrit: v.sanskrit,
          transliteration: v.transliteration || "",
          translation: v.translation,
          hindi: v.hindi,
          wordMeaning: v.meaning,
          explanation: v.explanation,
          science: v.science,
          lifeLesson: v.lifeLesson,
          keywords: v.keywords,
        })),
      });
    }
  }

  return finalChapters.sort((a, b) => a.number - b.number);
}

function findSeededVerseByStructure(
  chapters: FullChapter[],
  chapterId: number,
  verseId: number | string,
): { chapterIdx: number; verseIdx: number; verse: FullVerse } | undefined {
  const chapterIdx = chapters.findIndex((c) => c.number === chapterId);
  if (chapterIdx < 0) return undefined;
  const verseIdx = chapters[chapterIdx].verses.findIndex(
    (v) => canonicalVerseId(chapterId, v.number) === String(verseId),
  );
  if (verseIdx < 0) return undefined;
  return { chapterIdx, verseIdx, verse: chapters[chapterIdx].verses[verseIdx] };
}

/** Re-map curated fields by predefined chapter.id + verse.id structure. */
export function stripMisalignedCuratedFields(
  chapters: FullChapter[],
  scriptureId: string,
): { chapters: FullChapter[]; stripped: number; aligned: number } {
  const curated = getScripture(scriptureId);
  if (!curated) return { chapters, stripped: 0, aligned: 0 };

  const strippedBefore = chapters
    .flatMap((c) => c.verses)
    .filter(
      (v) =>
        v.translation?.trim() ||
        v.hindi?.trim() ||
        v.commentary?.trim() ||
        v.explanation?.trim() ||
        v.science?.trim() ||
        v.lifeLesson?.trim(),
    ).length;

  const cleaned: FullChapter[] = chapters.map((chapter) => ({
    ...chapter,
    verses: chapter.verses.map(
      (verse): FullVerse => ({
        ...verse,
        translation: undefined,
        hindi: undefined,
        commentary: undefined,
        wordMeaning: undefined,
        explanation: undefined,
        science: undefined,
        lifeLesson: undefined,
        keywords: undefined,
      }),
    ),
  }));

  let aligned = 0;

  for (const cc of curated.chapters) {
    for (const cv of cc.verses) {
      const hit = findSeededVerseByStructure(cleaned, cc.id, cv.id);
      if (!hit) continue;
      cleaned[hit.chapterIdx].verses[hit.verseIdx] = applyCurated(hit.verse, cv);
      aligned++;
    }
  }

  return { chapters: cleaned, stripped: strippedBefore - aligned, aligned };
}