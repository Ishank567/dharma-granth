import type { Metadata } from 'next';
import { ConceptGraph } from '@/app/components/ConceptGraph';
import { FadeUp } from '@/app/components/motion/primitives';
import { concepts } from '@/data/concepts';

export const metadata: Metadata = {
  title: 'अवधारणा ज्ञान ग्राफ — Dharma Granth',
  description:
    'वैदिक और हिंदू दर्शन की अवधारणाओं — आत्मन्, ब्रह्मन्, कर्म, धर्म, मोक्ष और अधिक — के अंतरसंबंधों का अन्वेषण करें।',
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
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        <div className="bg-dharma-card/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-dharma-border p-4 sm:p-6 md:p-8">
          <ConceptGraph />
        </div>
      </section>
    </main>
  );
}
