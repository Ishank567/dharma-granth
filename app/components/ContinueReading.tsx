'use client';

import { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { subscribeReadingProgress, getReadingProgressSnapshot } from '@/app/lib/readingProgress';
import type { ReadingProgress } from '@/app/lib/types';

const EMPTY: ReadingProgress[] = [];

export default function ContinueReading() {
  const items = useSyncExternalStore(
    subscribeReadingProgress,
    getReadingProgressSnapshot,
    () => EMPTY,
  );

  if (items.length === 0) return null;

  const recent = items.slice(0, 3);

  return (
    <section className="mb-12">
      <h2 className="font-serif-deva text-xl font-bold text-foreground mb-4">
        📖 पठन जारी रखें
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((item) => {
          const pct = item.totalVerses > 0
            ? Math.round((item.lastVerseNumber / item.totalVerses) * 100)
            : 0;

          return (
            <Link
              key={item.bookSlug}
              href={`/categories/${item.categorySlug}/${item.bookSlug}/${item.lastVerseId}`}
              className="block rounded-2xl border border-border bg-card p-4 hover:border-accent/30 hover:shadow-md transition-all"
            >
              <p className="font-serif-deva text-sm font-semibold text-foreground mb-1 truncate">
                {item.bookTitle || item.bookSlug} — श्लोक {item.lastVerseNumber}
              </p>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted mt-1">{pct}% पूर्ण</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
