'use client';

import { HeartHandshake } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate } from './shared';

const SLOTS = 3;

/**
 * Gratitude journal: three small thanks a day, saved privately per date.
 * Deliberately no streaks or badges — the practice is the reward.
 */
export function GratitudeJournal() {
  const [entries, setEntries] = useLocalStorage<Record<string, string[]>>(
    'dharma.practice.gratitude',
    {},
  );

  const today = localISODate();
  const todays = entries[today] ?? ['', '', ''];
  const daysKept = Object.keys(entries).filter((k) =>
    (entries[k] ?? []).some((s) => s.trim().length > 0),
  ).length;

  function setSlot(i: number, value: string) {
    const next = [...todays];
    next[i] = value;
    setEntries({ ...entries, [today]: next });
  }

  return (
    <ToolCard
      icon={<HeartHandshake className="w-5 h-5" />}
      title="Gratitude Journal"
      titleHindi="कृतज्ञता"
      accent="rose"
    >
      <div className="flex flex-col gap-3 h-full">
        <p className="text-sm text-dharma-muted">आज मैं किसके लिए कृतज्ञ हूँ? Three small things.</p>
        <div className="space-y-2 flex-1">
          {Array.from({ length: SLOTS }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="shrink-0 w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <input
                type="text"
                value={todays[i] ?? ''}
                onChange={(e) => setSlot(i, e.target.value)}
                placeholder={['A person…', 'A moment…', 'Something ordinary…'][i]}
                className="flex-1 text-sm bg-dharma-panel-muted rounded-full border border-dharma-border focus:border-rose-300 outline-none px-4 py-2 text-dharma-text placeholder:text-dharma-muted"
                aria-label={`Gratitude ${i + 1}`}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-dharma-muted">
          {daysKept} day{daysKept === 1 ? '' : 's'} of gratitude kept — visible only to you.
        </p>
      </div>
    </ToolCard>
  );
}
