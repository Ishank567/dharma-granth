import Link from 'next/link';
import { getPilotGuide } from '@/data/pilot-ch2-context';

const label = 'rounded-full border px-2 py-0.5 text-sm font-semibold';

function status(g: NonNullable<ReturnType<typeof getPilotGuide>>) {
  return g.review === 'approved' && g.reviewer && g.reviewDate
    ? `Reviewed by ${g.reviewer}, ${g.reviewDate}`
    : g.review === 'editorial-review'
      ? 'In editorial review'
      : 'Draft, not reviewed';
}

/** Context panel and common-misunderstanding card for the Chapter 2 pilot verses. Renders nothing elsewhere. */
export function PilotVerseGuide({ scriptureId, chapter, verse }: { scriptureId: string; chapter: number; verse: number | string }) {
  const g = getPilotGuide(scriptureId, chapter, verse);
  if (!g) return null;
  const chapterHref = `/scripture/${g.scriptureId}/chapter/${g.chapter}`;
  const steps = [
    { id: 'before', title: 'Before this verse', text: g.before },
    { id: 'this', title: 'This verse', text: g.thisVerse },
    { id: 'after', title: 'After this verse', text: g.after },
  ];
  return (
    <>
      <section aria-labelledby="ctx-h" className="mt-8 rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="ctx-h" className="font-serif text-lg font-bold text-dharma-text">Context</h2>
          <span className={`${label} border-sky-600/40 bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100`}>Editorial content</span>
          <span className={`${label} border-dharma-border text-dharma-muted`}>{status(g)}</span>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="font-semibold text-dharma-muted">Speaker</dt><dd className="text-dharma-text">{g.speaker}</dd>
          <dt className="font-semibold text-dharma-muted">Listener</dt><dd className="text-dharma-text">{g.listener}</dd>
          <dt className="font-semibold text-dharma-muted">Central question</dt><dd className="text-dharma-text">{g.centralQuestion}</dd>
        </dl>
        <ol className="mt-4 space-y-3">
          {steps.map((s) => (
            <li key={s.id} className="rounded-xl border border-dharma-border bg-dharma-bg/60 p-3 text-sm">
              <h3 className="font-sans text-base font-semibold text-dharma-text">{s.title}</h3>
              <p className="mt-1 text-dharma-muted">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm">
          <Link href={chapterHref} className="focus-ring inline-flex min-h-[44px] items-center font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
            Read the full passage: verses {g.chapter}.{g.passage.from} to {g.chapter}.{g.passage.to}
          </Link>
        </p>
      </section>

      <section aria-labelledby="mis-h" className="mt-6 rounded-2xl border border-amber-600/30 bg-amber-50/60 p-4 dark:border-amber-500/25 dark:bg-amber-950/20 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="mis-h" className="font-serif text-lg font-bold text-dharma-text">A common misunderstanding</h2>
          <span className={`${label} border-sky-600/40 bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100`}>Editorial content</span>
          <span className={`${label} border-dharma-border text-dharma-muted`}>{status(g)}</span>
        </div>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-dharma-text">Commonly read as</dt>
            <dd className="mt-1 text-dharma-muted">&ldquo;{g.misunderstanding.common}&rdquo;</dd>
          </div>
          <div>
            <dt className="font-semibold text-dharma-text">A more careful understanding</dt>
            <dd className="mt-1 text-dharma-text">{g.misunderstanding.careful}</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm">
          <Link href={chapterHref} className="focus-ring inline-flex min-h-[44px] items-center font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
            See the complete passage
          </Link>
        </p>
      </section>
    </>
  );
}
