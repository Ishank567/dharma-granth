'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { Trash2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import {
  getBookmarksServerSnapshot,
  getBookmarksSnapshot,
  saveBookmarks,
  subscribeToBookmarks,
} from '@/app/lib/bookmarkStorage';
import { useHydrated } from '@/app/lib/useHydrated';

export default function BookmarksPage() {
  const hydrated = useHydrated();
  const bookmarks = useSyncExternalStore(
    subscribeToBookmarks,
    getBookmarksSnapshot,
    getBookmarksServerSnapshot
  );

  const sortedBookmarks = useMemo(
    () =>
      [...bookmarks].sort(
        (left, right) => new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime()
      ),
    [bookmarks]
  );

  const removeBookmark = (verseId: number) => {
    saveBookmarks(bookmarks.filter((bookmark) => bookmark.verseId !== verseId));
  };

  const clearAll = () => {
    if (!window.confirm('क्या आप सभी पुस्तक चिह्न हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं होगी।')) {
      return;
    }
    saveBookmarks([]);
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center py-16">
          <div className="shimmer h-8 w-48 mx-auto rounded mb-4" />
          <div className="shimmer h-4 w-64 mx-auto rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">पुस्तक चिह्न</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif-deva text-3xl font-bold text-foreground">
            🔖 पुस्तक चिह्न
          </h1>
          <p className="text-sm text-muted mt-1">
            आपके सहेजे गए {bookmarks.length} श्लोक
          </p>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={clearAll}
            className="rounded-xl border border-red-200 dark:border-red-900 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            सभी हटाएँ
          </button>
        )}
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {sortedBookmarks.map((bm) => (
              <div
                key={bm.verseId}
                className="rounded-2xl border border-border bg-card p-5 flex items-start gap-4"
              >
                <Link
                  href={`/categories/${bm.categorySlug}/${bm.bookSlug}/${bm.verseId}`}
                  className="flex-1 min-w-0 group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-accent-bg px-2.5 py-0.5 text-xs font-medium text-accent">
                      {bm.bookTitle}
                    </span>
                    <span className="text-xs text-muted">श्लोक {bm.verseNumber}</span>
                  </div>
                  <p className="font-scripture text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors">
                    {bm.originalText}...
                  </p>
                  <p className="text-xs text-muted-light mt-2">
                    {new Date(bm.savedAt).toLocaleDateString('hi-IN')} को सहेजा गया
                  </p>
                </Link>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/categories/${bm.categorySlug}/${bm.bookSlug}/${bm.verseId}`}
                    className="rounded-lg p-2 text-muted hover:text-accent hover:bg-accent-bg transition-colors"
                    title="पढ़ें"
                  >
                    <BookOpen size={16} />
                  </Link>
                  <button
                    onClick={() => removeBookmark(bm.verseId)}
                    className="rounded-lg p-2 text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    title="हटाएँ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-border bg-card">
          <p className="text-4xl mb-4">🔖</p>
          <p className="text-muted text-lg mb-2">अभी कोई पुस्तक चिह्न नहीं है</p>
          <p className="text-sm text-muted-light mb-6">
            किसी भी श्लोक पर पुस्तक चिह्न बटन दबाकर उसे यहाँ सहेजें
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            ग्रंथ पढ़ना शुरू करें →
          </Link>
        </div>
      )}
    </div>
  );
}
