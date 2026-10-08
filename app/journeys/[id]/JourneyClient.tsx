'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { REVIEW_LABEL } from '@/data/study-content';
import type { JourneyLesson, ReadingJourney } from '@/data/reading-journeys';
import { cleanVerseField, verseLines } from '@/lib/verse-format';
import { useJourneyProgress } from '../JourneyProgress';

export interface LessonView extends JourneyLesson {
  reference: string;
  href: string;
  sanskrit: string;
  translation: string;
  translationIsAi: boolean;
}

export function JourneyClient({ journey, lessons }: { journey: ReadingJourney; lessons: LessonView[] }) {
  const { progress, ready, toggle, reset } = useJourneyProgress();
  const done = progress[journey.id] ?? [];
  const next = lessons.find((l) => !done.includes(l.id));

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/journeys" className="text-sm text-dharma-muted underline underline-offset-2">All journeys</Link>
      <h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text">{journey.title}</h1>
      <p lang="hi" className="font-devanagari text-lg text-dharma-muted">{journey.titleHi}</p>

      <dl className="mt-4 grid gap-x-6 gap-y-2 rounded-2xl border border-dharma-border bg-dharma-card p-4 text-sm sm:grid-cols-2">
        <div><dt className="font-semibold text-dharma-text">Objective</dt><dd className="text-dharma-muted">{journey.objective}</dd></div>
        <div><dt className="font-semibold text-dharma-text">Intended audience</dt><dd className="text-dharma-muted">{journey.audience}</dd></div>
        <div><dt className="font-semibold text-dharma-text">Duration</dt><dd className="text-dharma-muted">{lessons.length} readings, about {journey.minutesPerLesson} min each</dd></div>
        <div><dt className="font-semibold text-dharma-text">Curator</dt><dd className="text-dharma-muted">{journey.curator}</dd></div>
        <div><dt className="font-semibold text-dharma-text">Last reviewed</dt><dd className="text-dharma-muted">{journey.reviewedOn ?? 'Not yet reviewed'} · {REVIEW_LABEL[journey.review]}</dd></div>
      </dl>

      <p role="status" className="mt-4 text-sm font-medium text-dharma-text">
        {!ready ? ' ' : done.length === 0 ? 'Begin whenever you like.' : done.length >= lessons.length ? `You have read all ${lessons.length} verses. Return to any of them at any time.` : `You have completed ${done.length} of ${lessons.length} readings.`}
      </p>
      {next && ready && done.length > 0 && (
        <p className="text-sm text-dharma-muted">Continue with <a className="underline underline-offset-2" href={`#${next.id}`}>{next.reference}</a>.</p>
      )}

      <ol className="mt-6 space-y-6">
        {lessons.map((l, i) => {
          const isDone = done.includes(l.id);
          return (
            <li key={l.id} id={l.id} className="scroll-mt-20 rounded-2xl border border-dharma-border bg-dharma-card p-5">
              <h2 className="font-serif text-lg font-bold text-dharma-text">
                Reading {i + 1} of {lessons.length} · <Link href={l.href} className="text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{l.reference}</Link>
              </h2>

              {l.sanskrit ? (
                <figure className="mt-3 rounded-xl border-2 border-amber-700/35 bg-amber-50/70 p-4 dark:border-amber-500/30 dark:bg-amber-950/25">
                  <figcaption className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">Original scripture</figcaption>
                  <p lang="sa" className="text-center font-devanagari text-2xl font-semibold leading-[2.05] text-dharma-text">
                    {verseLines(cleanVerseField(l.sanskrit)).map((line, k) => <span key={k} className="block">{line}</span>)}
                  </p>
                  {l.translation && (
                    <p lang="en" className="mt-2 border-t border-amber-700/20 pt-2 font-serif text-dharma-text">
                      <span className="mr-2 text-xs font-bold uppercase tracking-wide text-dharma-muted">Literal translation{l.translationIsAi ? ' (AI translation, not a scholarly edition)' : ''}</span>
                      {cleanVerseField(l.translation)}
                    </p>
                  )}
                </figure>
              ) : (
                <p className="mt-3 text-sm text-dharma-muted">The verse text could not be loaded here; open the verse page.</p>
              )}

              <div className="mt-3 space-y-3 text-sm">
                <section aria-label="Context"><h3 className="font-semibold text-dharma-text">Context</h3><p className="text-dharma-muted">{l.context}</p></section>
                <section aria-label="Simple explanation" className="border-l-4 border-sky-600 pl-3"><h3 className="font-semibold text-dharma-text">Simple explanation <span className="text-xs font-normal text-dharma-muted">(editorial, not scripture)</span></h3><p>{l.explanation}</p></section>
                <section aria-label="Reflection"><h3 className="font-semibold text-dharma-text">Pause and think</h3><p>{l.reflection}</p></section>
                {l.activity && <section aria-label="Optional activity"><h3 className="font-semibold text-dharma-text">Optional activity</h3><p className="text-dharma-muted">{l.activity}</p></section>}
              </div>

              <button
                type="button"
                onClick={() => toggle(journey.id, l.id)}
                aria-pressed={isDone}
                className={`focus-ring mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 text-sm font-semibold ${isDone ? 'border-emerald-700 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100' : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'}`}
              >
                {isDone && <Check className="h-4 w-4" aria-hidden="true" />}
                {isDone ? 'Read' : 'Mark as read'}
              </button>
            </li>
          );
        })}
      </ol>

      <section aria-labelledby="jr-rel" className="mt-8 text-sm">
        <h2 id="jr-rel" className="font-serif text-lg font-bold text-dharma-text">Related reading</h2>
        <ul className="mt-1 list-disc pl-5">
          {journey.related.map((r) => <li key={r.href}><Link href={r.href} className="text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{r.label}</Link></li>)}
        </ul>
        <h2 className="mt-5 font-serif text-lg font-bold text-dharma-text">Sources</h2>
        <ul className="mt-1 list-disc pl-5 text-dharma-muted">{journey.sources.map((s) => <li key={s}>{s}</li>)}</ul>
        {done.length > 0 && (
          <button type="button" onClick={() => reset(journey.id)} className="focus-ring mt-5 min-h-[44px] rounded-xl border border-dharma-border px-4 font-semibold text-dharma-text hover:border-rose-400">
            Start this journey again
          </button>
        )}
      </section>
    </main>
  );
}
