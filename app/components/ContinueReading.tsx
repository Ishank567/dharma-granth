'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, History, X } from 'lucide-react';
import { forgetScripture, useRecentChapters, type ChapterVisit } from '@/lib/reading-history';

function chapterHref(v: ChapterVisit, chapterId = v.chapterId): string {
  return `/scripture/${v.scriptureId}/chapter/${chapterId}`;
}

function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (!Number.isFinite(minutes) || minutes < 1) return 'अभी';
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} घंटे पहले`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'कल' : `${days} दिन पहले`;
}

/** Home-page "continue reading" strip; renders nothing for first-time visitors. */
export function ContinueReading() {
  const visits = useRecentChapters();
  if (!visits || visits.length === 0) return null;

  const [latest, ...others] = visits;
  const total = Math.max(latest.totalChapters, latest.chapterId);
  const percent = Math.round((latest.chapterId / total) * 100);
  const hasNext = latest.chapterId < total;

  return (
    <section
      aria-labelledby="continue-reading-heading"
      className="border-b border-dharma-border bg-dharma-card/60 py-8"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <h2
          id="continue-reading-heading"
          className="mb-4 flex items-center gap-2 text-xs font-bold text-saffron-700"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          {/* Letter-spacing on the Latin half only; it breaks Devanagari. */}
          पढ़ना जारी रखें ·{' '}
          <span className="uppercase tracking-[0.2em]">Continue reading</span>
        </h2>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <article className="relative rounded-2xl border border-saffron-200 bg-dharma-card p-5 shadow-sm sm:p-6">
            <button
              type="button"
              onClick={() => forgetScripture(latest.scriptureId)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-dharma-muted transition hover:bg-dharma-bg hover:text-dharma-text"
              aria-label={`${latest.scriptureTitle} को इतिहास से हटाएँ (Remove from history)`}
            >
              <X className="h-4 w-4" />
            </button>
            <p className="pr-8 text-sm font-semibold text-dharma-muted">
              {latest.scriptureTitle}
              {latest.scriptureTitleSanskrit && (
                <span lang="sa" className="ml-2 font-devanagari">
                  {latest.scriptureTitleSanskrit}
                </span>
              )}
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold text-dharma-text">
              {latest.chapterTitle}
            </h3>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-dharma-muted">
                <span>
                  अध्याय {latest.chapterId} / {total}
                </span>
                <span>{timeAgo(latest.readAt)}</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-saffron-500/15"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={latest.chapterId}
                aria-label={`अध्याय ${latest.chapterId} / ${total}`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-saffron-500 to-amber-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`${chapterHref(latest)}${latest.verseId ? `#verse-${latest.verseId}` : ''}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {latest.verseId ? `श्लोक ${latest.verseId} से जारी रखें` : 'जारी रखें'}
              </Link>
              {hasNext && (
                <Link
                  href={chapterHref(latest, latest.chapterId + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-dharma-border px-5 py-2.5 text-sm font-semibold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700"
                >
                  अगला अध्याय {latest.chapterId + 1}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </article>

          {others.length > 0 && (
            <ul className="grid content-start gap-2" aria-label="अन्य हाल के ग्रंथ (Other recent texts)">
              {others.slice(0, 3).map((v) => (
                <li key={v.scriptureId}>
                  <Link
                    href={`${chapterHref(v)}${v.verseId ? `#verse-${v.verseId}` : ''}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-dharma-border bg-dharma-card px-4 py-3 transition hover:border-saffron-300"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-dharma-text group-hover:text-saffron-700">
                        {v.scriptureTitle}
                      </span>
                      <span className="block truncate text-xs text-dharma-muted">
                        अध्याय {v.chapterId} · {v.chapterTitle}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-dharma-muted transition group-hover:translate-x-0.5 group-hover:text-saffron-600"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
