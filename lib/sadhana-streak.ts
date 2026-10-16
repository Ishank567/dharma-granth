'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SadhanaStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalDaysPracticed: number;
  totalLessonsCompleted: number;
}

const STORAGE_KEY = 'dharma.sadhana.streak.v1';

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function readSadhanaStreak(): SadhanaStreak {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      totalDaysPracticed: 0,
      totalLessonsCompleted: 0,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        totalDaysPracticed: 0,
        totalLessonsCompleted: 0,
      };
    }
    const data = JSON.parse(raw) as SadhanaStreak;
    const today = getTodayString();
    const yesterday = getYesterdayString();

    // Check if streak is still valid or broke
    if (data.lastActiveDate && data.lastActiveDate !== today && data.lastActiveDate !== yesterday) {
      // Streak lapsed gracefully (no shaming)
      return {
        ...data,
        currentStreak: 0,
      };
    }
    return data;
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      totalDaysPracticed: 0,
      totalLessonsCompleted: 0,
    };
  }
}

export function recordSadhanaActivity(): SadhanaStreak {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: getTodayString(),
      totalDaysPracticed: 1,
      totalLessonsCompleted: 1,
    };
  }

  const current = readSadhanaStreak();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  let nextStreak = current.currentStreak;
  let nextTotalDays = current.totalDaysPracticed;

  if (current.lastActiveDate === today) {
    // Already active today; increment lesson count
  } else if (current.lastActiveDate === yesterday) {
    nextStreak = current.currentStreak + 1;
    nextTotalDays = current.totalDaysPracticed + 1;
  } else {
    nextStreak = 1;
    nextTotalDays = current.totalDaysPracticed + 1;
  }

  const updated: SadhanaStreak = {
    currentStreak: nextStreak,
    longestStreak: Math.max(current.longestStreak, nextStreak),
    lastActiveDate: today,
    totalDaysPracticed: nextTotalDays,
    totalLessonsCompleted: current.totalLessonsCompleted + 1,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sadhana_streak_updated'));
  } catch {
    // ignore
  }

  return updated;
}

export function useSadhanaStreak() {
  const [streak, setStreak] = useState<SadhanaStreak>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalDaysPracticed: 0,
    totalLessonsCompleted: 0,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStreak(readSadhanaStreak());
    setReady(true);

    const onUpdate = () => setStreak(readSadhanaStreak());
    window.addEventListener('sadhana_streak_updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('sadhana_streak_updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, []);

  const record = useCallback(() => {
    const next = recordSadhanaActivity();
    setStreak(next);
  }, []);

  return { streak, ready, record };
}
