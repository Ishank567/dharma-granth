/**
 * Scriptures that get a URL per verse (`/scripture/{id}/chapter/{n}/verse/{v}/`).
 *
 * The Gita plus the shorter principal Upanishads: about 1,100 verse URLs,
 * the searches people actually type ("gita 2.47 meaning in hindi").
 * Brihadaranyaka and Chandogya stay on chapter pages so the export stays
 * within the host's file-count and size limits.
 *
 * This module is imported by client components, so it must not touch node:fs.
 */
export const VERSE_PAGE_SCRIPTURE_IDS = [
  'bhagavadgita',
  'ishavasya',
  'kena',
  'katha',
  'prashna',
  'mundaka',
  'mandukya',
  'taittiriya',
  'aitareya',
  'shvetashvatara',
] as const;

const VERSE_SLUG = /^[0-9A-Za-z]+(?:[.\-][0-9A-Za-z]+)*$/;

export function hasVersePages(scriptureId: string): boolean {
  return (VERSE_PAGE_SCRIPTURE_IDS as readonly string[]).includes(scriptureId);
}

/** Path segment for a verse number, or null when it cannot be a static path. */
export function verseSlug(number: number | string | undefined): string | null {
  const slug = String(number ?? '').trim();
  return VERSE_SLUG.test(slug) ? slug : null;
}

export function versePageHref(
  scriptureId: string,
  chapterId: number,
  verseNumber: number | string,
): string | undefined {
  if (!hasVersePages(scriptureId)) return undefined;
  const slug = verseSlug(verseNumber);
  if (!slug) return undefined;
  return `/scripture/${scriptureId}/chapter/${chapterId}/verse/${slug}`;
}

/** Share image for one verse, written by `npm run og:verses`. */
export function verseOgPath(
  scriptureId: string,
  chapterId: number,
  verseNumber: number | string,
): string | undefined {
  const slug = verseSlug(verseNumber);
  if (!slug || !hasVersePages(scriptureId)) return undefined;
  return `/og/verse/${scriptureId}/${chapterId}-${slug.replace(/\./g, '-')}.jpg`;
}

/**
 * The chapter reader, scrolled to a verse. For the reader's own marks (notes,
 * highlights, bookmarks), which only show on the chapter's verse cards.
 */
export function chapterVerseHref(scriptureId: string, chapterId: number, verseId?: number | string): string {
  const base = `/scripture/${scriptureId}/chapter/${chapterId}`;
  return verseId != null && String(verseId) !== '' ? `${base}#verse-${verseId}` : base;
}

/** Verse page when this scripture has one; otherwise the chapter, scrolled to the verse. */
export function readHref(scriptureId: string, chapterId: number, verseId?: number | string): string {
  if (verseId != null && String(verseId) !== '') {
    return versePageHref(scriptureId, chapterId, verseId)
      ?? `/scripture/${scriptureId}/chapter/${chapterId}#verse-${verseId}`;
  }
  return `/scripture/${scriptureId}/chapter/${chapterId}`;
}
