import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { ConceptGraph } from '@/app/components/ConceptGraph';
import { FadeUp } from '@/app/components/motion/primitives';
import { concepts } from '@/data/concepts';

export const metadata: Metadata = {
  title: 'अवधारणा ज्ञान ग्राफ (Concepts Knowledge Graph)',
  description:
    'वैदिक और हिंदू दर्शन की अवधारणाओं — आत्मन्, ब्रह्मन्, कर्म, धर्म, मोक्ष और अधिक — के अंतरसंबंधों का अन्वेषण करें।',
  alternates: { canonical: '/concepts' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'अवधारणा ज्ञान ग्राफ (Concepts Knowledge Graph) — Dharma Granth',
    description:
      'वैदिक और हिंदू दर्शन की अवधारणाओं — आत्मन्, ब्रह्मन्, कर्म, धर्म, मोक्ष और अधिक — के अंतरसंबंधों का अन्वेषण करें।',
    url: 'https://dharmagranth.in/concepts',
  },
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
              तत्त्वमीमांसा — ज्ञान ग्राफ (Knowledge Graph)
            </p>
            <h1 className="text-5xl font-serif font-bold mb-4">
              अवधारणा ज्ञान ग्राफ (Concept Knowledge Graph)
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              वैदिक और हिंदू दर्शन की {concepts.length} मूल अवधारणाओं के गहरे अंतरसंबंधों का अन्वेषण करें। किसी भी अवधारणा पर क्लिक कर उसके संबंधों, ग्रंथ स्रोतों और गहरे अर्थ को जानें।
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Graph ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-16">
        <div className="bg-dharma-card/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-dharma-border p-4 sm:p-6 md:p-8">
          <ConceptGraph />
        </div>
      </section>

      {/* ── 12 Core Concepts Encyclopedia Directory ──────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-dharma-border pt-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400 mb-2">
            शास्त्रीय तत्त्वकोश · Philosophical Encyclopedia
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-dharma-text mb-4">
            12 मूल अवधारणाएँ (12 Core Concepts)
          </h2>
          <p className="text-dharma-muted text-base leading-relaxed">
            प्रत्येक अवधारणा का प्रामाणिक संस्कृत व्युत्पत्ति, वैदिक-वेदान्तिक संदर्भ, मूल श्लोक, विभिन्न दर्शनों की दृष्टि और आधुनिक भ्रांतियों का शास्त्रीय समाधान।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {concepts.map((c) => (
            <div
              key={c.id}
              className="group rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm hover:shadow-md hover:border-saffron-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-400 transition-colors flex items-baseline gap-2">
                      <span lang="sa" className="font-devanagari text-2xl text-saffron-600 dark:text-saffron-400">
                        {c.sanskrit}
                      </span>
                      <span className="font-serif text-lg font-semibold">{c.label}</span>
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 border border-saffron-500/20">
                    {c.category}
                  </span>
                </div>
                <p className="text-sm text-dharma-muted leading-relaxed line-clamp-3 mb-4">
                  {c.description}
                </p>
              </div>

              <div className="pt-4 border-t border-dharma-border/60 flex items-center justify-between">
                <span className="text-xs text-dharma-muted font-medium">
                  {c.scriptureRefs?.slice(0, 2).join(', ')}
                </span>
                <a
                  href={`/concepts/${c.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 dark:text-saffron-400 group-hover:underline min-h-[44px]"
                >
                  <span>गहन विश्लेषण</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
