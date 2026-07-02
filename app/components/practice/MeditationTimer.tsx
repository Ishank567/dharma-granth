'use client';

import { useEffect, useRef, useState } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard } from './shared';

interface MeditationStats {
  /** Completed sessions, all time. */
  sessions: number;
  /** Total completed minutes, all time. */
  minutes: number;
}

const PRESETS = [5, 10, 15, 20, 30];

/**
 * Simple countdown meditation timer. Only *completed* sessions are added to
 * the private stats — abandoning a session records nothing, so the numbers
 * stay honest without ever feeling punitive.
 */
export function MeditationTimer() {
  const [stats, setStats] = useLocalStorage<MeditationStats>('dharma.practice.meditation', {
    sessions: 0,
    minutes: 0,
  });
  const [minutes, setMinutes] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick while running; complete at zero.
  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          setDone(true);
          setStats((prev) => ({ sessions: prev.sessions + 1, minutes: prev.minutes + minutes }));
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, minutes, setStats]);

  function pick(m: number) {
    setMinutes(m);
    setSecondsLeft(m * 60);
    setRunning(false);
    setDone(false);
  }

  function reset() {
    setSecondsLeft(minutes * 60);
    setRunning(false);
    setDone(false);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const pct = 100 - Math.round((secondsLeft / (minutes * 60)) * 100);

  return (
    <ToolCard icon={<Timer className="w-5 h-5" />} title="Meditation Timer" titleHindi="ध्यान" accent="indigo">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => pick(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                m === minutes
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-dharma-border text-dharma-muted hover:border-indigo-300 hover:text-indigo-700'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>

        {done ? (
          <div className="flex flex-col items-center py-4">
            <span className="font-devanagari text-5xl text-saffron-600 mb-2">ॐ</span>
            <p className="text-sm font-semibold text-dharma-text">Session complete</p>
            <p className="font-devanagari text-xs text-dharma-muted">शान्तिः शान्तिः शान्तिः</p>
          </div>
        ) : (
          <div className="relative flex items-center justify-center py-2">
            <span className="text-5xl font-bold tabular-nums text-dharma-text">
              {mm}:{ss}
            </span>
          </div>
        )}

        <div className="w-full h-1.5 rounded-full bg-dharma-border overflow-hidden" aria-hidden>
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-[width] duration-1000"
            style={{ width: `${done ? 100 : pct}%` }}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => (done ? reset() : setRunning((r) => !r))}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow hover:shadow-md transition"
          >
            {done ? (
              <>
                <RotateCcw className="w-4 h-4" /> Again
              </>
            ) : running ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Start
              </>
            )}
          </button>
          {!done && secondsLeft !== minutes * 60 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold border border-dharma-border text-dharma-muted hover:text-indigo-700 hover:border-indigo-300 transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        <p className="text-xs text-dharma-muted">
          {stats.sessions} session{stats.sessions === 1 ? '' : 's'} · {stats.minutes} min all time
        </p>
      </div>
    </ToolCard>
  );
}
