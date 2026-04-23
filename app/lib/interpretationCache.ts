import fs from 'fs';
import {
  getBookBySlug,
  getBookFilePath,
  invalidateBookCache,
  type BookSnapshot,
} from '@/app/lib/content';
import type { Interpretation } from '@/app/lib/types';

type InflightMap = Map<string, Promise<Interpretation>>;

const inflight: InflightMap = new Map();

const RATE_LIMIT_COOLDOWN_MS = 60_000;
let rateLimitedUntil = 0;

function cacheKey(bookSlug: string, verseId: number) {
  return `${bookSlug}:${verseId}`;
}

export function getInflight(bookSlug: string, verseId: number): Promise<Interpretation> | undefined {
  return inflight.get(cacheKey(bookSlug, verseId));
}

export function registerInflight(
  bookSlug: string,
  verseId: number,
  promise: Promise<Interpretation>
) {
  const key = cacheKey(bookSlug, verseId);
  inflight.set(key, promise);
  // Drop the entry when settled. Attach a no-op catch so the cleanup chain
  // does not surface as an unhandled rejection — the original promise is still
  // awaited by the caller who will handle the error.
  promise
    .catch(() => undefined)
    .finally(() => {
      if (inflight.get(key) === promise) inflight.delete(key);
    });
}

export function isRateLimitedNow() {
  return Date.now() < rateLimitedUntil;
}

export function markRateLimited() {
  rateLimitedUntil = Date.now() + RATE_LIMIT_COOLDOWN_MS;
}

/**
 * Write interpretation back into public/data/books/<slug>.json so repeat visits
 * (locally) serve instantly without burning Gemini quota. On Vercel serverless
 * the filesystem is read-only and this silently fails — the in-process book
 * cache still helps within a warm instance.
 */
export function persistInterpretation(
  bookSlug: string,
  verseId: number,
  interpretation: Interpretation
): boolean {
  const book = getBookBySlug(bookSlug);
  if (!book) return false;
  const filePath = getBookFilePath(bookSlug);

  const updated: BookSnapshot = {
    ...book,
    interpretations: {
      ...book.interpretations,
      [verseId]: {
        id: interpretation.id,
        verse_id: interpretation.verse_id,
        shabdarth: interpretation.shabdarth,
        bhavarth: interpretation.bhavarth,
        simple_example: interpretation.simple_example,
        guided_learning: interpretation.guided_learning,
        scientific_temperament: interpretation.scientific_temperament,
        modern_relevance: interpretation.modern_relevance,
        next_curiosity: interpretation.next_curiosity,
        source: interpretation.source,
        created_at: interpretation.created_at,
      },
    },
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(updated), 'utf8');
    invalidateBookCache(bookSlug);
    return true;
  } catch {
    // Read-only FS (Vercel) or permission issue — keep only in-memory.
    return false;
  }
}
