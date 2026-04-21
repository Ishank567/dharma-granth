'use client';

import { useSyncExternalStore } from 'react';
import {
  getLearningSummary,
  LEARNING_DATA_UPDATED_EVENT,
} from '@/app/lib/learningStorage';
import type { LearningSummary } from '@/app/lib/learningStorage';

// Cached snapshot for useSyncExternalStore (React 19 requires stable references)
let _cachedSummary: LearningSummary | null = null;
let _summaryDirty = true;

const EMPTY: LearningSummary = {
  learnerName: '',
  startedCourses: 0,
  completedCourses: 0,
  moduleNotes: 0,
  verseNotes: 0,
  activeDays: 0,
  currentStreak: 0,
  longestStreak: 0,
};

function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    _summaryDirty = true;
    cb();
  };
  window.addEventListener(LEARNING_DATA_UPDATED_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(LEARNING_DATA_UPDATED_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

function getSnapshot(): LearningSummary {
  if (_summaryDirty || !_cachedSummary) {
    _cachedSummary = getLearningSummary();
    _summaryDirty = false;
  }
  return _cachedSummary;
}

function getServerSnapshot(): LearningSummary {
  return EMPTY;
}

export default function StreakDashboard() {
  const summary = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Don't show if no activity at all
  if (summary.activeDays === 0 && summary.startedCourses === 0 && summary.verseNotes === 0 && summary.completedCourses === 0) {
    return null;
  }

  const stats = [
    { label: 'वर्तमान क्रम', value: `${summary.currentStreak} दिन`, icon: '🔥' },
    { label: 'सर्वाधिक क्रम', value: `${summary.longestStreak} दिन`, icon: '🏆' },
    { label: 'सक्रिय दिवस', value: `${summary.activeDays}`, icon: '📅' },
    { label: 'श्लोक टिप्पणियाँ', value: `${summary.verseNotes}`, icon: '📝' },
    { label: 'पाठ्यक्रम शुरू', value: `${summary.startedCourses}`, icon: '📚' },
    { label: 'पाठ्यक्रम पूर्ण', value: `${summary.completedCourses}`, icon: '🎓' },
  ];

  return (
    <section className="mb-12">
      <h2 className="font-serif-deva text-xl font-bold text-foreground mb-4">
        🔥 अध्ययन आँकड़े
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-4 text-center"
          >
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-lg font-bold text-accent">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
