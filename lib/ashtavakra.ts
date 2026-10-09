/**
 * Server-side loader for the Ashtavakra Gita content. Only chapters that have
 * been transcribed, checked and composed (data/ashtavakra/chapter-N.json) are
 * published; everything else is shown as not yet available rather than guessed.
 */
import chapter1 from '@/data/ashtavakra/chapter-1.json';
import chapter2 from '@/data/ashtavakra/chapter-2.json';
import chapter3 from '@/data/ashtavakra/chapter-3.json';
import chapter4 from '@/data/ashtavakra/chapter-4.json';
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
