import type { ReadingProgress } from './types';

const READING_PROGRESS_KEY = 'dharma-reading-progress';
export const READING_PROGRESS_EVENT = 'dharma-reading-progress-updated';

function isBrowser() {
  return typeof window !== 'undefined';
}

function readAll(): Record<string, ReadingProgress> {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(READING_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, ReadingProgress>) {
  if (!isBrowser()) return;
  localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(READING_PROGRESS_EVENT));
}

export function updateReadingProgress(
  bookSlug: string,
  categorySlug: string,
  bookTitle: string,
  verseId: number,
  verseNumber: number,
  totalVerses: number,
) {
  const all = readAll();
  all[bookSlug] = {
    bookSlug,
    categorySlug,
    bookTitle,
    lastVerseId: verseId,
    lastVerseNumber: verseNumber,
    totalVerses,
    updatedAt: new Date().toISOString(),
  };
  writeAll(all);
}

export function getReadingProgress(bookSlug: string): ReadingProgress | null {
  return readAll()[bookSlug] || null;
}

export function getAllReadingProgress(): ReadingProgress[] {
  return Object.values(readAll()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

// Cached snapshot for useSyncExternalStore (React 19 requires stable references)
let _cachedSnapshot: ReadingProgress[] = [];
let _snapshotDirty = true;

function markDirty() {
  _snapshotDirty = true;
}

export function getReadingProgressSnapshot(): ReadingProgress[] {
  if (_snapshotDirty) {
    _cachedSnapshot = getAllReadingProgress();
    _snapshotDirty = false;
  }
  return _cachedSnapshot;
}

export function subscribeReadingProgress(callback: () => void) {
  if (!isBrowser()) return () => {};
  const handler = () => {
    markDirty();
    callback();
  };
  window.addEventListener(READING_PROGRESS_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(READING_PROGRESS_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
