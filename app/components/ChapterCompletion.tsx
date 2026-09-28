'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Flame, X } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';
import {
  isChapterCompleted,
  markChapterCompleted,
  readActiveStreak,
} from '@/lib/reading-history';
import { PetalBurst } from '@/app/components/motion/PetalBurst';

interface Props {
  scriptureId: string;
  chapterId: number;
  chapterTitle: string;
  totalChapters: number;
  nextHref?: string;
  nextLabel?: string;
}

/** Visible reading time before reaching the end counts as "read". */
const MIN_READ_MS = 20_000;
/** Share of the scrollable page the reader must have passed through. */
const MIN_SCROLL_DEPTH = 0.6;
const TOAST_MS = 12_000;

/**
 * Marks the chapter complete when the reader genuinely reaches its end, then
 * celebrates: marigold petals, a success haptic, and a toast with the streak,
 * book progress and a one-tap "next chapter". Fires once per chapter.
 * Render with a `key` per chapter so state resets on client navigation.
 */
export function ChapterCompletion({
  scriptureId,
  chapterId,
  chapterTitle,
  totalChapters,
  nextHref,
  nextLabel,
}: Props) {
  const reduce = useReducedMotion();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [celebration, setCelebration] = useState<{ streak: number; done: number } | null>(null);
  const [petals, setPetals] = useState(false);

  useEffect(() => {
    if (isChapterCompleted(scriptureId, chapterId)) {
      setAlreadyDone(true);
      return;
    }

    let visibleMs = 0;
    let lastTick = performance.now();
    let maxDepth = 0;
    let atEnd = false;
    let fired = false;

    const measureDepth = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // Short pages that barely scroll count as fully seen.
      const depth = scrollable <= 200 ? 1 : window.scrollY / scrollable;
      maxDepth = Math.max(maxDepth, depth);
    };

    const tryFire = () => {
      if (fired || !atEnd || visibleMs < MIN_READ_MS || maxDepth < MIN_SCROLL_DEPTH) return;
      fired = true;
      const done = markChapterCompleted(scriptureId, chapterId);
      const streak = readActiveStreak();
      window.dispatchEvent(new Event('dharma:streak-change'));
      triggerTactileFeedback('success', 'success');
      setAlreadyDone(true);
      setCelebration({ streak, done });
      if (!reduce) setPetals(true);
    };

    // Count reading time only while the tab is actually visible.
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (!document.hidden) visibleMs += now - lastTick;
      lastTick = now;
      tryFire();
    }, 1000);

    const onScroll = () => {
      measureDepth();
      tryFire();
    };
    measureDepth();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      atEnd = entry.isIntersecting;
      tryFire();
    });
    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [scriptureId, chapterId, reduce]);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!celebration) return;
    const t = window.setTimeout(() => setCelebration(null), TOAST_MS);
    return () => window.clearTimeout(t);
  }, [celebration]);

  const percent = celebration
    ? Math.min(100, Math.round((celebration.done / Math.max(1, totalChapters)) * 100))
    : 0;

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      {alreadyDone && !celebration && (
        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          यह अध्याय पूर्ण हो चुका है
        </p>
      )}

      {petals && <PetalBurst onDone={() => setPetals(false)} />}

      <AnimatePresence>
        {celebration && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.92, rotateX: 18 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            style={{ transformPerspective: 900 }}
            className="fixed inset-x-4 bottom-24 z-[65] mx-auto max-w-md overflow-hidden rounded-3xl border border-amber-300/50 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 p-5 text-white shadow-[0_24px_80px_rgba(234,88,12,0.45)]"
          >
            {/* Slow golden sheen across the card */}
            {!reduce && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-amber-200/15 to-transparent"
                animate={{ x: ['0%', '400%'] }}
                transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
              />
            )}

            <button
              type="button"
              onClick={() => setCelebration(null)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="बंद करें (Close)"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <motion.div
                initial={reduce ? false : { scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 14, delay: 0.15 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-orange-600/40"
              >
                <CheckCircle2 className="h-7 w-7 text-white" aria-hidden="true" />
              </motion.div>
              <div className="min-w-0 pr-6">
                <p className="text-xs font-bold text-amber-300">
                  अध्याय पूर्ण ·{' '}
                  <span className="uppercase tracking-[0.18em]">Chapter complete</span>
                </p>
                <p className="mt-1 truncate font-serif text-lg font-bold">
                  {chapterId}. {chapterTitle}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              {celebration.streak > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 font-bold text-amber-200 ring-1 ring-orange-400/30">
                  <Flame className="flame-flicker h-4 w-4 text-orange-400" aria-hidden="true" />
                  {celebration.streak} दिन
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex justify-between text-xs text-white/70">
                  <span>ग्रंथ प्रगति</span>
                  <span>
                    {celebration.done} / {totalChapters}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: reduce ? 0 : 1, ease: 'easeOut', delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {nextHref && (
              <Link
                href={nextHref}
                onClick={() => setCelebration(null)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:from-saffron-500 hover:to-amber-400"
              >
                अगला अध्याय {chapterId + 1}
                {nextLabel ? ` · ${nextLabel}` : ''}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
