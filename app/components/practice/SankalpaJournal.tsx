'use client';

import { useState } from 'react';
import { Target, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate } from './shared';

interface Sankalpa {
  id: string;
  date: string;
  text: string;
  fulfilled: boolean;
}

/**
 * Personal saṅkalpa (vow / intention) journal. Intentions are phrased by the
 * user, kept privately on-device, and can be marked fulfilled — there is no
 * scoring and nothing to compare with anyone else.
 */
export function SankalpaJournal() {
  const [entries, setEntries] = useLocalStorage<Sankalpa[]>('dharma.practice.sankalpa', []);
  const [draft, setDraft] = useState('');

  function add() {
    const text = draft.trim();
    if (!text) return;
    setEntries([
      { id: `${Date.now()}`, date: localISODate(), text, fulfilled: false },
      ...entries,
    ]);
    setDraft('');
  }

  function toggle(id: string) {
    setEntries(entries.map((e) => (e.id === id ? { ...e, fulfilled: !e.fulfilled } : e)));
  }

  function remove(id: string) {
    setEntries(entries.filter((e) => e.id !== id));
  }

  return (
    <ToolCard icon={<Target className="w-5 h-5" />} title="Saṅkalpa Journal" titleHindi="संकल्प" accent="saffron">
      <div className="flex flex-col gap-3 h-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="मेरा संकल्प — e.g. this month I will read one verse daily"
            className="flex-1 text-sm bg-dharma-panel-muted rounded-full border border-dharma-border focus:border-saffron-300 outline-none px-4 py-2 text-dharma-text placeholder:text-dharma-muted"
            aria-label="New sankalpa"
          />
          <button
            type="submit"
            className="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-saffron-500 to-amber-600 text-white flex items-center justify-center shadow hover:shadow-md transition"
            aria-label="Add sankalpa"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {entries.length === 0 ? (
          <p className="text-sm text-dharma-muted">
            A saṅkalpa is a short, positive vow. Keep it small enough to keep.
          </p>
        ) : (
          <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {entries.map((e) => (
              <li key={e.id} className="group flex items-start gap-2 rounded-xl border border-dharma-border p-3">
                <button
                  type="button"
                  onClick={() => toggle(e.id)}
                  aria-label={e.fulfilled ? 'Mark unfulfilled' : 'Mark fulfilled'}
                  className={`mt-0.5 shrink-0 ${e.fulfilled ? 'text-emerald-600' : 'text-dharma-muted hover:text-saffron-600'}`}
                >
                  {e.fulfilled ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${e.fulfilled ? 'text-dharma-muted line-through' : 'text-dharma-text'}`}>
                    {e.text}
                  </p>
                  <p className="text-[11px] text-dharma-muted">{e.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  aria-label="Delete sankalpa"
                  className="shrink-0 text-dharma-muted opacity-0 group-hover:opacity-100 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ToolCard>
  );
}
