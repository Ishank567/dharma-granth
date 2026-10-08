import Link from 'next/link';
import { CONNECTIONS, CONNECTION_LABEL, REVIEW_LABEL, verseKey } from '@/data/study-content';

/**
 * Reviewed connections to other passages. Each states its type, its
 * reference, an editorial reason and its review status. Renders nothing when
 * a verse has no entries; it never guesses a link.
 */
export function RelatedTeachings({ scriptureId, chapterId, verseNumber }: { scriptureId: string; chapterId: number; verseNumber: number | string }) {
  const items = CONNECTIONS[verseKey(scriptureId, chapterId, verseNumber)];
  if (!items?.length) return null;
  return (
    <section aria-labelledby="rt-h" className="mt-8 rounded-2xl border border-dharma-border bg-dharma-card/60 p-5">
      <h2 id="rt-h" className="font-serif text-xl font-bold text-dharma-text">
        Related teachings <span lang="hi" className="font-devanagari text-base font-normal text-dharma-muted">· संबंधित उपदेश</span>
      </h2>
      <p className="mt-1 text-sm text-dharma-muted">Editorial links for study. A link does not claim that two passages teach exactly the same thing.</p>
      <ul className="mt-3 space-y-3">
        {items.map((c) => (
          <li key={c.scriptureTitle + c.reference} className="rounded-xl border border-dharma-border bg-dharma-card p-3 text-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-dharma-muted">{CONNECTION_LABEL[c.kind]}</p>
            <p className="mt-0.5 font-semibold text-dharma-text">
              {c.href ? (
                <Link href={c.href} className="inline-flex min-h-[44px] items-center text-saffron-800 underline underline-offset-2 dark:text-saffron-300">{c.scriptureTitle} {c.reference}</Link>
              ) : (
                <>{c.scriptureTitle} {c.reference}</>
              )}
            </p>
            <p className="mt-1 text-dharma-text">{c.summary}</p>
            <p className="mt-1 text-dharma-muted"><span className="font-semibold">Why linked:</span> {c.reason}</p>
            <p className="mt-1 text-sm text-dharma-muted">Review status: {REVIEW_LABEL[c.review]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
