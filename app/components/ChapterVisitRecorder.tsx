'use client';

import { useEffect } from 'react';
import { recordChapterVisit, updateLastVerse, type ChapterVisit } from '@/lib/reading-history';

/** Renders nothing; records the chapter in reading history for "continue reading". */
export function ChapterVisitRecorder(props: Omit<ChapterVisit, 'readAt'>) {
  const {
    scriptureId,
    scriptureTitle,
    scriptureTitleSanskrit,
    chapterId,
    chapterTitle,
    totalChapters,
    verseId,
  } = props;

  useEffect(() => {
    recordChapterVisit({
      scriptureId,
      scriptureTitle,
      scriptureTitleSanskrit,
      chapterId,
      chapterTitle,
      totalChapters,
    });
    if (verseId) updateLastVerse(scriptureId, chapterId, verseId);
  }, [scriptureId, scriptureTitle, scriptureTitleSanskrit, chapterId, chapterTitle, totalChapters, verseId]);

  return null;
}
