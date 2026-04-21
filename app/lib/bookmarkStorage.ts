import type { Bookmark } from '@/app/lib/types';

const BOOKMARKS_STORAGE_KEY = 'dharma-bookmarks';
const BOOKMARKS_UPDATED_EVENT = 'dharma-bookmarks-updated';

type BookmarkDraft = Omit<Bookmark, 'savedAt'>;

function dispatchBookmarksUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(BOOKMARKS_UPDATED_EVENT));
}

function parseBookmarks(rawValue: string | null) {
  if (!rawValue) {
    return [] as Bookmark[];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? (parsed as Bookmark[]) : [];
  } catch {
    return [] as Bookmark[];
  }
}

// Cached snapshot for useSyncExternalStore (React 19 requires stable references)
const EMPTY_BOOKMARKS: Bookmark[] = [];
let _cachedBookmarks: Bookmark[] = EMPTY_BOOKMARKS;
let _bookmarksDirty = true;

function markBookmarksDirty() {
  _bookmarksDirty = true;
}

export function getBookmarksSnapshot() {
  if (typeof window === 'undefined') {
    return EMPTY_BOOKMARKS;
  }

  if (_bookmarksDirty) {
    _cachedBookmarks = parseBookmarks(window.localStorage.getItem(BOOKMARKS_STORAGE_KEY));
    _bookmarksDirty = false;
  }
  return _cachedBookmarks;
}

export function getBookmarksServerSnapshot() {
  return EMPTY_BOOKMARKS;
}

export function subscribeToBookmarks(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === BOOKMARKS_STORAGE_KEY) {
      markBookmarksDirty();
      onStoreChange();
    }
  };

  const handleUpdate = () => {
    markBookmarksDirty();
    onStoreChange();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(BOOKMARKS_UPDATED_EVENT, handleUpdate);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(BOOKMARKS_UPDATED_EVENT, handleUpdate);
  };
}

export function saveBookmarks(bookmarks: Bookmark[]) {
  if (typeof window === 'undefined') {
    return;
  }

  if (bookmarks.length === 0) {
    window.localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
  } else {
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
  }

  dispatchBookmarksUpdated();
}

export function toggleBookmark(bookmark: BookmarkDraft) {
  const existingBookmarks = getBookmarksSnapshot();
  const isBookmarked = existingBookmarks.some((entry) => entry.verseId === bookmark.verseId);

  if (isBookmarked) {
    saveBookmarks(existingBookmarks.filter((entry) => entry.verseId !== bookmark.verseId));
    return false;
  }

  saveBookmarks([
    ...existingBookmarks,
    {
      ...bookmark,
      savedAt: new Date().toISOString(),
    },
  ]);

  return true;
}