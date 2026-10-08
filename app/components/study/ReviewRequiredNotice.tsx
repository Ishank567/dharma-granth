/** Shown instead of an explanation when no reviewed material exists. The wording is fixed by the content policy. */
export const REVIEW_REQUIRED_TEXT =
  'Editorial review required. The available verified material is not sufficient for a reliable explanation.';

export function ReviewRequiredNotice({ className = '' }: { className?: string }) {
  return (
    <section aria-labelledby="rr-h" role="note" className={`rounded-2xl border border-amber-500/40 bg-amber-50/70 p-4 text-sm dark:bg-amber-950/20 ${className}`}>
      <h2 id="rr-h" className="sr-only">Explanation status</h2>
      <p className="font-semibold text-dharma-text">{REVIEW_REQUIRED_TEXT}</p>
      <p className="mt-1 text-dharma-muted">
        The original verse and the translation above are shown as recorded in the source. Nothing here has been written to fill the gap.
      </p>
    </section>
  );
}
