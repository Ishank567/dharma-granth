'use client';

/**
 * Reading markers for the Ashtavakra Gita, stored on this device only.
 * Deliberately plain: a set of verse ids the reader marked as read. No scores,
 * points, ranks or streaks, and nothing here implies spiritual standing.
 */
import { useCallback, useEffect, useState } from 'react';

export const READ_KEY = 'dharma.ash.read.v1';
const EVENT = 'dharma:ash-read';

function load(): string[] {
  try {
    const raw = localStorage.getItem(READ_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function save(ids: string[]): boolean {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(EVENT));
    return true;
  } catch {
    return false;
  }
}

/** Verse ids marked as read, and a toggle. Updates across components on the page. */
export function useAshRead() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setIds(load());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const cur = load();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    return save(next);
  }, []);

  const clear = useCallback(() => save([]), []);

  return { ids, ready, isRead: (id: string) => ids.includes(id), toggle, clear };
}
