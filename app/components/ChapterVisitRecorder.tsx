'use client';

import { useEffect } from 'react';
import { recordChapterVisit, type ChapterVisit } from '@/lib/reading-history';

/** Renders nothing; records the chapter in reading history for "continue reading". */
export function ChapterVisitRecorder(props: Omit<ChapterVisit, 'readAt'>) {
  const {
    scriptureId,
    scriptureTitle,
    scriptureTitleSanskrit,
    chapterId,
    chapterTitle,
    totalChapters,
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
  }, [scriptureId, scriptureTitle, scriptureTitleSanskrit, chapterId, chapterTitle, totalChapters]);

  return null;
}
