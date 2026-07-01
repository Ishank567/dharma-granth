import type { Metadata } from 'next';
import { ConceptGraph } from '@/app/components/ConceptGraph';
import { FadeUp } from '@/app/components/motion/primitives';
import { concepts } from '@/data/concepts';

export const metadata: Metadata = {
  title: 'Concept Knowledge Graph — Dharma Granth',
  description:
    'Explore the interconnected web of Vedic and Hindu philosophical concepts — Atman, Brahman, Karma, Dharma, Moksha, and more — in an interactive knowledge graph.',
};

export default function ConceptsPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              तत्त्वज्ञान — Interactive Knowledge Graph
            </p>
            <h1 className="text-5xl font-serif font-bold mb-4">
              Concept Knowledge Graph
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Explore the deep interconnections between {concepts.length} foundational concepts of Vedic and Hindu philosophy. Click any concept to discover its relationships, scriptural sources, and deeper meaning.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Graph ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        <div className="bg-dharma-card/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-dharma-border p-4 sm:p-6 md:p-8">
          <ConceptGraph />
        </div>
      </section>
    </main>
  );
}
