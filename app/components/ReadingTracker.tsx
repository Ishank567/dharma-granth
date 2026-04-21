'use client';

import { useEffect } from 'react';
import { updateReadingProgress } from '@/app/lib/readingProgress';

export default function ReadingTracker({
  bookSlug,
  categorySlug,
  bookTitle,
  verseId,
  verseNumber,
  totalVerses,
}: {
  bookSlug: string;
  categorySlug: string;
  bookTitle: string;
  verseId: number;
  verseNumber: number;
  totalVerses: number;
}) {
  useEffect(() => {
    updateReadingProgress(bookSlug, categorySlug, bookTitle, verseId, verseNumber, totalVerses);
  }, [bookSlug, categorySlug, bookTitle, verseId, verseNumber, totalVerses]);

  return null;
}
