'use client';

import { useEffect } from 'react';
import { logActivity } from '@/lib/activity-log';
import { isHistoryPaused } from '@/lib/reading-history';

/** Notes that a verse was opened, for the private weekly summary. Renders nothing. */
export function ActivityRecorder({ scriptureId, chapterId, verseId, concepts }: { scriptureId: string; chapterId: number; verseId: string; concepts: string[] }) {
  useEffect(() => {
    logActivity({ kind: 'verse', ref: `${scriptureId}:${chapterId}:${verseId}`, concepts }, { paused: isHistoryPaused() });
    // concepts is derived from the verse, so the verse identity is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptureId, chapterId, verseId]);
  return null;
}
