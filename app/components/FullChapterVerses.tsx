'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Feather, Languages, ScrollText, Sun } from 'lucide-react';

interface FullVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  wordMeaning?: string;
}

interface FullChapter {
  number: number;
  title?: string;
  titleSanskrit?: string;
  verses: FullVerse[];
}

interface FullScripture {
  id: string;
  source?: { repo?: string; fetchedAt?: string };
  chapters: FullChapter[];
}

interface Props {
  scriptureId: string;
  chapterId: number;
  curatedVerseIds: Set<number | string>;
  basePath?: string;
  /**
   * Skip the "Load full chapter text" button and fetch immediately. Used on
   * placeholder chapters where the curated `.ts` has no verses — there's
   * nothing else on the page so prompting for a click is wasted friction.
   */
  autoLoad?: boolean;
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ready'; verses: FullVerse[]; source?: FullScripture['source'] }
  | { kind: 'empty' }
  | { kind: 'error'; message: string };

export function FullChapterVerses({ scriptureId, chapterId, curatedVerseIds, basePath = '', autoLoad = false }: Props) {
  const [state, setState] = useState<State>({ kind: autoLoad ? 'loading' : 'idle' });

  useEffect(() => {
    if (state.kind !== 'loading') return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${basePath}/data/scriptures-full/${scriptureId}.json`, {
          cache: 'force-cache',
        });
        if (!res.ok) {
          if (!cancelled) setState({ kind: 'empty' });
          return;
        }
        const data: FullScripture = await res.json();
        const chapter = data.chapters.find((c) => c.number === chapterId);
        if (!chapter || chapter.verses.length === 0) {
          if (!cancelled) setState({ kind: 'empty' });
          return;
        }
        const extras = chapter.verses.filter((v) => !curatedVerseIds.has(v.number));
        if (!cancelled) {
          setState({ kind: 'ready', verses: extras, source: data.source });
        }
      } catch (err) {
        if (!cancelled) setState({ kind: 'error', message: (err as Error).message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.kind, scriptureId, chapterId, curatedVerseIds, basePath]);

  if (state.kind === 'idle') {
    return (
      <div className="mt-14 rounded-2xl border border-dashed border-saffron-300 bg-saffron-50/40 p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-saffron-100 text-saffron-700 mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif font-bold text-dharma-text mb-1">पूरा अध्याय पढ़ें</h3>
        <p className="text-sm text-dharma-muted max-w-md mx-auto mb-4">
          ऊपर मुख्य श्लोक उनकी पूर्ण व्याख्या सहित दिए गए हैं। शेष श्लोकों का मूल पाठ मुक्त-स्रोत संग्रह से लोड किया जा सकता है।
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: 'loading' })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-semibold transition"
        >
          पूरा अध्याय लोड करें
        </button>
      </div>
    );
  }

  if (state.kind === 'loading') {
    return (
      <div className="mt-14 rounded-2xl border border-dharma-border bg-white p-6 text-center text-sm text-dharma-muted">
        अध्याय लोड हो रहा है…
      </div>
    );
  }

  if (state.kind === 'empty') {
    return (
      <div className="mt-14 rounded-2xl border border-dashed border-dharma-border bg-white p-6 text-center text-sm text-dharma-muted">
        इस ग्रंथ का पूर्ण-पाठ अभी तैयार नहीं हुआ है। पूर्ण पाठ संग्रहीत करने के लिए{' '}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100">npm run seed:all</code> चलाएँ ताकि{' '}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100">public/data/scriptures-full/</code> भर जाए।
      </div>
    );
  }

  if (state.kind === 'error') {
    return (
      <div className="mt-14 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-900">
        पूरा अध्याय लोड नहीं हो सका: {state.message}
      </div>
    );
  }

  if (state.verses.length === 0) {
    return (
      <div className="mt-14 rounded-2xl border border-dharma-border bg-white p-6 text-center text-sm text-dharma-muted">
        इस अध्याय के सभी श्लोक ऊपर दिखाए जा चुके हैं।
      </div>
    );
  }

  return (
    <section className="mt-14">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-serif font-bold text-dharma-text">पूर्ण अध्याय पाठ</h3>
        <span className="text-xs text-dharma-muted">{state.verses.length} अतिरिक्त श्लोक</span>
      </div>
      <div className="space-y-6">
        {state.verses.map((v) => (
          <article
            key={String(v.number)}
            className="rounded-xl border border-dharma-border bg-white p-5 md:p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-saffron-100 text-saffron-800 font-bold text-sm">
                {v.number}
              </span>
              <div className="text-[10px] uppercase tracking-widest text-saffron-800/70 font-semibold">
                श्लोक {v.number}
              </div>
            </div>
            {v.sanskrit && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-saffron-800/70 font-semibold mb-1.5">
                  <Feather className="w-3 h-3" />
                  संस्कृत
                </div>
                <p className="font-devanagari text-base md:text-lg leading-loose text-dharma-text whitespace-pre-line">
                  {v.sanskrit}
                </p>
              </div>
            )}
            {v.transliteration && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-stone-700 font-semibold mb-1.5">
                  <Languages className="w-3 h-3" />
                  लिप्यंतरण
                </div>
                <p className="text-sm md:text-base italic text-stone-700 whitespace-pre-line leading-relaxed">
                  {v.transliteration}
                </p>
              </div>
            )}
            {v.hindi && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-rose-800 font-semibold mb-1.5">
                  <Sun className="w-3 h-3" />
                  हिन्दी अर्थ
                </div>
                <p className="text-sm md:text-base text-rose-950 leading-loose">{v.hindi}</p>
              </div>
            )}
            {v.translation && (
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-blue-800 font-semibold mb-1.5">
                  <ScrollText className="w-3 h-3" />
                  अनुवाद
                </div>
                <p className="text-sm md:text-base text-dharma-text leading-relaxed">{v.translation}</p>
              </div>
            )}
            {!v.hindi && !v.translation && (
              <p className="mt-2 text-xs text-dharma-muted italic">हिन्दी अनुवाद शीघ्र उपलब्ध होगा।</p>
            )}
          </article>
        ))}
      </div>
      {state.source?.repo && (
        <p className="mt-6 text-xs text-dharma-muted text-center">
          स्रोत:{' '}
          <a href={state.source.repo} target="_blank" rel="noopener noreferrer" className="underline">
            {state.source.repo.replace('https://github.com/', '')}
          </a>
          {state.source.fetchedAt && ` · प्राप्त ${new Date(state.source.fetchedAt).toLocaleDateString('hi-IN')}`}
        </p>
      )}
    </section>
  );
}
