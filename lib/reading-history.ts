'use client';

import { useEffect, useState } from 'react';

export interface ChapterVisit {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  chapterId: number;
  chapterTitle: string;
  totalChapters: number;
  readAt: string; // ISO timestamp
}

const KEY = 'dharma.recentChapters';
const MAX_VISITS = 6;
/** Same-tab listeners; the `storage` event only fires in other tabs. */
const CHANGE_EVENT = 'dharma:recent-chapters';

function isVisit(value: unknown): value is ChapterVisit {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<ChapterVisit>;
  return (
    typeof v.scriptureId === 'string' &&
    /^[a-z0-9-]+$/i.test(v.scriptureId) &&
    typeof v.scriptureTitle === 'string' &&
    typeof v.chapterId === 'number' &&
    Number.isInteger(v.chapterId) &&
    v.chapterId > 0 &&
    typeof v.chapterTitle === 'string' &&
    typeof v.readAt === 'string'
  );
}

export function readRecentChapters(): ChapterVisit[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isVisit) : [];
  } catch {
    return [];
  }
}

/**
 * Remember the chapter just opened. One entry per scripture (its latest
 * chapter), newest first, so "continue reading" resumes each book.
 */
export function recordChapterVisit(visit: Omit<ChapterVisit, 'readAt'>): void {
  try {
    const next = [
      { ...visit, readAt: new Date().toISOString() },
      ...readRecentChapters().filter((v) => v.scriptureId !== visit.scriptureId),
    ].slice(0, MAX_VISITS);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage unavailable (private mode, quota): history is a nicety.
  }
}

export function forgetScripture(scriptureId: string): void {
  try {
    const next = readRecentChapters().filter((v) => v.scriptureId !== scriptureId);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

/** Recent chapter visits; `null` until read after mount (SSR-safe). */
export function useRecentChapters(): ChapterVisit[] | null {
  const [visits, setVisits] = useState<ChapterVisit[] | null>(null);

  useEffect(() => {
    const sync = () => setVisits(readRecentChapters());
    sync();
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) sync();
    };
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return visits;
}
