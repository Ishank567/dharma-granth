'use client';

import { useEffect, useState, useRef } from 'react';
import {
  PenLine,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, localISODate, dayOfYear, offsetISODate, formatDisplayDate } from './shared';
import { triggerHaptic } from '@/lib/haptics';

/** Rotating contemplative prompts for introspection throughout the year. */
const PROMPTS: { en: string; hi: string }[] = [
  { en: 'Where did I act without expecting a result today?', hi: 'आज मैंने कहाँ फल की चिंता किए बिना कर्म किया?' },
  { en: 'What am I holding on to that I could release?', hi: 'मैं किस चीज़ को पकड़े हुए हूँ जिसे छोड़ सकता/सकती हूँ?' },
  { en: 'Who tested my patience — and what did that teach me?', hi: 'किसने मेरे धैर्य की परीक्षा ली — और उससे क्या सीखा?' },
  { en: 'What did I read or hear today that felt true?', hi: 'आज क्या पढ़ा या सुना जो सत्य लगा?' },
  { en: 'Where was I generous today? Where could I have been?', hi: 'आज मैं कहाँ उदार रहा/रही? कहाँ हो सकता/सकती थी?' },
  { en: 'What fear shaped a decision today?', hi: 'आज किस भय ने मेरा कोई निर्णय प्रभावित किया?' },
  { en: 'When did I feel most still today?', hi: 'आज मैं सबसे अधिक शांत कब था/थी?' },
  { en: 'What duty am I avoiding, and why?', hi: 'मैं किस कर्तव्य से बच रहा/रही हूँ, और क्यों?' },
  { en: 'What would I do differently if no one were watching?', hi: 'अगर कोई न देख रहा होता तो मैं क्या अलग करता/करती?' },
  { en: 'What am I attached to that is changing?', hi: 'मैं किस बदलती हुई चीज़ से आसक्त हूँ?' },
  { en: 'Whose wisdom guided me today?', hi: 'आज किसके ज्ञान ने मेरा मार्गदर्शन किया?' },
  { en: 'What did anger cost me this week?', hi: 'इस सप्ताह क्रोध ने मुझसे क्या छीना?' },
  { en: 'Where did I see the same Self in another?', hi: 'मैंने दूसरे में वही आत्मा कहाँ देखी?' },
  { en: 'What small discipline improved my day?', hi: 'किस छोटे अनुशासन ने मेरा दिन बेहतर बनाया?' },
];

/**
 * Daily reflection journal with autosave, local-save indicator,
 * date navigation, export, and delete options.
 */
export function DailyReflection() {
  const [entries, setEntries] = useLocalStorage<Record<string, string>>(
    'dharma.practice.reflections',
    {},
  );
  const [currentDate, setCurrentDate] = useState(localISODate());
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = localISODate();
  const dateInfo = formatDisplayDate(currentDate);

  // Derive prompt based on selected date's day of year
  const [y, m, d] = currentDate.split('-').map(Number);
  const selectedDateObj = new Date(y, m - 1, d);
  const prompt = PROMPTS[dayOfYear(selectedDateObj) % PROMPTS.length];

  const text = entries[currentDate] ?? '';
  const daysWritten = Object.keys(entries).filter((k) => (entries[k] ?? '').trim().length > 0).length;

  function handleTextChange(val: string) {
    setSaveStatus('saving');
    setEntries({ ...entries, [currentDate]: val });

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
    // Cannot go past today
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
      const lines = ['# Dharma Granth — Daily Spiritual Reflections (दैनिक चिंतन)\n'];
      const sortedKeys = Object.keys(entries).sort();
      for (const k of sortedKeys) {
        if (entries[k]?.trim()) {
          lines.push(`## ${k}\n${entries[k].trim()}\n`);
        }
      }
      const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dharma-reflections-${today}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {}
  }

  return (
    <ToolCard
      icon={<PenLine className="w-5 h-5 text-rose-600" />}
      title="Daily Reflection"
      titleHindi="दैनिक चिंतन"
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
            {text.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmDelete(!confirmDelete)}
                className="p-1.5 rounded-lg text-dharma-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                title="इस दिन का चिंतन हटाएं · Delete entry for this date"
                aria-label="Delete entry"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleExport}
              className="p-1.5 rounded-lg text-dharma-muted hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="चिंतन एक्सपोर्ट करें · Export reflections"
              aria-label="Export reflections as markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Warning */}
        {confirmDelete && (
          <div className="p-2.5 rounded-xl border border-rose-300 dark:border-rose-900/50 bg-rose-50/90 dark:bg-rose-950/30 text-xs flex items-center justify-between gap-2">
            <span className="text-rose-800 dark:text-rose-200 font-medium">
              क्या आप {dateInfo.hi} का चिंतन हटाना चाहते हैं?
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

        {/* Prompt */}
        <blockquote className="border-l-4 border-rose-300 pl-3">
          <p className="text-sm font-semibold text-dharma-text">{prompt.en}</p>
          <p lang="hi" className="font-devanagari text-xs text-dharma-muted mt-0.5">{prompt.hi}</p>
        </blockquote>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="यहाँ अपने विचार लिखें — यह आपके उपकरण पर ही सुरक्षित रहता है..."
          rows={5}
          className="w-full flex-1 text-sm bg-dharma-panel-muted rounded-xl border border-dharma-border focus:border-rose-300 outline-none p-3.5 text-dharma-text placeholder:text-dharma-muted resize-y font-devanagari leading-relaxed selection:bg-rose-200"
          aria-label={`Reflection for ${dateInfo.en}`}
        />

        {/* Footer with autosave indicator */}
        <div className="flex items-center justify-between text-xs text-dharma-muted">
          <span className="inline-flex items-center gap-1.5 font-medium">
            {saveStatus === 'saving' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>सहेजा जा रहा है... · Saving</span>
              </>
            ) : saveStatus === 'saved' || text.trim().length > 0 ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400">सहेजा गया · Saved on device</span>
              </>
            ) : (
              <span>लिखते ही स्वतः सहेजता है · Autosaves</span>
            )}
          </span>

          <span>{daysWritten} दिन लिखे गए</span>
        </div>
      </div>
    </ToolCard>
  );
}
