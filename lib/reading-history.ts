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
  /** Verse last on screen, for resuming at it ("7", or "1.1" in some texts). */
  verseId?: string;
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
    typeof v.readAt === 'string' &&
    // Used in a URL fragment, so keep it to verse-number characters.
    (v.verseId === undefined || (typeof v.verseId === 'string' && VERSE_ID.test(v.verseId)))
  );
}

const VERSE_ID = /^[0-9A-Za-z.-]{1,20}$/;

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
export function recordChapterVisit(visit: Omit<ChapterVisit, 'readAt' | 'verseId'>): void {
  try {
    const existing = readRecentChapters();
    const previous = existing.find((v) => v.scriptureId === visit.scriptureId);
    // Reopening the same chapter keeps the saved verse; a new chapter starts fresh.
    const verseId = previous?.chapterId === visit.chapterId ? previous.verseId : undefined;
    const next = [
      { ...visit, verseId, readAt: new Date().toISOString() },
      ...existing.filter((v) => v.scriptureId !== visit.scriptureId),
    ].slice(0, MAX_VISITS);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // Storage unavailable (private mode, quota): history is a nicety.
  }
}

/** Record the verse on screen for this chapter's history entry (if it exists). */
export function updateLastVerse(scriptureId: string, chapterId: number, verseId: string): void {
  if (!VERSE_ID.test(verseId)) return;
  try {
    const all = readRecentChapters();
    const entry = all.find((v) => v.scriptureId === scriptureId && v.chapterId === chapterId);
    if (!entry || entry.verseId === verseId) return;
    entry.verseId = verseId;
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // ignore
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

/* ── Streak (written by useStudyProgress under 'dharma.streak') ───── */

function localISODate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Current streak, or 0 if it has lapsed (last read before yesterday).
 * useStudyProgress only updates the stored number on the next read, so a
 * broken streak would otherwise keep showing its old count.
 */
export function readActiveStreak(): number {
  try {
    const raw = JSON.parse(window.localStorage.getItem('dharma.streak') ?? 'null') as {
      currentStreak?: unknown;
      lastReadDate?: unknown;
    } | null;
    if (!raw || typeof raw.currentStreak !== 'number' || typeof raw.lastReadDate !== 'string') {
      return 0;
    }
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    // useStudyProgress stores UTC dates (toISOString), so accept either
    // calendar to avoid a false "lapsed" around midnight.
    const recent = new Set([
      localISODate(now),
      localISODate(yesterday),
      now.toISOString().slice(0, 10),
      yesterday.toISOString().slice(0, 10),
    ]);
    return recent.has(raw.lastReadDate) ? Math.max(0, Math.floor(raw.currentStreak)) : 0;
  } catch {
    return 0;
  }
}

/* ── Chapter completion ─────────────────────────────────────────────── */

const COMPLETED_KEY = 'dharma.completedChapters';
const MAX_COMPLETED = 2000;

function completedKey(scriptureId: string, chapterId: number): string {
  return `${scriptureId}:${chapterId}`;
}

export function readCompletedChapters(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(COMPLETED_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === 'string') : [];
  } catch {
    return [];
  }
}

export function isChapterCompleted(scriptureId: string, chapterId: number): boolean {
  return readCompletedChapters().includes(completedKey(scriptureId, chapterId));
}

/** Marks a chapter finished; returns how many chapters of that book are done. */
export function markChapterCompleted(scriptureId: string, chapterId: number): number {
  const key = completedKey(scriptureId, chapterId);
  const all = readCompletedChapters();
  const next = all.includes(key) ? all : [...all, key].slice(-MAX_COMPLETED);
  try {
    window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next.filter((k) => k.startsWith(`${scriptureId}:`)).length;
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
