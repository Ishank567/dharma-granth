'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sunset, Moon } from 'lucide-react';
import { useTheme, type Theme } from './ThemeProvider';

const ICONS: Record<Theme, React.ReactNode> = {
  day: <Sun className="w-4 h-4" />,
  sunset: <Sunset className="w-4 h-4" />,
  night: <Moon className="w-4 h-4" />,
};

const LABELS: Record<Theme, string> = {
  day: 'Day',
  sunset: 'Sunset',
  night: 'Night',
};

const NEXT_LABEL: Record<Theme, string> = {
  day: 'Switch to Sunset',
  sunset: 'Switch to Night',
  night: 'Switch to Day',
};

/**
 * Compact cycling button for the 3-way theme picker. Each press
 * advances to the next theme (day → sunset → night → day). The icon
 * swaps with a brief rotate-fade so the change is felt as well as
 * seen.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={NEXT_LABEL[theme]}
      title={`Theme: ${LABELS[theme]} — click to cycle`}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dharma-border bg-white/80 backdrop-blur-sm text-dharma-text text-xs font-semibold hover:bg-saffron-50 hover:border-saffron-300 transition-colors shadow-sm ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="inline-flex"
        >
          {ICONS[theme]}
        </motion.span>
      </AnimatePresence>
      <span className="hidden sm:inline">{LABELS[theme]}</span>
    </button>
  );
}
