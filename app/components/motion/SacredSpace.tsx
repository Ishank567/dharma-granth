'use client';

import { useEffect, useRef, useState, type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

type GranthProps = {
  title: string;
  subTitle: string;
  verseCount: string;
  href: string;
};

type ChakraProps = {
  size: number;
  interactive: boolean;
};

/**
 * Below-the-fold 3D codex and chakra. Their modules stay out of the first
 * load and never mount when the reader prefers reduced motion; a plain link
 * is the keyboard path either way.
 */
export function SacredSpace() {
  const sectionRef = useRef<HTMLElement>(null);
  const [Granth, setGranth] = useState<ComponentType<GranthProps> | null>(null);
  const [Chakra, setChakra] = useState<ComponentType<ChakraProps> | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || cancelled) return;
        observer.disconnect();
        void Promise.all([
          import('./Realistic3DGranth'),
          import('./SacredChakra3D'),
        ]).then(([granth, chakra]) => {
          if (cancelled) return;
          setGranth(() => granth.Realistic3DGranth);
          setChakra(() => chakra.SacredChakra3D);
        });
      },
      { rootMargin: '240px' },
    );
    observer.observe(section);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="sacred-space-heading"
      className="relative overflow-hidden border-b border-dharma-border bg-gradient-to-b from-dharma-card/60 via-amber-500/5 to-dharma-bg py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/20 bg-saffron-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Realistic 3D Experience · त्रिविमीय दर्शन
          </span>
          <h2 id="sacred-space-heading" className="mt-3 font-serif text-3xl font-bold text-dharma-text sm:text-4xl lg:text-5xl">
            Touch and Explore the Sacred
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-dharma-muted sm:text-lg">
            The Gita opens as a link. When motion is allowed, the codex and chakra load as you reach them — drag to spin, or use the arrow keys on the chakra.
          </p>
        </div>

        <div className="grid items-center justify-items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center">
            {Granth ? (
              <Granth
                title="श्रीमद्भगवद्गीता"
                subTitle="The Song of Eternal Truth"
                verseCount="७०० श्लोक · १८ अध्याय"
                href="/scripture/bhagavadgita"
              />
            ) : (
              <Link
                href="/scripture/bhagavadgita"
                className="block w-full max-w-sm overflow-hidden rounded-3xl border border-saffron-300/40 bg-dharma-card shadow-sm transition hover:border-saffron-400 hover:shadow-md"
              >
                <Image
                  src="/og/bhagavadgita.png"
                  alt="श्रीमद्भगवद्गीता — still of the codex, opens the Gita"
                  width={1200}
                  height={630}
                  className="aspect-[1200/630] w-full bg-saffron-100 object-cover"
                />
                <span lang="sa" className="block px-6 pt-4 font-devanagari text-xl font-bold text-saffron-800">
                  श्रीमद्भगवद्गीता
                </span>
                <span className="block px-6 pb-4 text-sm font-semibold text-saffron-700">गीता खोलें</span>
              </Link>
            )}
            <p className="mt-5 text-xs font-semibold text-dharma-muted">
              {Granth ? 'Move cursor or tilt phone to rotate in 3D · Click to open' : 'Opens the Bhagavad Gita'}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            {Chakra ? (
              <Chakra size={420} interactive />
            ) : (
              <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-full border border-dashed border-saffron-300/50 bg-saffron-500/5">
                <p className="max-w-[16rem] px-6 text-sm text-dharma-muted">
                  धर्मचक्र यहीं घूमता है जब गति चालू हो। तीर कुंजी से भी घुमाया जा सकता है।
                </p>
              </div>
            )}
            <p className="mt-5 text-xs font-semibold text-dharma-muted">
              3D Dharmachakra — drag, or focus it and use the arrow keys
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
