import type { BookExplanation } from '@/data/book-explanations';
import { FadeUpOnView } from '@/app/components/motion/primitives';

interface BookExplanationPanelProps {
  explanation: BookExplanation;
  title?: string;
}

export function BookExplanationPanel({ explanation, title = 'Book Explanation' }: BookExplanationPanelProps) {
  return (
    <section className="rounded-lg border border-dharma-border bg-white shadow-sm overflow-hidden">
      <FadeUpOnView className="grid md:grid-cols-2">
        <div className="p-6 border-b md:border-b-0 md:border-r border-dharma-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700 mb-3">
            {title}
          </p>
          <p className="text-sm leading-relaxed text-dharma-text mb-4">
            {explanation.overview.en}
          </p>
          <p className="text-sm leading-relaxed text-dharma-muted">
            {explanation.focus.en}
          </p>
        </div>
        <div className="p-6 bg-saffron-50/40" lang="hi">
          <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700 mb-3">
            हिन्दी व्याख्या
          </p>
          <p className="font-devanagari text-base leading-relaxed text-dharma-text mb-4">
            {explanation.overview.hi}
          </p>
          <p className="font-devanagari text-sm leading-relaxed text-dharma-muted">
            {explanation.focus.hi}
          </p>
        </div>
      </FadeUpOnView>
    </section>
  );
}
