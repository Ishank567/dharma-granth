import { versePageHref, verseSlug } from '@/lib/verse-paths';

interface Locatable {
  scriptureId: string;
  chapterNumber: number;
  verseNumber: number | string;
  libraryRef?: { chapter: number; verse: number | string };
}

/** The chapter and verse in the Dharma Granth library, which can differ from the traditional citation. */
export function libraryLocation(v: Locatable): { chapter: number; verse: string } {
  const chapter = v.libraryRef?.chapter ?? v.chapterNumber;
  // A range such as "62–63" opens at its first verse.
  const verse = String(v.libraryRef?.verse ?? v.verseNumber).split(/[–-]/)[0];
  return { chapter, verse };
}

/** A link that lands on the cited verse: its own page where one exists, else its place in the chapter. */
export function wisdomVerseHref(v: Locatable): string {
  const { chapter, verse } = libraryLocation(v);
  return versePageHref(v.scriptureId, chapter, verse) ?? `/scripture/${v.scriptureId}/chapter/${chapter}#verse-${verseSlug(verse) ?? verse}`;
}
