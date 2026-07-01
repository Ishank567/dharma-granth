import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { topics, topicCategories, type Topic } from '@/data/topics';

export const metadata: Metadata = {
  title: 'Modern-Life Application — Dharma Granth',
  description:
    'Discover how the Bhagavad Gita, Upanishads, and other Hindu scriptures speak to contemporary challenges — career, stress, relationships, parenting, social media, money, leadership, and more.',
};

export default function TopicsPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              जीवनयोग — Scripture for Modern Life
            </p>
            <h1 className="text-5xl font-serif font-bold mb-4">
              Modern-Life Application
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              The wisdom of the Gita, Upanishads, and Vedas is not confined to ancient battlefields or forest hermitages. Explore how timeless principles speak directly to the challenges you face today — at work, at home, and within.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Topics Grid ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        {topicCategories.map((cat) => {
          const catTopics = topics.filter((t) => t.category === cat.key);
          if (catTopics.length === 0) return null;

          return (
            <FadeUpOnView key={cat.key} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${cat.gradient}`} />
                <h2 className="text-lg font-serif font-bold text-dharma-text">{cat.label}</h2>
                <span className="text-sm text-dharma-muted">({catTopics.length})</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </FadeUpOnView>
          );
        })}

        {/* ── Disclaimer ─────────────────────────────────────────── */}
        <FadeUpOnView className="mt-12">
          <div className="rounded-2xl border border-dharma-border bg-dharma-card/60 p-6 text-center">
            <p className="text-sm text-dharma-muted leading-relaxed max-w-3xl mx-auto">
              These reflections offer philosophical perspectives from Hindu scriptures for contemplation and personal growth. They are not a substitute for professional mental health care, financial advice, or counseling. If you are struggling, please reach out to a qualified professional.
            </p>
          </div>
        </FadeUpOnView>
      </section>
    </main>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/topics/${topic.id}`}
      className="group relative overflow-hidden rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-xl hover:border-saffron-300 transition-all duration-300"
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${topic.gradient}`} />

      {/* Icon + Sanskrit */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.gradient} flex items-center justify-center text-2xl shadow-md`}>
          {topic.icon}
        </div>
        {topic.sanskrit && (
          <p lang="sa" className="font-devanagari text-lg text-saffron-600 opacity-80">
            {topic.sanskrit}
          </p>
        )}
      </div>

      {/* Title + Description */}
      <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition mb-2">
        {topic.title}
      </h3>
      <p className="text-sm text-dharma-muted leading-relaxed mb-4">
        {topic.shortDesc}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-dharma-muted">
        <span>{topic.verses.length} verses</span>
        <span className="font-semibold text-saffron-700 group-hover:translate-x-1 transition-transform">
          Explore →
        </span>
      </div>
    </Link>
  );
}
