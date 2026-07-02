'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CircleDot, RotateCcw, Minus } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate } from './shared';

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

/**
 * Private japa (mantra repetition) counter. One tap = one bead; 108 beads
 * complete a mala. Today's count resets naturally at local midnight (the
 * stored date no longer matches), while the lifetime mala total carries on.
 */
export function JapaCounter() {
  const [state, setState] = useLocalStorage<JapaState>('dharma.practice.japa', INITIAL);
  const reduce = useReducedMotion();

  const today = localISODate();
  const isToday = state.date === today;
  const count = isToday ? state.count : 0;
  const rounds = isToday ? state.rounds : 0;

  // All mutations use functional updates: japa is rapid tapping, and two
  // taps inside one render cycle would otherwise both read the same stale
  // count and drop a bead.
  function tap() {
    setState((prev) => {
      const isSameDay = prev.date === today;
      const c = isSameDay ? prev.count : 0;
      const r = isSameDay ? prev.rounds : 0;
      return c + 1 >= MALA
        ? { ...prev, date: today, count: 0, rounds: r + 1, lifetimeRounds: prev.lifetimeRounds + 1 }
        : { ...prev, date: today, count: c + 1, rounds: r };
    });
  }

  function undo() {
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

  return (
    <ToolCard icon={<CircleDot className="w-5 h-5" />} title="Japa Counter" titleHindi="जप माला" accent="saffron">
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          value={state.mantra}
          onChange={(e) => setState({ ...state, mantra: e.target.value })}
          placeholder="मंत्र (optional) — e.g. ॐ नमः शिवाय"
          className="w-full text-center font-devanagari text-sm bg-transparent border-b border-dharma-border focus:border-saffron-400 outline-none py-1 text-dharma-text placeholder:text-dharma-muted"
          aria-label="Mantra label"
        />

        <motion.button
          type="button"
          onClick={tap}
          whileTap={reduce ? undefined : { scale: 0.93 }}
          className="relative w-36 h-36 rounded-full bg-gradient-to-br from-saffron-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center justify-center select-none"
          aria-label="Count one bead"
        >
          <span className="text-4xl font-bold tabular-nums">{count}</span>
          <span className="text-xs opacity-80">of {MALA}</span>
        </motion.button>

        <div className="w-full h-1.5 rounded-full bg-dharma-border overflow-hidden" aria-hidden>
          <div
            className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-amber-500 transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-xs text-dharma-muted">
          <span>
            आज: <strong className="text-dharma-text">{rounds}</strong> माला
          </span>
          <span>
            कुल: <strong className="text-dharma-text">{state.lifetimeRounds}</strong> माला
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={undo}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-dharma-border text-dharma-muted hover:text-saffron-700 hover:border-saffron-300 transition"
          >
            <Minus className="w-3 h-3" /> Undo
          </button>
          <button
            type="button"
            onClick={resetToday}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-dharma-border text-dharma-muted hover:text-saffron-700 hover:border-saffron-300 transition"
          >
            <RotateCcw className="w-3 h-3" /> Reset today
          </button>
        </div>
      </div>
    </ToolCard>
  );
}
