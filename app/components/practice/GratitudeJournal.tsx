'use client';

import { useState, useRef } from 'react';
import {
  HeartHandshake,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
} from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate, offsetISODate, formatDisplayDate } from './shared';
import { triggerHaptic } from '@/lib/haptics';

const SLOTS = 3;

/**
 * Gratitude journal with three daily blessings, date navigation,
 * autosave indicator, export and delete capabilities.
 */
export function GratitudeJournal() {
  const [entries, setEntries] = useLocalStorage<Record<string, string[]>>(
    'dharma.practice.gratitude',
    {},
  );
  const [currentDate, setCurrentDate] = useState(localISODate());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = localISODate();
  const dateInfo = formatDisplayDate(currentDate);
  const currentSlots = entries[currentDate] ?? ['', '', ''];

  const daysKept = Object.keys(entries).filter((k) =>
    (entries[k] ?? []).some((s) => s.trim().length > 0),
  ).length;

  const hasAnyEntry = currentSlots.some((s) => s.trim().length > 0);

  function setSlot(i: number, value: string) {
    setSaveStatus('saving');
    const next = [...currentSlots];
    next[i] = value;
    setEntries({ ...entries, [currentDate]: next });

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  }

  function goPrevDay() {
    triggerHaptic('light');
    setCurrentDate((d) => offsetISODate(d, -1));
    setConfirmDelete(false);
  }

  function goNextDay() {
    triggerHaptic('light');
    if (currentDate < today) {
      setCurrentDate((d) => offsetISODate(d, 1));
      setConfirmDelete(false);
    }
  }

  function goToday() {
    triggerHaptic('light');
    setCurrentDate(today);
    setConfirmDelete(false);
  }

  function handleDeleteCurrent() {
    triggerHaptic('medium');
    const updated = { ...entries };
    delete updated[currentDate];
    setEntries(updated);
    setConfirmDelete(false);
  }

  function handleExport() {
    try {
      const lines = ['# Dharma Granth — Gratitude Journal (कृतज्ञता डायरी)\n'];
      const sortedKeys = Object.keys(entries).sort();
      for (const k of sortedKeys) {
        const slots = entries[k] ?? [];
        if (slots.some((s) => s.trim().length > 0)) {
          lines.push(`## ${k}`);
          slots.forEach((s, idx) => {
            if (s.trim()) lines.push(`${idx + 1}. ${s.trim()}`);
          });
          lines.push('');
        }
      }
      const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-gratitude-${today}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {}
  }

  return (
    <ToolCard
      icon={<HeartHandshake className="w-5 h-5 text-rose-600" />}
      title="Gratitude Journal"
      titleHindi="कृतज्ञता"
      accent="rose"
    >
      <div className="flex flex-col gap-3 h-full">
        {/* Date Navigation & Actions bar */}
        <div className="flex items-center justify-between px-2 py-1.5 bg-dharma-panel-muted rounded-xl border border-dharma-border/60 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrevDay}
              className="p-1 rounded-lg text-dharma-muted hover:text-dharma-text hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition"
              title="पिछला दिन · Previous day"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={goToday}
              className={`px-2 py-0.5 rounded-md font-semibold transition ${
                dateInfo.isToday
                  ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                  : 'text-dharma-text hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
              }`}
              title="आज पर जाएं · Jump to today"
            >
              <span>{dateInfo.hi}</span>
              <span className="hidden sm:inline text-dharma-muted font-normal ml-1">({dateInfo.en})</span>
            </button>

            <button
              type="button"
              onClick={goNextDay}
              disabled={currentDate >= today}
              className="p-1 rounded-lg text-dharma-muted hover:text-dharma-text hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition disabled:opacity-30 disabled:cursor-not-allowed"
              title="अगला दिन · Next day"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {hasAnyEntry && (
              <button
                type="button"
                onClick={() => setConfirmDelete(!confirmDelete)}
                className="p-1.5 rounded-lg text-dharma-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                title="इस दिन की कृतज्ञता हटाएं · Delete entry for this date"
                aria-label="Delete gratitude entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleExport}
              className="p-1.5 rounded-lg text-dharma-muted hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="कृतज्ञता एक्सपोर्ट करें · Export gratitude entries"
              aria-label="Export gratitude entries"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {confirmDelete && (
          <div className="p-2.5 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/30 text-xs flex items-center justify-between gap-2">
            <span className="text-rose-800 dark:text-rose-200 font-medium">
              क्या आप {dateInfo.hi} की प्रविष्टियां हटाना चाहते हैं?
            </span>
            <div className="flex gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-0.5 rounded border border-dharma-border bg-white dark:bg-stone-900 text-dharma-text"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleDeleteCurrent}
                className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold"
              >
                हटाएं
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-dharma-muted">
          आज मैं किन 3 बातों के लिए ईश्वर व प्रकृति का कृतज्ञ हूँ? Three gifts of grace.
        </p>

        {/* 3 Slots */}
        <div className="space-y-2.5 flex-1">
          {Array.from({ length: SLOTS }, (_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="shrink-0 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <input
                type="text"
                value={currentSlots[i] ?? ''}
                onChange={(e) => setSlot(i, e.target.value)}
                placeholder={['कोई व्यक्ति या संबंध… (A person)', 'कोई शांत क्षण या कृपा… (A peaceful moment)', 'कोई सामान्य आशीर्वाद… (Something ordinary)'][i]}
                className="flex-1 text-sm bg-dharma-panel-muted rounded-xl border border-dharma-border focus:border-rose-300 outline-none px-3.5 py-2 text-dharma-text placeholder:text-dharma-muted font-devanagari transition"
                aria-label={`Gratitude ${i + 1} for ${dateInfo.en}`}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-dharma-muted pt-1 border-t border-dharma-border/50">
          <span className="inline-flex items-center gap-1.5 font-medium">
            {saveStatus === 'saving' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>सहेजा जा रहा है...</span>
              </>
            ) : saveStatus === 'saved' || hasAnyEntry ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400">सहेजा गया · Saved</span>
              </>
            ) : (
              <span>स्वतः सहेजता है</span>
            )}
          </span>

          <span>{daysKept} दिन कृतज्ञता दर्ज</span>
        </div>
      </div>
    </ToolCard>
  );
}
