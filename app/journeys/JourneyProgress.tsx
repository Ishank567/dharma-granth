'use client';

import { useCallback, useEffect, useState } from 'react';

export const JOURNEY_PROGRESS_KEY = 'dharma.journeys.v1';
type Progress = Record<string, string[]>;

function read(): Progress {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(JOURNEY_PROGRESS_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? (parsed as Progress) : {};
  } catch {
    return {};
  }
}

/** Completed lesson ids per journey, kept in this browser only. */
export function useJourneyProgress() {
  const [progress, setProgress] = useState<Progress>({});
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setProgress(read());
    setReady(true);
    const sync = () => setProgress(read());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const toggle = useCallback((journeyId: string, lessonId: string) => {
    setProgress((prev) => {
      const done = prev[journeyId] ?? [];
      const next = { ...prev, [journeyId]: done.includes(lessonId) ? done.filter((x) => x !== lessonId) : [...done, lessonId] };
      try { localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(next)); } catch { /* holds for this visit */ }
      return next;
    });
  }, []);

  const reset = useCallback((journeyId: string) => {
    setProgress((prev) => {
      const next = { ...prev };
      delete next[journeyId];
      try { localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { progress, ready, toggle, reset };
}

/** Calm progress sentence for a journey card. */
export function JourneyProgressLine({ journeyId, total }: { journeyId: string; total: number }) {
  const { progress, ready } = useJourneyProgress();
  const done = (progress[journeyId] ?? []).length;
  if (!ready || done === 0) return <span className="text-sm text-dharma-muted">Not started</span>;
  return (
    <span role="status" className="text-sm text-dharma-muted">
      {done >= total ? `You have read all ${total} verses.` : `You have completed ${done} of ${total} readings.`}
    </span>
  );
}
