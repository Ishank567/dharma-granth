import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface ChapterPreview {
  id: number;
  title: string;
  titleSanskrit?: string;
  summary?: string;
  verseCount: number;
}

export interface SeededChapterData {
  number: number;
  title?: string;
  titleSanskrit?: string;
  summary?: string;
  verses: unknown[];
}

export interface SeededChapterResult {
  id: string;
  chapter: SeededChapterData;
  source?: unknown;
}

const seededChapterNumbersCache = new Map<string, number[]>();
const seededChapterPreviewsCache = new Map<string, ChapterPreview[]>();

/** Scripture ids are slugs; anything else could escape the data directory. */
const SAFE_ID = /^[a-z0-9][a-z0-9-]*$/i;

interface MonolithicBook {
  id?: string;
  source?: unknown;
  chapters?: Array<{
    number?: number | string;
    title?: string;
    titleSanskrit?: string;
    summary?: string;
    verses?: unknown[];
  }>;
}

// Parsed monolithic books, kept small because some are tens of MB. Static
// generation renders a book's chapters back to back, so even a few entries
// turn one parse per chapter into one parse per book.
const MAX_CACHED_BOOKS = 3;
const bookCache = new Map<string, MonolithicBook | null>();

function readMonolithicBook(baseDir: string, scriptureId: string): MonolithicBook | null {
  if (bookCache.has(scriptureId)) {
    const hit = bookCache.get(scriptureId) ?? null;
    // Refresh LRU position
    bookCache.delete(scriptureId);
    bookCache.set(scriptureId, hit);
    return hit;
  }
  const bookPath = resolve(baseDir, `${scriptureId}.json`);
  const book = existsSync(bookPath)
    ? (JSON.parse(readFileSync(bookPath, 'utf8')) as MonolithicBook)
    : null;
  bookCache.set(scriptureId, book);
  if (bookCache.size > MAX_CACHED_BOOKS) {
    const oldest = bookCache.keys().next().value;
    if (oldest !== undefined) bookCache.delete(oldest);
  }
  return book;
}

/**
 * Read chapter previews for a scripture.
 * Checks for manifest.json first (tiny, instant read),
 * falling back to reading the monolithic JSON if manifest is absent.
 */
export function readSeededChapterPreviews(scriptureId: string): ChapterPreview[] {
  const cached = seededChapterPreviewsCache.get(scriptureId);
  if (cached) return cached;
  if (!SAFE_ID.test(scriptureId)) return [];

  try {
    const baseDir = resolve(process.cwd(), 'public/data/scriptures-full');
    const manifestPath = resolve(baseDir, scriptureId, 'manifest.json');

    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
        chapters?: Array<{
          number?: number | string;
          title?: string;
          titleSanskrit?: string;
          summary?: string;
          verseCount?: number;
        }>;
      };
      const previews: ChapterPreview[] = [];
      for (const c of manifest.chapters ?? []) {
        const num = typeof c.number === 'number' ? c.number : Number(c.number);
        if (!Number.isFinite(num)) continue;
        previews.push({
          id: num,
          title: c.title || `अध्याय ${num}`,
          titleSanskrit: c.titleSanskrit,
          summary: c.summary?.trim() || undefined,
          verseCount: c.verseCount ?? 0,
        });
      }

      seededChapterPreviewsCache.set(scriptureId, previews);
      seededChapterNumbersCache.set(
        scriptureId,
        previews.map((p) => p.id),
      );
      return previews;
    }

    // Fallback to monolithic book JSON
    const data = readMonolithicBook(baseDir, scriptureId);
    if (!data) {
      seededChapterPreviewsCache.set(scriptureId, []);
      return [];
    }

    const previews: ChapterPreview[] = [];
    for (const c of data.chapters ?? []) {
      const num = typeof c.number === 'number' ? c.number : Number(c.number);
      if (!Number.isFinite(num)) continue;
      previews.push({
        id: num,
        title: c.title || `अध्याय ${num}`,
        titleSanskrit: c.titleSanskrit,
        summary: c.summary?.trim() || undefined,
        verseCount: c.verses?.length ?? 0,
      });
    }

    seededChapterPreviewsCache.set(scriptureId, previews);
    seededChapterNumbersCache.set(
      scriptureId,
      previews.map((p) => p.id),
    );
    return previews;
  } catch (err) {
    console.error(`Error reading chapter previews for ${scriptureId}:`, err);
    return [];
  }
}

/**
 * Read the chapter numbers present in a scripture's seeded full-text JSON or manifest.
 */
export function readSeededChapterNumbers(scriptureId: string): number[] {
  const cached = seededChapterNumbersCache.get(scriptureId);
  if (cached) return cached;

  const previews = readSeededChapterPreviews(scriptureId);
  const numbers = previews.map((p) => p.id);
  seededChapterNumbersCache.set(scriptureId, numbers);
  return numbers;
}

/**
 * Read a specific chapter's full content (verses, title, source).
 * Checks the chapter shard file first (`public/data/scriptures-full/{id}/ch-{num}.json`),
 * falling back to extracting it from the monolithic file.
 */
export function readSeededChapter(
  scriptureId: string,
  chapterId: number,
): SeededChapterResult | null {
  if (!SAFE_ID.test(scriptureId) || !Number.isInteger(chapterId) || chapterId < 1) {
    return null;
  }
  try {
    const baseDir = resolve(process.cwd(), 'public/data/scriptures-full');
    const shardPath = resolve(baseDir, scriptureId, `ch-${chapterId}.json`);

    if (existsSync(shardPath)) {
      return JSON.parse(readFileSync(shardPath, 'utf8')) as SeededChapterResult;
    }

    const data = readMonolithicBook(baseDir, scriptureId);
    if (data) {
      const found = (data.chapters ?? []).find(
        (c) => Number(c.number) === chapterId,
      );
      if (found) {
        return {
          id: scriptureId,
          chapter: {
            number: Number(found.number),
            title: found.title,
            titleSanskrit: found.titleSanskrit,
            summary: found.summary,
            verses: found.verses ?? [],
          },
          source: data.source,
        };
      }
    }
  } catch (err) {
    console.error(`Error reading chapter ${chapterId} of ${scriptureId}:`, err);
  }
  return null;
}

const commentaryCache = new Map<string, Record<string, unknown> | null>();

/**
 * One chapter's slice of the published Hindi commentary
 * (`public/data/hi-commentary/{id}.json`, keyed `${chapter}:${verse}`), for
 * rendering into the chapter page at build time. Undefined when the scripture
 * has no commentary for that chapter.
 */
export function readChapterCommentary<T = unknown>(
  scriptureId: string,
  chapterId: number,
): Record<string, T> | undefined {
  if (!SAFE_ID.test(scriptureId)) return undefined;
  let all = commentaryCache.get(scriptureId);
  if (all === undefined) {
    const path = resolve(process.cwd(), 'public/data/hi-commentary', `${scriptureId}.json`);
    try {
      all = existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>) : null;
    } catch (err) {
      console.error(`Error reading commentary for ${scriptureId}:`, err);
      all = null;
    }
    commentaryCache.set(scriptureId, all);
  }
  if (!all) return undefined;
  const prefix = `${chapterId}:`;
  const slice: Record<string, T> = {};
  for (const [key, value] of Object.entries(all)) {
    if (key.startsWith(prefix)) slice[key] = value as T;
  }
  return Object.keys(slice).length > 0 ? slice : undefined;
}
