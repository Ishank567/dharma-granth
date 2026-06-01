'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Theme = 'day' | 'sunset' | 'night';
export const THEMES: Theme[] = ['day', 'sunset', 'night'];

const STORAGE_KEY = 'dharma-theme';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Reads the persisted theme from localStorage and applies it to the
 * <html> element. The pre-hydration <script> in layout.tsx already
 * did this synchronously to avoid flash; this provider keeps React
 * state in sync and exposes setters.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('day');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY)) as Theme | null;
    if (stored && THEMES.includes(stored)) {
      setThemeState(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // localStorage may be unavailable (private browsing, quota). The
      // in-memory state still works; just no persistence.
    }
  };

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme);
    setTheme(THEMES[(idx + 1) % THEMES.length]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Outside a provider — fall back to a no-op so component still
    // renders. This shouldn't happen in production.
    return {
      theme: 'day',
      setTheme: () => {},
      cycleTheme: () => {},
    };
  }
  return ctx;
}
