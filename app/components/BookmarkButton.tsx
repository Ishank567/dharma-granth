'use client';

import { useSyncExternalStore } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import {
  getBookmarksServerSnapshot,
  getBookmarksSnapshot,
  subscribeToBookmarks,
  toggleBookmark as toggleBookmarkEntry,
} from '@/app/lib/bookmarkStorage';
import { useHydrated } from '@/app/lib/useHydrated';

interface Props {
  verseId: number;
  bookSlug: string;
  categorySlug: string;
  originalText: string;
  bookTitle: string;
  verseNumber: number;
}

export default function BookmarkButton({ verseId, bookSlug, categorySlug, originalText, bookTitle, verseNumber }: Props) {
  const hydrated = useHydrated();
  const bookmarks = useSyncExternalStore(
    subscribeToBookmarks,
    getBookmarksSnapshot,
    getBookmarksServerSnapshot
  );
  const isBookmarked = hydrated && bookmarks.some((bookmark) => bookmark.verseId === verseId);

  const toggleBookmark = () => {
    toggleBookmarkEntry({
      verseId,
      bookSlug,
      categorySlug,
      originalText,
      bookTitle,
      verseNumber,
    });
  };

  return (
    <button
      onClick={toggleBookmark}
      aria-pressed={isBookmarked}
      className={`rounded-lg p-2 transition-colors ${
        isBookmarked
          ? 'text-accent bg-accent-bg'
          : 'text-muted hover:text-accent hover:bg-accent-bg'
      }`}
      title={isBookmarked ? 'पुस्तक चिह्न हटाएँ' : 'पुस्तक चिह्न लगाएँ'}
    >
      {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
    </button>
  );
}
