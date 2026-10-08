'use client';

import { useState } from 'react';
import { ListChecks, Plus, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate } from './shared';
import { triggerHaptic } from '@/lib/haptics';

type Slot = 'morning' | 'midday' | 'evening';

interface RoutineStep {
  id: string;
  label: string;
  slot: Slot;
  minutes: number;
}

const SLOTS: { id: Slot; en: string; hi: string }[] = [
  { id: 'morning', en: 'Morning', hi: 'प्रातः' },
  { id: 'midday', en: 'Midday', hi: 'मध्याह्न' },
  { id: 'evening', en: 'Evening', hi: 'सायं' },
];

const SUGGESTIONS = ['Read one verse', 'Silent sitting', 'Japa', 'Write a reflection', 'Evening gratitude'];

/**
 * A personal routine the reader designs. Steps are ticked off per day with
 * no scoring: a day that was not ticked is simply an empty day.
 * Stored only in this browser (`dharma.practice.routine`, `.routine.done`).
 */
export function RoutineBuilder() {
  const [steps, setSteps] = useLocalStorage<RoutineStep[]>('dharma.practice.routine', []);
  const [done, setDone] = useLocalStorage<Record<string, string[]>>('dharma.practice.routine.done', {});
  const [label, setLabel] = useState('');
  const [slot, setSlot] = useState<Slot>('morning');
  const [minutes, setMinutes] = useState(10);

  const today = localISODate();
  const doneToday = done[today] ?? [];
  const monthPrefix = today.slice(0, 7);
  const daysThisMonth = Object.entries(done).filter(([d, ids]) => d.startsWith(monthPrefix) && ids.length > 0).length;

  function addStep(text: string) {
    const clean = text.trim().slice(0, 80);
    if (!clean) return;
    triggerHaptic('light');
    setSteps([...steps, { id: `${Date.now().toString(36)}${steps.length}`, label: clean, slot, minutes }]);
    setLabel('');
  }

  function removeStep(id: string) {
    triggerHaptic('medium');
    setSteps(steps.filter((s) => s.id !== id));
    setDone(Object.fromEntries(Object.entries(done).map(([d, ids]) => [d, ids.filter((x) => x !== id)])));
  }

  function toggle(id: string) {
    triggerHaptic('light');
    const next = doneToday.includes(id) ? doneToday.filter((x) => x !== id) : [...doneToday, id];
    setDone({ ...done, [today]: next });
  }

  return (
    <ToolCard icon={<ListChecks className="w-5 h-5" />} title="My Routine" titleHindi="मेरा दैनिक क्रम" accent="emerald">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-dharma-muted">
          Build a routine that fits your day. Tick what you did; nothing is scored, and an unticked day is just a quiet day.
          Stored only in this browser.
        </p>

        {steps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-dharma-border p-4 text-center text-sm text-dharma-muted">
            <p>No steps yet. Start with one small thing.</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => addStep(s)} className="min-h-[44px] rounded-full border border-dharma-border px-3 text-sm font-semibold hover:border-saffron-300">
                  + {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          SLOTS.map((sl) => {
            const list = steps.filter((s) => s.slot === sl.id);
            if (list.length === 0) return null;
            return (
              <div key={sl.id}>
                <h4 className="mb-1 text-sm font-bold uppercase tracking-wide text-dharma-muted">
                  {sl.en} · <span lang="hi" className="font-devanagari normal-case">{sl.hi}</span>
                </h4>
                <ul className="space-y-1.5">
                  {list.map((s) => (
                    <li key={s.id} className="flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-3">
                      <label className="flex min-h-[44px] flex-1 cursor-pointer items-center gap-3 text-sm text-dharma-text">
                        <input type="checkbox" checked={doneToday.includes(s.id)} onChange={() => toggle(s.id)} className="h-5 w-5 accent-emerald-600" />
                        <span className={doneToday.includes(s.id) ? 'text-dharma-muted line-through decoration-1' : ''}>{s.label}</span>
                        <span className="ml-auto text-sm text-dharma-muted">{s.minutes} min</span>
                      </label>
                      <button type="button" onClick={() => removeStep(s.id)} aria-label={`Remove ${s.label}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-dharma-muted hover:text-rose-600">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); addStep(label); }}
          className="flex flex-wrap items-end gap-2 border-t border-dharma-border/60 pt-3"
        >
          <label className="min-w-[10rem] flex-1 text-sm font-semibold text-dharma-muted">
            New step
            <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={80} className="mt-1 block min-h-[44px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text" />
          </label>
          <label className="text-sm font-semibold text-dharma-muted">
            When
            <select value={slot} onChange={(e) => setSlot(e.target.value as Slot)} className="mt-1 block min-h-[44px] rounded-xl border border-dharma-border bg-dharma-bg px-2 text-sm text-dharma-text">
              {SLOTS.map((s) => <option key={s.id} value={s.id}>{s.en}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-dharma-muted">
            Minutes
            <input type="number" min={1} max={180} value={minutes} onChange={(e) => setMinutes(Math.min(180, Math.max(1, Number(e.target.value) || 1)))} className="mt-1 block min-h-[44px] w-20 rounded-xl border border-dharma-border bg-dharma-bg px-2 text-sm text-dharma-text" />
          </label>
          <button type="submit" className="inline-flex min-h-[44px] items-center gap-1 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800">
            <Plus className="h-4 w-4" aria-hidden="true" /> Add
          </button>
        </form>

        {steps.length > 0 && (
          <p role="status" className="text-sm text-dharma-muted">
            Today: {doneToday.filter((id) => steps.some((s) => s.id === id)).length} of {steps.length} steps.
            {daysThisMonth > 0 && ` You followed your routine on ${daysThisMonth} ${daysThisMonth === 1 ? 'day' : 'days'} this month.`}
          </p>
        )}
      </div>
    </ToolCard>
  );
}
