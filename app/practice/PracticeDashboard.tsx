'use client';

import { Lock, Settings2 } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { FadeUp } from '@/app/components/motion/primitives';
import { DailyVerse } from '@/app/components/DailyVerse';
import { DailyReflection } from '@/app/components/practice/DailyReflection';
import { ReadingPlan } from '@/app/components/practice/ReadingPlan';
import { JapaCounter } from '@/app/components/practice/JapaCounter';
import { MeditationTimer } from '@/app/components/practice/MeditationTimer';
import { FestivalReminder } from '@/app/components/practice/FestivalReminder';
import { SankalpaJournal } from '@/app/components/practice/SankalpaJournal';
import { GratitudeJournal } from '@/app/components/practice/GratitudeJournal';

/**
 * The daily practice (sādhanā) dashboard.
 *
 * Design commitments, deliberately:
 * - Every tool is optional — users pick which ones appear, and the choice
 *   is itself stored locally.
 * - Everything is private: localStorage only, no accounts, no sync, and no
 *   public or competitive surfaces (no leaderboards, no shared streaks).
 *   Spiritual practice is not a contest.
 */

const TOOLS = [
  { id: 'verse', label: 'दैनिक श्लोक', sub: 'Daily verse' },
  { id: 'reflection', label: 'दैनिक चिंतन', sub: 'Reflection' },
  { id: 'reading', label: 'पठन योजना', sub: 'Reading plan' },
  { id: 'japa', label: 'जप माला', sub: 'Japa counter' },
  { id: 'meditation', label: 'ध्यान', sub: 'Meditation timer' },
  { id: 'festivals', label: 'उत्सव स्मरण', sub: 'Festival reminders' },
  { id: 'sankalpa', label: 'संकल्प', sub: 'Saṅkalpa journal' },
  { id: 'gratitude', label: 'कृतज्ञता', sub: 'Gratitude journal' },
] as const;

type ToolId = (typeof TOOLS)[number]['id'];

const ALL_ON: Record<ToolId, boolean> = {
  verse: true,
  reflection: true,
  reading: true,
  japa: true,
  meditation: true,
  festivals: true,
  sankalpa: true,
  gratitude: true,
};

export function PracticeDashboard() {
  const [enabled, setEnabled] = useLocalStorage<Record<ToolId, boolean>>(
    'dharma.practice.tools',
    ALL_ON,
  );

  function toggle(id: ToolId) {
    setEnabled({ ...enabled, [id]: !enabled[id] });
  }

  const on = (id: ToolId) => enabled[id] !== false;

  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* Header */}
      <section className="bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-widest text-saffron-200 mb-2">
              साधना · Daily Practice
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">Your practice, your pace</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              A quiet set of tools for daily sādhanā — a verse, a reflection, japa, meditation, and
              journals.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm bg-white/10 border border-white/20 rounded-full px-4 py-2">
              <Lock className="w-4 h-4" />
              Fully private — everything stays in this browser. No accounts, no sharing, no rankings.
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Tool picker */}
        <section aria-label="Choose your tools">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-dharma-muted mb-3">
            <Settings2 className="w-3.5 h-3.5" />
            अपने साधन चुनें · choose your tools
          </p>
          <div className="flex flex-wrap gap-2">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggle(t.id)}
                aria-pressed={on(t.id)}
                className={`practice-tool-chip px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                  on(t.id)
                    ? 'practice-tool-chip-on bg-saffron-100 border-saffron-300 text-saffron-800'
                    : 'border-dharma-border text-dharma-muted hover:border-saffron-200'
                }`}
              >
                <span className="font-devanagari">{t.label}</span>
                <span className="opacity-70"> · {t.sub}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Daily verse — full width */}
        {on('verse') && <DailyVerse />}

        {/* Tool grid */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {on('reflection') && <DailyReflection />}
          {on('japa') && <JapaCounter />}
          {on('meditation') && <MeditationTimer />}
          {on('reading') && <ReadingPlan />}
          {on('festivals') && <FestivalReminder />}
          {on('gratitude') && <GratitudeJournal />}
          {on('sankalpa') && <SankalpaJournal />}
        </div>

        <p className="text-center text-xs text-dharma-muted pb-4">
          साधना निजी है — this page keeps no score and shares nothing. Clearing your browser data
          erases it completely.
        </p>
      </div>
    </main>
  );
}
