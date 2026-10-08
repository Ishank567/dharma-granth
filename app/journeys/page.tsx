import type { Metadata } from 'next';
import Link from 'next/link';
import { READING_JOURNEYS } from '@/data/reading-journeys';
import { REVIEW_LABEL } from '@/data/study-content';
import { JourneyProgressLine } from './JourneyProgress';

export const metadata: Metadata = {
  title: 'Reading Journeys · पठन यात्राएँ',
  description: 'Short guided readings through the Gita, one verse at a time, with context, a simple explanation and a reflection.',
  alternates: { canonical: '/journeys' },
};

export default function JourneysPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-dharma-text">Reading Journeys</h1>
      <p lang="hi" className="font-devanagari text-lg text-dharma-muted">पठन यात्राएँ</p>
      <p className="mt-3 text-sm text-dharma-muted">
        A journey is a short, ordered reading. Each lesson gives you one verse, its context, a plain explanation and a question to sit with.
        Progress is private to your browser. There are no scores or rankings, and a missed day is simply a quiet day.
      </p>
      <ul className="mt-6 space-y-4">
        {READING_JOURNEYS.map((j) => (
          <li key={j.id} className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
            <h2 className="font-serif text-xl font-bold text-dharma-text">
              <Link href={`/journeys/${j.id}`} className="hover:underline">{j.title}</Link>{' '}
              <span lang="hi" className="font-devanagari text-base font-normal text-dharma-muted">· {j.titleHi}</span>
            </h2>
            <p className="mt-1 text-sm text-dharma-muted">{j.objective}</p>
            <p className="mt-1 text-sm text-dharma-muted">
              {j.lessons.length} readings · about {j.minutesPerLesson} min each · {REVIEW_LABEL[j.review]}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <JourneyProgressLine journeyId={j.id} total={j.lessons.length} />
              <Link href={`/journeys/${j.id}`} className="focus-ring inline-flex min-h-[44px] items-center rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800">
                Open
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
