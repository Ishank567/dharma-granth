'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * Per-route fade-in wrapper.
 *
 * Notes on the design choice:
 *
 * - We do NOT use AnimatePresence + mode="wait" here. That pattern
 *   defers rendering the new route until the previous one finishes its
 *   exit animation, which breaks Next 14's streaming SSR and the
 *   loading.tsx Suspense boundary — the new page would not start
 *   downloading until the old fade-out completes.
 * - Instead, we key the motion.div by `pathname` so React remounts it
 *   on every navigation. The new page mounts immediately (streaming
 *   intact) and just fades in over ~250ms. No exit animation; the
 *   browser instantly swaps in the new tree, then it fades up.
 * - Respects prefers-reduced-motion: the wrapper still re-keys but no
 *   transition runs.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
