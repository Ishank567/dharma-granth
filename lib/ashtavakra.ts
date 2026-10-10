/**
 * Server-side loader for the Ashtavakra Gita content. Only chapters that have
 * been transcribed, checked and composed (data/ashtavakra/chapter-N.json) are
 * published; everything else is shown as not yet available rather than guessed.
 */
import chapter1 from '@/data/ashtavakra/chapter-1.json';
import chapter2 from '@/data/ashtavakra/chapter-2.json';
import chapter3 from '@/data/ashtavakra/chapter-3.json';
import chapter4 from '@/data/ashtavakra/chapter-4.json';
import chapter5 from '@/data/ashtavakra/chapter-5.json';
import chapter6 from '@/data/ashtavakra/chapter-6.json';
import chapter7 from '@/data/ashtavakra/chapter-7.json';
import chapter8 from '@/data/ashtavakra/chapter-8.json';
import chapter9 from '@/data/ashtavakra/chapter-9.json';
import chapter10 from '@/data/ashtavakra/chapter-10.json';
import chapter11 from '@/data/ashtavakra/chapter-11.json';
import chapter12 from '@/data/ashtavakra/chapter-12.json';
import chapter13 from '@/data/ashtavakra/chapter-13.json';
import chapter14 from '@/data/ashtavakra/chapter-14.json';
import chapter15 from '@/data/ashtavakra/chapter-15.json';
import chapter16 from '@/data/ashtavakra/chapter-16.json';
import chapter17 from '@/data/ashtavakra/chapter-17.json';
import chapter18 from '@/data/ashtavakra/chapter-18.json';
import chapter19 from '@/data/ashtavakra/chapter-19.json';
import chapter20 from '@/data/ashtavakra/chapter-20.json';
import { CHAPTERS, getChapterMeta } from '@/data/ashtavakra/chapters-meta';

export interface AshtavakraVerse {
  scripture: string;
  chapterNumber: string;
  chapterTitleHindi: string;
  verseNumber: string;
  speaker: string;
  sanskrit: string;
  iast: string;
  simplePronunciation: string;
  padaccheda: string;
  wordMeanings: Array<{ sanskrit: string; hindi: string }>;
  literalHindiMeaning: string;
  bookBasedHindiExplanation: string;
  simpleHindiExplanation: string;
  philosophicalExplanationHindi: string;
  analogyHindi: string;
  modernExampleHindi: string;
  messageForTodayHindi: string;
  commonMisunderstandingHindi: string;
  practicalApplicationHindi: string;
  reflectionQuestionHindi: string;
  shortPracticeHindi: string;
  oneLineSummaryHindi: string;
  englishTranslation: string;
  simpleEnglishExplanation: string;
  themes: string[];
  searchTags: string[];
  relatedVerses: Array<{ id: string; reason: string }>;
  sourcePage: string;
  verificationStatus: 'verified' | 'review-required';
  editorialNotes: string;
}

export interface AshtavakraChapterData {
  chapterNumber: string;
  chapterTitleBook: string;
  chapterTitleEditorial: string;
  sourceStatus: string;
  source: { title: string; publisher: string; pageMapping: string; rightsNote: string; verificationMethod: string };
  hero: { oneLineSummary: string; keySanskritTerms: string[]; mainTopics: string[]; estimatedReadingTime: string; totalVerses: number };
  introduction: string;
  centralQuestion: string;
  mainTeaching: string;
  concepts: Array<{ term: string; definition: string }>;
  beforeYouRead: string[];
  verses: AshtavakraVerse[];
  end: {
    simpleSummary: string;
    fiveTeachings: Array<{ teaching: string; verses: string[] }>;
    misunderstandings: string[];
    reflectionQuestions: string[];
    fiveMinutePractice: string;
    faqs: Array<{ q: string; a: string }>;
    seo: { title: string; metaDescription: string; primaryKeyword: string };
  };
}

const DATA: Record<number, AshtavakraChapterData> = {
  1: chapter1 as unknown as AshtavakraChapterData,
  2: chapter2 as unknown as AshtavakraChapterData,
  3: chapter3 as unknown as AshtavakraChapterData,
  4: chapter4 as unknown as AshtavakraChapterData,
  5: chapter5 as unknown as AshtavakraChapterData,
  6: chapter6 as unknown as AshtavakraChapterData,
  7: chapter7 as unknown as AshtavakraChapterData,
  8: chapter8 as unknown as AshtavakraChapterData,
  9: chapter9 as unknown as AshtavakraChapterData,
  10: chapter10 as unknown as AshtavakraChapterData,
  11: chapter11 as unknown as AshtavakraChapterData,
  12: chapter12 as unknown as AshtavakraChapterData,
  13: chapter13 as unknown as AshtavakraChapterData,
  14: chapter14 as unknown as AshtavakraChapterData,
  15: chapter15 as unknown as AshtavakraChapterData,
  16: chapter16 as unknown as AshtavakraChapterData,
  17: chapter17 as unknown as AshtavakraChapterData,
  18: chapter18 as unknown as AshtavakraChapterData,
  19: chapter19 as unknown as AshtavakraChapterData,
  20: chapter20 as unknown as AshtavakraChapterData,
};

export const getChapterData = (n: number): AshtavakraChapterData | undefined => DATA[n];
export const publishedChapterNumbers = (): number[] => Object.keys(DATA).map(Number).sort((a, b) => a - b);

/** Keeps a danda or verse-number marker on the same line as the word before it. */
export const keepDanda = (t: string) =>
  t.replace(/ ॥ ([०-९]+) ॥/g, ' ॥ $1 ॥').replace(/ (॥|।)/g, ' $1');

/** "2.14" to { chapter: 2, verse: 14 }. */
export function parseVerseId(id: string): { chapter: number; verse: number } | null {
  const m = /^(\d+)\.(\d+)$/.exec(id);
  return m ? { chapter: +m[1], verse: +m[2] } : null;
}

export function getVerse(chapter: number, verse: number): AshtavakraVerse | undefined {
  return DATA[chapter]?.verses.find((v) => v.verseNumber === `${chapter}.${verse}`);
}

export function verseNeighbours(chapter: number, verse: number) {
  const c = DATA[chapter];
  const idx = c ? c.verses.findIndex((v) => v.verseNumber === `${chapter}.${verse}`) : -1;
  const prev = idx > 0 ? c.verses[idx - 1] : undefined;
  const next = idx >= 0 && idx < c.verses.length - 1 ? c.verses[idx + 1] : undefined;
  return { prev, next };
}

export const verseHref = (id: string) => {
  const p = parseVerseId(id);
  return p ? `/ashtavakra/${p.chapter}/${p.verse}/` : '/ashtavakra/';
};

/** Totals from published data only. */
export function publishedTotals() {
  const nums = publishedChapterNumbers();
  return { chapters: nums.length, verses: nums.reduce((s, n) => s + DATA[n].verses.length, 0), allChapters: CHAPTERS.length };
}

export { CHAPTERS, getChapterMeta };
