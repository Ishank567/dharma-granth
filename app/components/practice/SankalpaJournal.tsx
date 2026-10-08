'use client';

import { useState } from 'react';
import { Target, Plus, Trash2, CheckCircle2, Circle, Download } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate } from './shared';
import { triggerHaptic } from '@/lib/haptics';

interface Sankalpa {
  id: string;
  date: string;
  text: string;
  fulfilled: boolean;
}

/**
 * Personal saṅkalpa (vow / intention) journal with fulfillment tracking,
 * export option, and device-only privacy.
 */
export function SankalpaJournal() {
  const [entries, setEntries] = useLocalStorage<Sankalpa[]>('dharma.practice.sankalpa', []);
  const [draft, setDraft] = useState('');

  const today = localISODate();

  function add() {
    const text = draft.trim();
    if (!text) return;
    triggerHaptic('medium');
    setEntries([
      { id: `${Date.now()}`, date: today, text, fulfilled: false },
      ...entries,
    ]);
    setDraft('');
  }

  function toggle(id: string) {
    triggerHaptic('light');
    setEntries(entries.map((e) => (e.id === id ? { ...e, fulfilled: !e.fulfilled } : e)));
  }

  function remove(id: string) {
    triggerHaptic('medium');
    setEntries(entries.filter((e) => e.id !== id));
  }

  function handleExport() {
    try {
      const lines = ['# Dharma Granth — Saṅkalpa Journal (संकल्प साधना)\n'];
      entries.forEach((e) => {
        lines.push(`- [${e.fulfilled ? 'x' : ' '}] ${e.text} (${e.date})`);
      });
      const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-sankalpa-${today}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {}
  }

  const activeCount = entries.filter((e) => !e.fulfilled).length;
  const fulfilledCount = entries.filter((e) => e.fulfilled).length;

  return (
    <ToolCard
      icon={<Target className="w-5 h-5 text-saffron-600" />}
      title="Saṅkalpa Journal"
      titleHindi="संकल्प साधना"
      accent="saffron"
    >
      <div className="flex flex-col gap-3 h-full">
        {/* Header bar with count & export */}
        <div className="flex items-center justify-between text-xs text-dharma-muted">
          <span>
            सक्रिय संकल्प: <strong className="text-dharma-text">{activeCount}</strong> · पूर्ण: {fulfilledCount}
          </span>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1 p-1 rounded-lg text-dharma-muted hover:text-saffron-700 hover:bg-saffron-50 dark:hover:bg-saffron-950/30 transition"
              title="संकल्प एक्सपोर्ट करें · Export vows"
              aria-label="Export vows"
            >
              <Download className="w-3.5 h-3.5" />
              <span>एक्सपोर्ट</span>
            </button>
          )}
        </div>

        {/* Input form */}
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
            placeholder="मेरा संकल्प — जैसे: प्रतिदिन एक श्लोक का मनन करूंगा"
            className="flex-1 text-sm bg-dharma-panel-muted rounded-xl border border-dharma-border focus:border-saffron-400 outline-none px-4 py-2.5 text-dharma-text placeholder:text-dharma-muted font-devanagari transition"
            aria-label="New sankalpa"
          />
          <button
            type="submit"
            className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-600 to-amber-600 text-white flex items-center justify-center shadow hover:shadow-md transition active:scale-95"
            aria-label="Add sankalpa"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {entries.length === 0 ? (
          <p className="text-xs text-dharma-muted py-3 text-center">
            संकल्प एक सकारात्मक आध्यात्मिक प्रतिज्ञा है। इसे इतना सरल रखें कि निष्ठापूर्वक निभाया जा सके।
          </p>
        ) : (
          <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {entries.map((e) => (
              <li
                key={e.id}
                className={`group flex items-start gap-2.5 rounded-xl border p-3 transition ${
                  e.fulfilled
                    ? 'border-emerald-200/60 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-950/15'
                    : 'border-dharma-border bg-dharma-panel-muted/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(e.id)}
                  aria-label={e.fulfilled ? 'Mark unfulfilled' : 'Mark fulfilled'}
                  className={`mt-0.5 shrink-0 ${e.fulfilled ? 'text-emerald-600 dark:text-emerald-400' : 'text-dharma-muted hover:text-saffron-600'}`}
                >
                  {e.fulfilled ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-devanagari ${e.fulfilled ? 'text-dharma-muted line-through' : 'text-dharma-text'}`}>
                    {e.text}
                  </p>
                  <p className="text-[10px] text-dharma-muted mt-0.5">{e.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  aria-label="Delete sankalpa"
                  className="shrink-0 text-dharma-muted opacity-0 group-hover:opacity-100 hover:text-rose-600 p-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ToolCard>
  );
}
