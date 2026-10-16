import Link from 'next/link';
import { HeartHandshake, ArrowRight } from 'lucide-react';
import type { WisdomTopicLink } from '@/lib/wisdom-verse-topics';

/** "Appears in Wisdom for Life" links for a verse page. Server-rendered, no client JS. */
export function WisdomTopicLinks({ topics }: { topics: WisdomTopicLink[] }) {
  if (topics.length === 0) return null;
  return (
    <section className="mt-10" aria-labelledby="wisdom-topic-links">
      <h2 id="wisdom-topic-links" className="flex items-center gap-2 font-serif text-xl font-bold text-dharma-text">
        <HeartHandshake className="h-5 w-5 text-saffron-600" aria-hidden="true" />
        <span>जीवन-मार्गदर्शन में यह श्लोक (Appears in Wisdom for Life)</span>
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {topics.map((t) => (
          <li key={t.slug}>
            <Link
              href={t.href}
              className="group flex min-h-[44px] items-center justify-between gap-3 rounded-2xl border border-dharma-border bg-dharma-card p-4 transition hover:border-saffron-300 hover:shadow-md"
            >
              <span>
                <span className="block font-devanagari font-semibold text-dharma-text group-hover:text-saffron-700">{t.titleHi}</span>
                <span className="block text-sm text-dharma-muted">{t.titleEn}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-saffron-700" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
