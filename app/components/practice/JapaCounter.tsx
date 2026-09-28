'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CircleDot, RotateCcw, Minus, Sparkles, Volume2 } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate } from './shared';
import { triggerTactileFeedback } from '@/lib/haptics';

interface JapaState {
  /** Local ISO day the count belongs to. */
  date: string;
  /** Beads counted within the current mala (0..107). */
  count: number;
  /** Completed malas (108 beads) today. */
  rounds: number;
  /** All-time completed malas, across days. */
  lifetimeRounds: number;
  /** Optional mantra label, purely for the user's own reference. */
  mantra: string;
}

const INITIAL: JapaState = { date: '', count: 0, rounds: 0, lifetimeRounds: 0, mantra: '' };
const MALA = 108;
const VISIBLE_BEADS = 27; // 1/4 quarter of mala visually rendered around perimeter for crisp 3D ring

/**
 * 3D Physical Japa Mala Counter with realistic Rudraksha bead physics,
 * tactile haptic vibrations, acoustic clicks, and celebratory temple bell chime.
 */
export function JapaCounter() {
  const [state, setState] = useLocalStorage<JapaState>('dharma.practice.japa', INITIAL);
  const [celebration, setCelebration] = useState(false);
  const reduce = useReducedMotion();

  const today = localISODate();
  const isToday = state.date === today;
  const count = isToday ? state.count : 0;
  const rounds = isToday ? state.rounds : 0;

  function tap() {
    setState((prev) => {
      const isSameDay = prev.date === today;
      const c = isSameDay ? prev.count : 0;
      const r = isSameDay ? prev.rounds : 0;
      const isComplete = c + 1 >= MALA;

      if (isComplete) {
        // Mala Completed! Celestial Chime + Celebratory vibration pattern
        triggerTactileFeedback('celestial', 'templeChime');
        setCelebration(true);
        setTimeout(() => setCelebration(false), 2400);
        return {
          ...prev,
          date: today,
          count: 0,
          rounds: r + 1,
          lifetimeRounds: prev.lifetimeRounds + 1,
        };
      }

      // Standard bead tap: physical bead click + haptic bump
      triggerTactileFeedback('malaBead', 'malaBead');
      return { ...prev, date: today, count: c + 1, rounds: r };
    });
  }

  function undo() {
    triggerTactileFeedback('light', 'softTap');
    setState((prev) => {
      const isSameDay = prev.date === today;
      const c = isSameDay ? prev.count : 0;
      const r = isSameDay ? prev.rounds : 0;
      if (c === 0 && r === 0) return prev;
      return c === 0
        ? {
            ...prev,
            date: today,
            count: MALA - 1,
            rounds: r - 1,
            lifetimeRounds: Math.max(0, prev.lifetimeRounds - 1),
          }
        : { ...prev, date: today, count: c - 1, rounds: r };
    });
  }

  function resetToday() {
    triggerTactileFeedback('heavy', 'click');
    setState((prev) => {
      const isSameDay = prev.date === today;
      const r = isSameDay ? prev.rounds : 0;
      return {
        ...prev,
        date: today,
        count: 0,
        rounds: 0,
        lifetimeRounds: Math.max(0, prev.lifetimeRounds - r),
      };
    });
  }

  const pct = Math.round((count / MALA) * 100);
  const beadAngle = (count % VISIBLE_BEADS) * (360 / VISIBLE_BEADS);

  return (
    <ToolCard
      icon={<CircleDot className="w-5 h-5 text-saffron-600" />}
      title="3D Japa Mala"
      titleHindi="जप साधना"
      accent="saffron"
    >
      <div className="flex flex-col items-center gap-5">
        <input
          type="text"
          value={state.mantra}
          onChange={(e) => setState({ ...state, mantra: e.target.value })}
          placeholder="मंत्र (optional) — e.g. ॐ नमः शिवाय"
          className="w-full text-center font-devanagari text-base bg-transparent border-b border-dharma-border focus:border-saffron-500 outline-none py-1.5 text-dharma-text placeholder:text-dharma-muted transition"
          aria-label="Mantra label"
        />

        {/* 3D Realistic Mala Rosary Wheel */}
        <div className="relative w-52 h-52 flex items-center justify-center select-none perspective-[800px]">
          {/* Rotating 3D Rosary Beads Ring */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={reduce ? undefined : { rotate: beadAngle }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            {Array.from({ length: VISIBLE_BEADS }).map((_, i) => {
              const angle = (i * 360) / VISIBLE_BEADS;
              const rad = (angle * Math.PI) / 180;
              const r = 90; // distance from center
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              const isCurrent = i === 0;

              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <div
                    className={`rounded-full transition-all duration-200 ${
                      isCurrent
                        ? 'w-5 h-5 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_12px_rgba(251,191,36,0.9)] ring-2 ring-white scale-125'
                        : 'w-3.5 h-3.5 bg-gradient-to-br from-[#854d0e] via-[#713f12] to-[#422006] shadow-md border border-amber-900/40'
                    }`}
                    style={{
                      boxShadow: isCurrent
                        ? '0 0 16px rgba(245, 158, 11, 0.9), inset 1px 1px 2px rgba(255,255,255,0.8)'
                        : 'inset -1px -1px 3px rgba(0,0,0,0.6), inset 1px 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                </div>
              );
            })}

            {/* Guru Bead / Sumeru Marker */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: 'translate(0px, -92px)',
              }}
            >
              <div
                className="w-5 h-6 rounded-t-full bg-gradient-to-b from-amber-400 to-amber-700 shadow-lg border border-amber-200/50"
                title="Sumeru Bead (सुमेरु)"
              />
            </div>
          </motion.div>

          {/* Central 3D Tactile Tap Button */}
          <motion.button
            type="button"
            onClick={tap}
            whileHover={reduce ? undefined : { scale: 1.04 }}
            whileTap={reduce ? undefined : { scale: 0.92, y: 3 }}
            className="relative z-10 w-32 h-32 rounded-full text-white flex flex-col items-center justify-center select-none shadow-[0_12px_32px_rgba(194,65,12,0.45)] transition-all cursor-pointer"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #ea580c 0%, #c2410c 45%, #7c2d12 100%)',
              boxShadow: `
                inset 0 2px 4px rgba(255, 255, 255, 0.4),
                inset 0 -4px 6px rgba(0, 0, 0, 0.4),
                0 16px 36px -8px rgba(124, 45, 18, 0.5)
              `,
            }}
            aria-label="Tap to count prayer bead"
          >
            {/* Shimmer ring */}
            <div className="absolute inset-1 rounded-full border border-amber-300/30 pointer-events-none" />

            <AnimatePresence mode="popLayout">
              <motion.span
                key={count}
                initial={{ opacity: 0, scale: 0.8, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.2, y: 4 }}
                transition={{ duration: 0.12 }}
                className="text-4xl font-extrabold tabular-nums tracking-tight drop-shadow-md"
              >
                {count}
              </motion.span>
            </AnimatePresence>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-200/90 mt-0.5">
              of {MALA}
            </span>

            {/* Completion Golden Halo Burst */}
            {celebration && (
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-4 border-amber-400 bg-amber-400/20 pointer-events-none"
              />
            )}
          </motion.button>
        </div>

        {/* Progress bar with percentage */}
        <div className="w-full space-y-1.5">
          <div className="flex justify-between text-xs text-dharma-muted">
            <span>प्रगति: {pct}%</span>
            <span>{MALA - count} शेष</span>
          </div>
          <div className="w-full h-2 rounded-full bg-dharma-border overflow-hidden p-0.5" aria-hidden>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-saffron-500 via-amber-400 to-amber-600 shadow-sm"
              style={{ width: `${pct}%` }}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center justify-between w-full text-xs text-dharma-muted px-2 py-1 bg-dharma-bg/60 rounded-xl border border-dharma-border/60">
          <span>
            आज: <strong className="text-dharma-text font-bold">{rounds}</strong> माला (
            {rounds * MALA + count} जाप)
          </span>
          <span>
            कुल: <strong className="text-dharma-text font-bold">{state.lifetimeRounds}</strong> माला
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={undo}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-dharma-border text-dharma-muted hover:text-saffron-700 hover:border-saffron-300 transition active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" /> Undo
          </button>
          <button
            type="button"
            onClick={resetToday}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-dharma-border text-dharma-muted hover:text-saffron-700 hover:border-saffron-300 transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset today
          </button>
        </div>
      </div>
    </ToolCard>
  );
}
