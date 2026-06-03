'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sunset, Moon } from 'lucide-react';
import type { ReactNode } from 'react';
import { THEMES, useTheme, type Theme } from './ThemeProvider';

const ICONS: Record<Theme, ReactNode> = {
  day: <Sun className="w-4 h-4" />,
  sunset: <Sunset className="w-4 h-4" />,
  night: <Moon className="w-4 h-4" />,
};

const LABELS: Record<Theme, string> = {
  day: 'Day',
  sunset: 'Sunset',
  night: 'Dark',
};

const DESCRIPTIONS: Record<Theme, string> = {
  day: 'Warm paper reading mode',
  sunset: 'Soft amber evening mode',
  night: 'Low-glare dark reading mode',
};

/**
 * Compact 3-way segmented theme picker. Explicit choices are easier
 * than cycling when users are comparing day, sunset, and dark modes.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-dharma-border bg-dharma-card/90 p-1 text-dharma-text shadow-sm backdrop-blur-sm ${className}`}
      role="radiogroup"
      aria-label="Color theme"
    >
      {THEMES.map((option) => {
        const active = option === theme;

        return (
          <button
            key={option}
            type="button"
            onClick={() => setTheme(option)}
            role="radio"
            aria-checked={active}
            aria-label={`${LABELS[option]} theme`}
            title={DESCRIPTIONS[option]}
            className={`relative inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-bold transition-colors ${
              active
                ? 'text-white'
                : 'text-dharma-muted hover:bg-saffron-500/10 hover:text-dharma-text'
            }`}
          >
            {active && (
              <motion.span
                layoutId="theme-toggle-active-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 shadow-sm"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <AnimatePresence mode="wait">
              <motion.span
                key={`${option}-${active}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="relative inline-flex"
              >
                {ICONS[option]}
              </motion.span>
            </AnimatePresence>
            <span className="relative hidden lg:inline">{LABELS[option]}</span>
          </button>
        );
      })}
    </div>
  );
}
