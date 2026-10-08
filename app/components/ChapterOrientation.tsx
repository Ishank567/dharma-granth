import Link from 'next/link';
import { ArrowDown, ArrowRight, Clock } from 'lucide-react';
import { getChapterOrientation } from '@/data/chapter-orientation';
import { verseCount as fmtVerses } from '@/lib/format';

interface Props {
  scriptureId: string;
  chapterId: number;
  verseCount: number;
  firstVerseHref?: string;
}

/** About one minute per verse to read with the translation; study takes longer. */
function readingMinutes(verseCount: number): number {
  return Math.max(2, Math.round(verseCount * 0.75));
}

/**
 * Orientation before the verses. Facts about the chapter come from the library;
 * the narrative panel appears only where an editorial entry exists, and says so.
 */
export function ChapterOrientation({ scriptureId, chapterId, verseCount, firstVerseHref }: Props) {
  const o = getChapterOrientation(scriptureId, chapterId);
  if (!o) return null; // no invented introductions: only reviewed-or-draft editorial entries render
  const minutes = verseCount > 0 ? readingMinutes(verseCount) : null;

  return (
    <section aria-labelledby="orientation-h" className="mb-10 rounded-2xl border border-dharma-border bg-dharma-card p-5 sm:p-7">
      <h2 id="orientation-h" className="font-serif text-xl font-bold text-dharma-text">
        Before you begin <span lang="hi" className="font-devanagari text-base font-normal text-dharma-muted">· अध्याय परिचय</span>
      </h2>

      <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {o && (
          <>
            <div><dt className="font-semibold text-dharma-text">Chapter name</dt><dd className="text-dharma-muted">{o.nameEn} · <span lang="hi" className="font-devanagari">{o.nameHi}</span></dd></div>
            <div><dt className="font-semibold text-dharma-text">Who is speaking</dt><dd className="text-dharma-muted">{o.speakers}</dd></div>
            <div><dt className="font-semibold text-dharma-text">Who is listening</dt><dd className="text-dharma-muted">{o.listeners}</dd></div>
            <div><dt className="font-semibold text-dharma-text">Central question</dt><dd className="text-dharma-muted">{o.centralQuestion}</dd></div>
            <div><dt className="font-semibold text-dharma-text">Recommended background</dt><dd className="text-dharma-muted">{o.background}</dd></div>
          </>
        )}
        {verseCount > 0 && (
          <div>
            <dt className="font-semibold text-dharma-text">Length</dt>
            <dd className="inline-flex items-center gap-1 text-dharma-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {fmtVerses(verseCount)} · about {minutes} min to read, more to study
            </dd>
          </div>
        )}
      </dl>

      {o ? (
        <>
          <div className="mt-5">
            <h3 className="text-sm font-bold text-dharma-text">How the chapter unfolds</h3>
            {/* One ordered list serves as the diagram and the text alternative. */}
            <ol className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-1">
              {o.sequence.map((s, i) => (
                <li key={s.label} className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center">
                  <div className="flex-1 rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm">
                    <p className="font-semibold text-dharma-text">
                      {s.label} <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted">· {s.labelHi}</span>
                    </p>
                    <p className="mt-1 text-dharma-muted">{s.text}</p>
                  </div>
                  {i < o.sequence.length - 1 && (
                    <>
                      <ArrowDown className="mx-auto my-0.5 h-4 w-4 text-dharma-muted lg:hidden" aria-hidden="true" />
                      <ArrowRight className="mx-0.5 hidden h-4 w-4 shrink-0 text-dharma-muted lg:block" aria-hidden="true" />
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <h3 className="font-bold text-dharma-text">Main concepts</h3>
              <ul className="mt-1 flex flex-wrap gap-2">
                {o.concepts.map((c) => <li key={c} className="rounded-full border border-dharma-border px-3 py-1 text-dharma-muted">{c}</li>)}
              </ul>
              <h3 className="mt-4 font-bold text-dharma-text">Chapter structure</h3>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-dharma-muted">
                {o.structure.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-dharma-text">Important verses</h3>
              <ul className="mt-1 space-y-1">
                {o.importantVerses.map((v) => (
                  <li key={v.verse}>
                    <Link href={`/scripture/${scriptureId}/chapter/${chapterId}/verse/${v.verse}`} className="font-semibold text-saffron-800 underline underline-offset-2 hover:text-saffron-900 dark:text-saffron-300">
                      {chapterId}.{v.verse}
                    </Link>{' '}
                    <span className="text-dharma-muted">{v.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-dharma-bg px-3 py-2 text-sm text-dharma-muted">
            Editorial introduction, not scripture. Status: {o.review === 'approved' ? 'approved' : 'draft, awaiting editorial review'}.
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm text-dharma-muted">A reviewed narrative introduction for this chapter has not been prepared yet.</p>
      )}

      {firstVerseHref && (
        <Link href={firstVerseHref} className="focus-ring mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-saffron-700 px-6 text-sm font-semibold text-white hover:bg-saffron-800">
          Begin chapter <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
      <Link href={`/listen?s=${scriptureId}&c=${chapterId}`} className="focus-ring ml-3 mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-6 text-sm font-semibold text-dharma-text hover:border-saffron-400">
        Listen to chapter
      </Link>
    </section>
  );
}
