import Link from 'next/link';
import { Archive, FileWarning, Languages, Lightbulb, Sparkles } from 'lucide-react';

/**
 * Status of what a verse page shows, computed from flags the data really
 * carries. A "reviewed" or "verified" badge is deliberately not offered: the
 * project records no human review yet, so claiming one would be false. When a
 * review process exists, add the badge here and drive it from recorded data.
 */
export function TrustBadges({
  sourceHost,
  translationIsAi,
  commentaryIsAi,
  hasEditorial,
  className = '',
}: {
  sourceHost?: string;
  translationIsAi: boolean;
  commentaryIsAi: boolean;
  hasEditorial: boolean;
  className?: string;
}) {
  const chip = 'inline-flex min-h-[28px] items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold';
  return (
    <section aria-label="Status of this page's content" className={className}>
      <h2 className="sr-only">Content status</h2>
      <ul className="flex flex-wrap gap-2">
        <li className={`${chip} border-dharma-border bg-dharma-card text-dharma-text`}>
          <Archive className="h-3.5 w-3.5" aria-hidden="true" />
          Source text · imported{sourceHost ? ` from ${sourceHost}` : ''}
        </li>
        <li
          className={`${chip} ${translationIsAi ? 'border-violet-500/40 bg-violet-50 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100' : 'border-dharma-border bg-dharma-card text-dharma-text'}`}
        >
          {translationIsAi ? <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> : <Languages className="h-3.5 w-3.5" aria-hidden="true" />}
          {translationIsAi ? 'Translation · AI-assisted, not human-reviewed' : 'Translation · from the source archive'}
        </li>
        {commentaryIsAi && (
          <li className={`${chip} border-violet-500/40 bg-violet-50 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100`}>
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Commentary · AI-assisted, not human-reviewed
          </li>
        )}
        {hasEditorial && (
          <li className={`${chip} border-stone-500/40 bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100`}>
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
            Editorial explanation · draft, awaiting scholarly review
          </li>
        )}
      </ul>
      <p className="mt-2 flex items-start gap-2 text-sm text-dharma-muted">
        <FileWarning className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          No independent human review is recorded for this verse yet.{' '}
          <Link href="/methodology" className="font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300">
            How this site is made
          </Link>
          .
        </span>
      </p>
    </section>
  );
}
