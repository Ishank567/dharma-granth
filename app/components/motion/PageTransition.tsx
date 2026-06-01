'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Per-route fade-in wrapper plus a brief shimmer sweep across the
 * top of the viewport.
 *
 * Design notes:
 *
 * - We do NOT use AnimatePresence + mode="wait" here. That pattern
 *   defers rendering the new route until the previous one finishes its
 *   exit animation, which breaks Next 14's streaming SSR and the
 *   loading.tsx Suspense boundary — the new page would not start
 *   downloading until the old fade-out completes.
 * - Instead, we key the wrapper by `pathname` so React remounts both
 *   the page content (which fades in) and the shimmer overlay (which
 *   sweeps once) on every navigation.
 * - The shimmer is a fixed, full-width gradient bar that slides from
 *   left to right across the top edge in ~700ms. It's visible enough
 *   to feel like a "page change" cue without being intrusive — like a
 *   YouTube-style top progress bar but lighter.
 * - Respects prefers-reduced-motion: re-keys but no animation runs.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  return (
    <>
      {/* Shimmer sweep — keyed by pathname so it remounts on each nav. */}
      {!reduce && (
        <motion.div
          key={`shimmer-${pathname}`}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[3px] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 1, times: [0, 0.7, 1] }}
        >
          <motion.div
            className="absolute inset-y-0 w-1/3"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.9) 30%, rgba(245, 158, 11, 1) 50%, rgba(249, 115, 22, 0.9) 70%, transparent 100%)',
              boxShadow: '0 0 12px rgba(249, 115, 22, 0.6)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '400%' }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.2, 1] }}
          />
        </motion.div>
      )}

      <motion.div
        key={pathname}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </>
  );
}
