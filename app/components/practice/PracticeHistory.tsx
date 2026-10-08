'use client';

import { useState } from 'react';
import {
  History,
  Calendar,
  Sparkles,
  CircleDot,
  Timer,
  PenLine,
  HeartHandshake,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { ToolCard, formatDisplayDate } from './shared';
import { triggerHaptic } from '@/lib/haptics';

interface JapaState {
  date: string;
  count: number;
  rounds: number;
  lifetimeRounds: number;
  mantra: string;
}

interface MeditationStats {
  sessions: number;
  minutes: number;
  history?: Record<string, number>;
}

/**
 * Peaceful, non-judgmental practice history.
 * Displays days when contemplative practice occurred, with details for
 * japa, meditation, reflections, and gratitude — allowing review and
 * deletion of individual daily records.
 */
function localMonthPrefix(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function PracticeHistory() {
  const [japa] = useLocalStorage<JapaState>('dharma.practice.japa', {
    date: '',
    count: 0,
    rounds: 0,
    lifetimeRounds: 0,
    mantra: '',
  });
  const [meditation, setMeditation] = useLocalStorage<MeditationStats>(
    'dharma.practice.meditation',
    { sessions: 0, minutes: 0 },
  );
  const [reflections, setReflections] = useLocalStorage<Record<string, string>>(
    'dharma.practice.reflections',
    {},
  );
  const [gratitude, setGratitude] = useLocalStorage<Record<string, string[]>>(
    'dharma.practice.gratitude',
    {},
  );

  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Collect all unique dates with activity
  const datesSet = new Set<string>();
  if (japa.date) datesSet.add(japa.date);
  if (meditation.history) {
    Object.keys(meditation.history).forEach((d) => datesSet.add(d));
  }
  Object.keys(reflections).forEach((d) => {
    if (reflections[d]?.trim()) datesSet.add(d);
  });
  Object.keys(gratitude).forEach((d) => {
    if (gratitude[d]?.some((g) => g.trim().length > 0)) datesSet.add(d);
  });

  const sortedDates = Array.from(datesSet).sort().reverse();
  const monthPrefix = localMonthPrefix();
  const daysThisMonth = sortedDates.filter((d) => d.startsWith(monthPrefix)).length;

  function toggleExpand(date: string) {
    triggerHaptic('light');
    setExpandedDate(expandedDate === date ? null : date);
  }

  function deleteReflection(date: string) {
    triggerHaptic('medium');
    const next = { ...reflections };
    delete next[date];
    setReflections(next);
  }

  function deleteGratitude(date: string) {
    triggerHaptic('medium');
    const next = { ...gratitude };
    delete next[date];
    setGratitude(next);
  }

  function deleteMeditation(date: string) {
    triggerHaptic('medium');
    if (meditation.history && meditation.history[date]) {
      const mins = meditation.history[date];
      const nextHist = { ...meditation.history };
      delete nextHist[date];
      setMeditation({
        sessions: Math.max(0, meditation.sessions - 1),
        minutes: Math.max(0, meditation.minutes - mins),
        history: nextHist,
      });
    }
  }

  return (
    <ToolCard
      icon={<History className="w-5 h-5 text-amber-700" />}
      title="Practice History"
      titleHindi="साधना इतिहास"
      accent="amber"
    >
      <div className="flex flex-col gap-3 h-full">
        <p className="text-xs text-dharma-muted">
          यहाँ आपके अभ्यास की शांत स्मृति है। कोई अंक, प्रतिस्पर्धा या छूटे हुए दिनों की ग्लानि नहीं — केवल आत्मानुसंधान।
        </p>

        {daysThisMonth > 0 && (
          <p role="status" className="text-sm font-medium text-dharma-text">
            You practised on {daysThisMonth} {daysThisMonth === 1 ? 'day' : 'days'} this month.
          </p>
        )}

        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-dharma-muted">
            <Calendar className="w-8 h-8 opacity-40 mb-2" />
            <p className="text-sm font-medium">अभी कोई इतिहास दर्ज नहीं है</p>
            <p className="text-xs opacity-75 mt-0.5">जब आप जप, ध्यान या चिंतन करेंगे, वह यहाँ सहेजा जाएगा।</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {sortedDates.map((date) => {
              const dateInfo = formatDisplayDate(date);
              const isExpanded = expandedDate === date;
              const medMins = meditation.history?.[date];
              const isJapaToday = japa.date === date && (japa.rounds > 0 || japa.count > 0);
              const refText = reflections[date]?.trim();
              const gratEntries = (gratitude[date] ?? []).filter((g) => g.trim().length > 0);

              return (
                <div
                  key={date}
                  className="rounded-xl border border-dharma-border bg-dharma-panel-muted/50 overflow-hidden transition"
                >
                  {/* Row summary header */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(date)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-dharma-text font-devanagari">
                        {dateInfo.hi}
                      </span>
                      <span className="text-[11px] text-dharma-muted font-normal">
                        ({dateInfo.en})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Chips */}
                      <div className="flex items-center gap-1.5 text-[11px] text-dharma-muted">
                        {isJapaToday && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-950/40 text-saffron-800 dark:text-saffron-300 font-semibold">
                            <CircleDot className="w-3 h-3" /> {japa.rounds} माला
                          </span>
                        )}
                        {medMins && medMins > 0 && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 font-semibold">
                            <Timer className="w-3 h-3" /> {medMins} मि.
                          </span>
                        )}
                        {refText && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold">
                            <PenLine className="w-3 h-3" /> चिंतन
                          </span>
                        )}
                        {gratEntries.length > 0 && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold">
                            <HeartHandshake className="w-3 h-3" /> कृतज्ञता
                          </span>
                        )}
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-dharma-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-dharma-muted" />
                      )}
                    </div>
                  </button>

                  {/* Expanded daily details */}
                  {isExpanded && (
                    <div className="p-3 pt-0 border-t border-dharma-border/60 text-xs space-y-3 mt-2">
                      {/* Meditation details */}
                      {medMins && medMins > 0 && (
                        <div className="flex items-start justify-between gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                          <div>
                            <span className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                              <Timer className="w-3.5 h-3.5" /> ध्यान: {medMins} मिनट
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteMeditation(date)}
                            className="text-dharma-muted hover:text-rose-600 transition"
                            title="ध्यान रिकॉर्ड हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Reflection details */}
                      {refText && (
                        <div className="bg-rose-50/50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/30 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                              <PenLine className="w-3.5 h-3.5" /> दैनिक चिंतन
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteReflection(date)}
                              className="text-dharma-muted hover:text-rose-600 transition"
                              title="चिंतन हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-dharma-text font-devanagari whitespace-pre-line leading-relaxed">
                            {refText}
                          </p>
                        </div>
                      )}

                      {/* Gratitude details */}
                      {gratEntries.length > 0 && (
                        <div className="bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/30 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                              <HeartHandshake className="w-3.5 h-3.5" /> कृतज्ञता के क्षण
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteGratitude(date)}
                              className="text-dharma-muted hover:text-rose-600 transition"
                              title="कृतज्ञता हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <ul className="list-disc list-inside space-y-0.5 text-dharma-text font-devanagari">
                            {gratEntries.map((g, i) => (
                              <li key={i}>{g}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ToolCard>
  );
}
