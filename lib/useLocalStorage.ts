'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Generic localStorage-backed state hook.
 *
 * - Reads the initial value from localStorage on mount (SSR-safe: returns
 *   `initial` during SSR, then syncs after hydration).
 * - Writes to localStorage on every change via a debounced effect.
 * - Cross-tab sync: listens to the `storage` event so multiple tabs stay
 *   in sync.
 *
 * @param key   localStorage key
 * @param initial  fallback value when nothing is stored yet
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(initial);
  const keyRef = useRef(key);
  keyRef.current = key;

  // Hydrate from localStorage after mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(keyRef.current);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // ignore parse / access errors
    }
  }, [keyRef]);

  // Persist on change.
  useEffect(() => {
    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(value));
    } catch {
      // ignore quota / access errors
    }
  }, [value, keyRef]);

  // Cross-tab sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== keyRef.current || e.newValue === null) return;
      try {
        setValue(JSON.parse(e.newValue) as T);
      } catch {
        // ignore
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [keyRef]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) =>
        typeof next === 'function' ? (next as (p: T) => T)(prev) : next,
      );
    },
    [],
  );

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(keyRef.current);
    } catch {
      // ignore
    }
    setValue(initial);
  }, [initial]);

  return [value, update, remove];
}
