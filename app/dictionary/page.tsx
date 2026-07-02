import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { dictionary, termCategories, type DictionaryTerm } from '@/data/dictionary';

export const metadata: Metadata = {
  title: 'Terminology Dictionary — Dharma Granth',
  description:
    'A structured dictionary of fundamental Hindu terminology — Dharma, Ṛta, Satya, Ātman, Brahman, Īśvara, Jīva, Karma, Saṃsāra, Mokṣa, Śraddhā, Tapas, Vairāgya. Each term includes Sanskrit, etymology, cross-tradition interpretations, and related verses.',
};

export default function DictionaryPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-saffron-900 via-amber-800 to-orange-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              शब्दकोश — Hindu Terminology Dictionary
            </p>
            <h1 className="text-5xl font-serif font-bold mb-4">
              Terminology Dictionary
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              A structured reference for the foundational concepts of Hindu philosophy. Each term has a permanent identifier, Sanskrit etymology, cross-tradition interpretations, and related scriptural verses.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Terms Grid ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        {termCategories.map((cat) => {
          const catTerms = dictionary.filter((t) => t.category === cat.key);
          if (catTerms.length === 0) return null;

          return (
            <FadeUpOnView key={cat.key} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${cat.gradient}`} />
                <h2 className="text-lg font-serif font-bold text-dharma-text">{cat.label}</h2>
                <span lang="sa" className="font-devanagari text-sm text-saffron-600">{cat.sanskrit}</span>
                <span className="text-sm text-dharma-muted">({catTerms.length})</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTerms.map((term) => (
                  <TermCard key={term.id} term={term} />
                ))}
              </div>
            </FadeUpOnView>
          );
        })}
      </section>
    </main>
  );
}

function TermCard({ term }: { term: DictionaryTerm }) {
  return (
    <Link
      href={`/dictionary/${term.id}`}
      className="group relative overflow-hidden rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-xl hover:border-saffron-300 transition-all duration-300"
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${termCategories.find(c => c.key === term.category)?.gradient}`} />

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
            {term.term}
          </h3>
          <p lang="sa" className="font-devanagari text-base text-saffron-600">
            {term.sanskrit}
          </p>
        </div>
        <span className="text-xs text-dharma-muted italic mt-1">{term.transliteration}</span>
      </div>

      <p className="text-sm text-dharma-muted leading-relaxed mb-4">
        {term.shortDef}
      </p>

      <div className="flex items-center justify-between text-xs text-dharma-muted">
        <span>{term.crossTradition.length} traditions · {term.verses.length} verses</span>
        <span className="font-semibold text-saffron-700 group-hover:translate-x-1 transition-transform">
          Explore →
        </span>
      </div>
    </Link>
  );
}
