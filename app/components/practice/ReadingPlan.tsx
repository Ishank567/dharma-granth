'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard } from './shared';

interface Plan {
  id: string;
  title: string;
  titleHindi: string;
  days: number;
  /** Link for a given 1-based day. */
  hrefForDay: (day: number) => string;
  labelForDay: (day: number) => string;
}

const PLANS: Plan[] = [
  {
    id: 'gita-18',
    title: 'Bhagavad Gita in 18 days',
    titleHindi: 'गीता — प्रतिदिन एक अध्याय',
    days: 18,
    hrefForDay: (d) => `/scripture/bhagavadgita/chapter/${d}`,
    labelForDay: (d) => `अध्याय ${d}`,
  },
  {
    id: 'katha-6',
    title: 'Katha Upanishad in 6 days',
    titleHindi: 'कठोपनिषद् — प्रतिदिन एक वल्ली',
    days: 6,
    hrefForDay: (d) => `/scripture/katha/chapter/${d}`,
    labelForDay: (d) => `वल्ली ${d}`,
  },
];

interface PlanProgress {
  /** Selected plan id, or null when none chosen. */
  planId: string | null;
  /** Completed day numbers, per plan, so switching plans never loses work. */
  completed: Record<string, number[]>;
}

/**
 * A gentle, self-paced reading plan. No dates and no "missed day" states —
 * just an ordered checklist that remembers itself. Days link straight into
 * the reader.
 */
export function ReadingPlan() {
  const [progress, setProgress] = useLocalStorage<PlanProgress>('dharma.practice.readingPlan', {
    planId: null,
    completed: {},
  });

  const plan = PLANS.find((p) => p.id === progress.planId) ?? null;
  const done = plan ? (progress.completed[plan.id] ?? []) : [];

  function toggleDay(day: number) {
    if (!plan) return;
    const next = done.includes(day) ? done.filter((d) => d !== day) : [...done, day];
    setProgress({ ...progress, completed: { ...progress.completed, [plan.id]: next } });
  }

  return (
    <ToolCard icon={<BookOpen className="w-5 h-5" />} title="Reading Plan" titleHindi="पठन योजना" accent="emerald">
      {!plan ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-dharma-muted">Choose a plan — go at your own pace.</p>
          {PLANS.map((p) => {
            const partial = (progress.completed[p.id] ?? []).length;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setProgress({ ...progress, planId: p.id })}
                className="text-left rounded-xl border border-dharma-border hover:border-emerald-300 p-4 transition group"
              >
                <p className="text-sm font-bold text-dharma-text group-hover:text-emerald-700 transition">
                  {p.title}
                </p>
                <p className="font-devanagari text-xs text-dharma-muted mt-0.5">{p.titleHindi}</p>
                {partial > 0 && (
                  <p className="text-xs text-emerald-700 mt-1">
                    {partial}/{p.days} done — continue
                  </p>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-dharma-text">{plan.title}</p>
              <p className="font-devanagari text-xs text-dharma-muted">{plan.titleHindi}</p>
            </div>
            <button
              type="button"
              onClick={() => setProgress({ ...progress, planId: null })}
              className="text-xs font-semibold text-dharma-muted hover:text-emerald-700 shrink-0"
            >
              Change
            </button>
          </div>

          <div className="w-full h-1.5 rounded-full bg-dharma-border overflow-hidden" aria-hidden>
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-[width] duration-300"
              style={{ width: `${Math.round((done.length / plan.days) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-dharma-muted">
            {done.length}/{plan.days} days complete
          </p>

          <ul className="max-h-48 overflow-y-auto pr-1 space-y-1">
            {Array.from({ length: plan.days }, (_, i) => i + 1).map((day) => {
              const isDone = done.includes(day);
              return (
                <li key={day} className="flex items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => toggleDay(day)}
                    aria-label={`Mark day ${day} ${isDone ? 'incomplete' : 'complete'}`}
                    className={isDone ? 'text-emerald-600' : 'text-dharma-muted hover:text-emerald-600'}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>
                  <Link
                    href={plan.hrefForDay(day)}
                    className={`font-devanagari hover:text-emerald-700 transition ${
                      isDone ? 'text-dharma-muted line-through' : 'text-dharma-text'
                    }`}
                  >
                    Day {day} — {plan.labelForDay(day)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </ToolCard>
  );
}
