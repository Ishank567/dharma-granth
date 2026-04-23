import Link from 'next/link';
import type { Book } from '../lib/types';
import { getBookVerseCount } from '../lib/db';

export default function BookCard({ book, categorySlug }: { book: Book; categorySlug: string }) {
  let verseCount = book.verse_count ?? 0;
  if (verseCount === 0) {
    try {
      verseCount = getBookVerseCount(book.id);
    } catch (error) {
      console.error('Failed to fetch verse count for book', book.id, error);
    }
  }

  return (
    <Link
      href={`/categories/${categorySlug}/${book.slug}`}
      className="group block rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:bg-card-hover hover:-translate-y-1"
    >
      {/* Book icon with gradient header */}
      <div className="mb-4 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-accent-bg to-card text-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        📜
      </div>

      <h3 className="font-serif-deva text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug min-h-[3.5rem]">
        {book.title_hindi}
      </h3>

      <p className="mt-1 text-xs text-muted">
        {book.author}
      </p>

      <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">
        {book.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-accent-bg px-2.5 py-0.5 text-xs font-medium text-accent">
          {book.language}
        </span>
        {verseCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-card-hover px-2.5 py-0.5 text-xs text-muted">
            📖 {verseCount.toLocaleString('hi-IN')} श्लोक
          </span>
        )}
      </div>
    </Link>
  );
}
