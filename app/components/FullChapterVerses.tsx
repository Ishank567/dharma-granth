'use client';

import { useEffect, useMemo, useState } from 'react';
import { Atom, BookOpen, Edit3, Feather, Languages, Lightbulb, ScrollText, Sparkles, Sun } from 'lucide-react';
import type { ScriptureCategory } from '@/data/types';
import { getVerseExplanationHi, getVerseLifeLessonHi, getVerseScienceHi } from '@/data/verse-explanations-hi';
import { canonicalVerseId } from '@/lib/canonical-verse-id';
import { getVerseGraphicClass, getVerseGraphicStyle } from './verse-background';
import { ContributeMeaningModal } from './ContributeMeaningModal';

interface FullVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  wordMeaning?: string;
  commentary?: string;
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  keywords?: string[];
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
  category: ScriptureCategory;
  chapterId: number;
  curatedVerseIds: Array<number | string>;
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

export function FullChapterVerses({ scriptureId, category, chapterId, curatedVerseIds, basePath = '', autoLoad = false }: Props) {
  const [state, setState] = useState<State>({ kind: autoLoad ? 'loading' : 'idle' });
  const [contributeVerse, setContributeVerse] = useState<FullVerse | null>(null);
  const curatedVerseSet = useMemo(
    () => new Set(curatedVerseIds.map((id) => String(id))),
    [curatedVerseIds],
  );

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
        const extras = chapter.verses.filter(
          (v) => !curatedVerseSet.has(canonicalVerseId(chapterId, v.number)),
        );
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
  }, [state.kind, scriptureId, chapterId, curatedVerseSet, basePath]);

  if (state.kind === 'idle') {
    return (
      <div className="mt-14 rounded-2xl border border-dashed border-saffron-300 bg-saffron-500/10 p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-saffron-100/80 text-saffron-700 mb-3">
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
      <div className="mt-14 rounded-2xl border border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        अध्याय लोड हो रहा है…
      </div>
    );
  }

  if (state.kind === 'empty') {
    return (
      <div className="mt-14 rounded-2xl border border-dashed border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        इस ग्रंथ का पूर्ण-पाठ अभी तैयार नहीं हुआ है। पूर्ण पाठ संग्रहीत करने के लिए{' '}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100">npm run seed:all</code> चलाएँ ताकि{' '}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100">public/data/scriptures-full/</code> भर जाए।
      </div>
    );
  }

  if (state.kind === 'error') {
    return (
      <div className="mt-14 rounded-2xl border border-rose-200 bg-rose-50/10 p-6 text-center text-sm text-rose-900">
        पूरा अध्याय लोड नहीं हो सका: {state.message}
      </div>
    );
  }

  if (state.verses.length === 0) {
    return (
      <div className="mt-14 rounded-2xl border border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        इस अध्याय के सभी श्लोक ऊपर दिखाए जा चुके हैं।
      </div>
    );
  }

  return (
    <>
      <section className="mt-14">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-serif font-bold text-dharma-text">पूर्ण अध्याय पाठ</h3>
        <span className="text-xs text-dharma-muted">{state.verses.length} अतिरिक्त श्लोक</span>
      </div>
      <div className="space-y-6">
        {state.verses.map((v, index) => {
          const verseKey = canonicalVerseId(chapterId, v.number);
          const verseIdNum = Number(verseKey);
          const explanationHi = Number.isFinite(verseIdNum)
            ? getVerseExplanationHi(scriptureId, chapterId, verseIdNum)
            : undefined;
          const scienceHi = Number.isFinite(verseIdNum)
            ? getVerseScienceHi(scriptureId, chapterId, verseIdNum)
            : undefined;
          const lifeLessonHi = Number.isFinite(verseIdNum)
            ? getVerseLifeLessonHi(scriptureId, chapterId, verseIdNum)
            : undefined;
          const explanation = explanationHi ?? v.explanation ?? v.commentary;
          const explanationIsHi = Boolean(explanationHi);
          const science = scienceHi ?? v.science;
          const scienceIsHi = Boolean(scienceHi);
          const lesson = lifeLessonHi ?? v.lifeLesson;
          const lessonIsHi = Boolean(lifeLessonHi);
          const hasMeaning = Boolean(
            v.hindi ||
              v.translation ||
              v.wordMeaning ||
              explanation ||
              science ||
              lesson,
          );
          return (
          <article
            key={`${String(v.number)}-${index}`}
            className={`rounded-xl border border-dharma-border bg-dharma-card p-5 md:p-6 shadow-sm ${getVerseGraphicClass(category)}`}
            style={getVerseGraphicStyle({ category, verseId: v.number })}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-saffron-100 text-saffron-800 font-bold text-sm">
                {v.number}
              </span>
              <div className="text-[10px] uppercase tracking-widest text-saffron-800/70 font-semibold">
                श्लोक {v.number}
              </div>
              <button
                type="button"
                onClick={() => setContributeVerse(v)}
                className="ml-auto inline-flex items-center gap-1 rounded-full border border-dharma-border/60 bg-dharma-bg px-2.5 py-0.5 text-[10px] font-medium text-dharma-muted hover:border-saffron-300 hover:text-saffron-700"
                title="Contribute or improve meaning for this verse"
              >
                <Edit3 className="h-3 w-3" /> Contribute
              </button>
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
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-blue-800 font-semibold mb-1.5">
                  <ScrollText className="w-3 h-3" />
                  अनुवाद
                </div>
                <p className="text-sm md:text-base text-dharma-text leading-relaxed">{v.translation}</p>
              </div>
            )}
            {v.wordMeaning && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-800 font-semibold mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  सरल अर्थ
                </div>
                <p className="text-sm md:text-base text-emerald-950 leading-relaxed">{v.wordMeaning}</p>
              </div>
            )}
            {explanation && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-800 font-semibold mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  {explanationIsHi ? 'आध्यात्मिक व्याख्या' : 'अंग्रेज़ी व्याख्या'}
                </div>
                <p
                  className={`text-sm md:text-base text-emerald-950 leading-relaxed ${explanationIsHi ? 'font-devanagari' : ''}`}
                >
                  {explanation}
                </p>
              </div>
            )}
            {science && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-indigo-800 font-semibold mb-1.5">
                  <Atom className="w-3 h-3" />
                  {scienceIsHi ? 'वैज्ञानिक दृष्टिकोण' : 'अंग्रेज़ी वैज्ञानिक दृष्टिकोण'}
                </div>
                <p
                  className={`text-sm md:text-base text-indigo-950 leading-relaxed ${scienceIsHi ? 'font-devanagari' : ''}`}
                >
                  {science}
                </p>
              </div>
            )}
            {lesson && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-amber-800 font-semibold mb-1.5">
                  <Lightbulb className="w-3 h-3" />
                  {lessonIsHi ? 'जीवन की सीख — आज अपनाएँ' : 'अंग्रेज़ी जीवन की सीख'}
                </div>
                <p
                  className={`text-sm md:text-base text-amber-950 leading-relaxed font-medium ${lessonIsHi ? 'font-devanagari' : ''}`}
                >
                  {lesson}
                </p>
              </div>
            )}
            {v.keywords && v.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {v.keywords.map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center rounded-full bg-saffron-100 px-2.5 py-0.5 text-[11px] font-semibold text-saffron-800"
                  >
                    #{k}
                  </span>
                ))}
              </div>
            )}
            {!hasMeaning && (
              <div className="mt-3 rounded-lg border border-dashed border-dharma-border/60 bg-dharma-bg/60 p-3 text-xs text-dharma-muted">
                <p className="italic">इस श्लोक के लिए विस्तृत हिन्दी व्याख्या, आधुनिक विज्ञान-दृष्टि और जीवन-शिक्षा अभी क्यूरेटेड चयन में उपलब्ध है।</p>
                <p className="mt-1">ऊपर दिखाए गए &lsquo;सीखने वाले श्लोकों&rsquo; में गहन अर्थ (explanation + science + lifeLesson) देखें। पूर्ण अध्याय का मूल पाठ मुख्यतः पाठन और संदर्भ के लिए है।</p>
                <button
                  type="button"
                  onClick={() => setContributeVerse(v)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-saffron-300 bg-saffron-50 px-2.5 py-1 text-[11px] font-semibold text-saffron-800 hover:bg-saffron-100"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Be the first to contribute a meaning
                </button>
              </div>
            )}
          </article>
          );
        })}
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

      {/* Single contribute modal for bulk verses */}
      <ContributeMeaningModal
        open={!!contributeVerse}
        onClose={() => setContributeVerse(null)}
        scriptureId={scriptureId}
        chapterId={chapterId}
        verseId={contributeVerse?.number ?? ''}
        sanskrit={contributeVerse?.sanskrit}
        scriptureTitle={undefined}
        chapterTitle={undefined}
        current={{
          hindi: contributeVerse?.hindi,
          translation: contributeVerse?.translation,
          explanation: contributeVerse?.explanation || contributeVerse?.commentary || contributeVerse?.wordMeaning,
          science: contributeVerse?.science,
          lifeLesson: contributeVerse?.lifeLesson,
        }}
      />
    </>
  );
}
