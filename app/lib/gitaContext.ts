import type { BookSnapshot } from './content';
import type { Verse } from './types';

export type Speaker = 'krishna' | 'arjuna' | 'sanjaya' | 'dhritarashtra';

const SPEAKER_META: Record<Speaker, { hindi: string; roleHindi: string; emoji: string; tone: string }> = {
  krishna: { hindi: 'श्रीकृष्ण', roleHindi: 'भगवान', emoji: '🪈', tone: 'krishna' },
  arjuna: { hindi: 'अर्जुन', roleHindi: 'शिष्य-योद्धा', emoji: '🏹', tone: 'arjuna' },
  sanjaya: { hindi: 'सञ्जय', roleHindi: 'दिव्यदृष्टा-सूत', emoji: '👁️', tone: 'sanjaya' },
  dhritarashtra: { hindi: 'धृतराष्ट्र', roleHindi: 'अन्ध-नृप', emoji: '👑', tone: 'dhritarashtra' },
};

// Cues appear either spaced (सञ्जय उवाच) or fused via sandhi: the preceding
// name's final consonant takes a ु-matra and merges with वाच — e.g.
// भगवान् + उवाच → भगवानुवाच. Match either the independent word उवाच or the
// fused -ुवाच suffix directly after a recognized name.
const NAME_TAIL = /(?:\s+उवाच|ुवाच)/;
const UVACHA_CUES: Array<{ match: RegExp; speaker: Speaker }> = [
  { match: concat(/धृतराष्ट्र/, NAME_TAIL), speaker: 'dhritarashtra' },
  { match: concat(/(?:सञ्जय|संजय)/, NAME_TAIL), speaker: 'sanjaya' },
  { match: concat(/अर्जुन/, NAME_TAIL), speaker: 'arjuna' },
  { match: concat(/(?:श्रीभगवान|श्री\s*भगवान|भगवान|श्रीकृष्ण|कृष्ण)/, NAME_TAIL), speaker: 'krishna' },
];
function concat(a: RegExp, b: RegExp): RegExp {
  return new RegExp(a.source + b.source);
}

function detectSpeakerCue(text: string): Speaker | null {
  for (const { match, speaker } of UVACHA_CUES) {
    if (match.test(text)) return speaker;
  }
  return null;
}

/**
 * Walk verses in order. A उवाच marker sets the current speaker; verses without
 * one inherit the last-declared speaker. Chapter 1 opens with धृतराष्ट्र उवाच
 * (v.1) and the narration shifts to सञ्जय from v.2. From ch 2 onward the
 * दिव्यदृष्टा-सूत सञ्जय relays the actual Krishna↔Arjuna dialogue.
 */
export function resolveSpeaker(book: BookSnapshot, verse: Verse): Speaker | null {
  const verses = book.verses;
  let current: Speaker | null = null;
  for (const v of verses) {
    const cue = detectSpeakerCue(v.original_text || '');
    if (cue) current = cue;
    if (v.id === verse.id) return current;
  }
  return current;
}

export function getSpeakerMeta(speaker: Speaker) {
  return SPEAKER_META[speaker];
}

export type ChapterPosition = {
  chapterNumber: number;
  chapterTitleHindi: string;
  chapterTitleEnglish: string;
  verseInChapter: number;
  totalInChapter: number;
  overallIndex: number;
  overallTotal: number;
  markerReference: string | null;
};

/**
 * Parse the canonical "।।1.47।।" reference that Gita verses carry at the end
 * of original_text. Falls back to null when absent.
 */
export function parseChapterVerseMarker(originalText: string): string | null {
  const m = originalText.match(/।।\s*(\d+)\s*\.\s*(\d+)\s*।।/);
  if (!m) return null;
  return `${m[1]}.${m[2]}`;
}

export function getChapterPosition(book: BookSnapshot, verse: Verse): ChapterPosition | null {
  if (verse.chapter_id == null) return null;
  const chapter = book.chapters.find((c) => c.id === verse.chapter_id);
  if (!chapter) return null;
  const versesInChapter = book.verses.filter((v) => v.chapter_id === verse.chapter_id);
  const verseInChapter = versesInChapter.findIndex((v) => v.id === verse.id) + 1;
  const overallIndex = book.verses.findIndex((v) => v.id === verse.id) + 1;
  return {
    chapterNumber: chapter.chapter_number,
    chapterTitleHindi: chapter.title_hindi,
    chapterTitleEnglish: chapter.title,
    verseInChapter,
    totalInChapter: versesInChapter.length,
    overallIndex,
    overallTotal: book.verses.length,
    markerReference: parseChapterVerseMarker(verse.original_text || ''),
  };
}

export const GITA_SLUG = 'bhagavad-gita';
export function isGita(bookSlug: string): boolean {
  return bookSlug === GITA_SLUG;
}
