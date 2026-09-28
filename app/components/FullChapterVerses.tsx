'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Atom,
  BookOpen,
  Check,
  Copy,
  Edit3,
  Feather,
  Flame,
  Languages,
  Lightbulb,
  RotateCcw,
  ScrollText,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import type { ScriptureCategory } from '@/data/types';
import type { HiCommentaryFragment } from '@/data/hi-commentary/_types';
import { canonicalVerseId } from '@/lib/canonical-verse-id';
import { getVerseGraphicClass, getVerseGraphicStyle } from './verse-background';
import { ContributeMeaningModal } from './ContributeMeaningModal';
import { ListenButton } from './ListenButton';
import { ShareVerseButton } from './ShareVerseButton';

interface FullVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  translationSource?: 'ai';
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
  /** Display titles for the share card; fall back to ids when absent. */
  scriptureTitle?: string;
  chapterTitle?: string;
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
  | { kind: 'ready'; verses: FullVerse[]; commentary?: HiCommentaryFragment; source?: FullScripture['source'] }
  | { kind: 'empty' }
  | { kind: 'error'; message: string };

export function FullChapterVerses({ scriptureId, category, chapterId, curatedVerseIds, scriptureTitle, chapterTitle, basePath = '', autoLoad = false }: Props) {
  const [state, setState] = useState<State>({ kind: autoLoad ? 'loading' : 'idle' });
  const [contributeVerse, setContributeVerse] = useState<FullVerse | null>(null);
  const curatedVerseSet = useMemo(
    () => new Set(curatedVerseIds.map((id) => String(id))),
    [curatedVerseIds],
  );

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [chantingMode, setChantingMode] = useState(false);
  const [showTranslit, setShowTranslit] = useState(true);
  const [showHindi, setShowHindi] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showCommentary, setShowCommentary] = useState(true);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const layersMenuRef = useRef<HTMLDivElement>(null);

  // Close layers menu on outside click
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!layersMenuRef.current?.contains(e.target as Node)) {
        setShowLayersMenu(false);
      }
    }
    if (showLayersMenu) {
      document.addEventListener('mousedown', handlePointerDown);
      return () => document.removeEventListener('mousedown', handlePointerDown);
    }
  }, [showLayersMenu]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem('dharma_reader_fontsize');
      if (savedFontSize === 'normal' || savedFontSize === 'large' || savedFontSize === 'xl') {
        setFontSize(savedFontSize);
      }
      const savedLayers = localStorage.getItem('dharma_reader_layers');
      if (savedLayers) {
        const parsed = JSON.parse(savedLayers);
        if (typeof parsed.translit === 'boolean') setShowTranslit(parsed.translit);
        if (typeof parsed.hindi === 'boolean') setShowHindi(parsed.hindi);
        if (typeof parsed.english === 'boolean') setShowEnglish(parsed.english);
        if (typeof parsed.commentary === 'boolean') setShowCommentary(parsed.commentary);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const updateFontSize = (size: 'normal' | 'large' | 'xl') => {
    setFontSize(size);
    try {
      localStorage.setItem('dharma_reader_fontsize', size);
    } catch {}
  };

  const updateLayers = (updates: Partial<{ translit: boolean; hindi: boolean; english: boolean; commentary: boolean }>) => {
    const next = {
      translit: updates.translit ?? showTranslit,
      hindi: updates.hindi ?? showHindi,
      english: updates.english ?? showEnglish,
      commentary: updates.commentary ?? showCommentary,
    };
    if (updates.translit !== undefined) setShowTranslit(updates.translit);
    if (updates.hindi !== undefined) setShowHindi(updates.hindi);
    if (updates.english !== undefined) setShowEnglish(updates.english);
    if (updates.commentary !== undefined) setShowCommentary(updates.commentary);
    try {
      localStorage.setItem('dharma_reader_layers', JSON.stringify(next));
    } catch {}
  };

  const handleCopyVerse = async (v: FullVerse) => {
    try {
      const parts: string[] = [];
      if (v.sanskrit) parts.push(v.sanskrit);
      if (v.transliteration) parts.push(v.transliteration);
      if (v.hindi) parts.push(`हिन्दी: ${v.hindi}`);
      if (v.translation) parts.push(`English: ${v.translation}`);
      parts.push(`— ${scriptureTitle ?? scriptureId}, ${chapterTitle ?? `अध्याय ${chapterId}`}, श्लोक ${v.number}`);
      if (typeof window !== 'undefined') {
        parts.push(window.location.href);
      }
      await navigator.clipboard.writeText(parts.join('\n\n'));
      setCopiedId(String(v.number));
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy verse:', err);
    }
  };

  const filteredVerses = useMemo(() => {
    if (state.kind !== 'ready') return [];
    const q = filterQuery.trim().toLowerCase();
    if (!q) return state.verses;
    return state.verses.filter((v) => {
      const num = String(v.number).toLowerCase();
      if (num === q || num.includes(q)) return true;
      if (v.sanskrit?.toLowerCase().includes(q)) return true;
      if (v.transliteration?.toLowerCase().includes(q)) return true;
      if (v.hindi?.toLowerCase().includes(q)) return true;
      if (v.translation?.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [state, filterQuery]);

  const sanskritFontSizeClass =
    fontSize === 'xl'
      ? 'text-xl md:text-2xl leading-loose font-medium'
      : fontSize === 'large'
      ? 'text-lg md:text-xl leading-loose'
      : 'text-base md:text-lg leading-loose';

  useEffect(() => {
    if (state.kind !== 'loading') return;
    let cancelled = false;
    (async () => {
      try {
        const shardRes = await fetch(
          `${basePath}/data/scriptures-full/${scriptureId}/ch-${chapterId}.json`,
          { cache: 'force-cache' },
        );

        let chapter: FullChapter | undefined;
        let source: FullScripture['source'];

        if (shardRes.ok) {
          const shard = (await shardRes.json()) as {
            chapter?: FullChapter;
            source?: FullScripture['source'];
          };
          chapter = shard.chapter;
          source = shard.source;
        } else {
          const bookRes = await fetch(`${basePath}/data/scriptures-full/${scriptureId}.json`, {
            cache: 'force-cache',
          });
          if (!bookRes.ok) {
            if (!cancelled) setState({ kind: 'empty' });
            return;
          }
          const data: FullScripture = await bookRes.json();
          chapter = data.chapters.find((c) => c.number === chapterId);
          source = data.source;
        }

        if (!chapter || chapter.verses.length === 0) {
          if (!cancelled) setState({ kind: 'empty' });
          return;
        }

        const commentaryRes = await fetch(`${basePath}/data/hi-commentary/${scriptureId}.json`, {
          cache: 'force-cache',
        });
        const extras = chapter.verses.filter(
          (v) => !curatedVerseSet.has(canonicalVerseId(chapterId, v.number)),
        );
        const commentary: HiCommentaryFragment | undefined = commentaryRes.ok
          ? await commentaryRes.json()
          : undefined;
        if (!cancelled) {
          setState({ kind: 'ready', verses: extras, commentary, source });
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
        {/* Reader Customization Toolbar */}
        <div className="mb-6 rounded-2xl border border-dharma-border/80 bg-dharma-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-serif font-bold text-dharma-text flex items-center gap-2">
                <span>पूर्ण अध्याय पाठ</span>
                <span className="text-xs font-sans font-normal text-dharma-muted rounded-full bg-dharma-bg px-2.5 py-0.5 border border-dharma-border/60">
                  {filterQuery.trim() ? `${filteredVerses.length} / ${state.verses.length}` : state.verses.length} श्लोक
                </span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Chanting Mode Toggle */}
              <button
                type="button"
                onClick={() => setChantingMode(!chantingMode)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  chantingMode
                    ? 'bg-saffron-600 text-white shadow-sm ring-2 ring-saffron-400/30'
                    : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-300 hover:text-saffron-700'
                }`}
                title="केवल मूल संस्कृत श्लोक पाठ के लिए स्वाध्याय मोड ऑन/ऑफ करें"
              >
                <Flame className={`h-3.5 w-3.5 ${chantingMode ? 'text-white' : 'text-saffron-600'}`} />
                <span>स्वाध्याय मोड</span>
              </button>

              {/* Font Size Selector */}
              <div className="inline-flex items-center rounded-xl border border-dharma-border bg-dharma-bg p-0.5 text-xs font-semibold text-dharma-text">
                <button
                  type="button"
                  onClick={() => updateFontSize('normal')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    fontSize === 'normal'
                      ? 'bg-dharma-card text-saffron-700 shadow-sm font-bold'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="सामान्य अक्षर (Normal font size)"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => updateFontSize('large')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    fontSize === 'large'
                      ? 'bg-dharma-card text-saffron-700 shadow-sm font-bold'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="बड़े अक्षर (Large font size)"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => updateFontSize('xl')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    fontSize === 'xl'
                      ? 'bg-dharma-card text-saffron-700 shadow-sm font-bold'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="विशाल अक्षर (Extra large font size)"
                >
                  A++
                </button>
              </div>

              {/* Layer Toggles (Hidden in chanting mode) */}
              {!chantingMode && (
                <div className="relative" ref={layersMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowLayersMenu(!showLayersMenu)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      showLayersMenu || (!showTranslit || !showHindi || !showEnglish || !showCommentary)
                        ? 'border-saffron-300 bg-saffron-50 text-saffron-800'
                        : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-300'
                    }`}
                    title="भाषा व व्याख्या विकल्प"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-saffron-600" />
                    <span>दृश्य</span>
                  </button>

                  {showLayersMenu && (
                    <div className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border border-dharma-border bg-dharma-card p-2.5 shadow-xl">
                      <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                        सामग्री चयन
                      </p>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-dharma-text hover:bg-dharma-bg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showTranslit}
                            onChange={(e) => updateLayers({ translit: e.target.checked })}
                            className="rounded text-saffron-600 focus:ring-saffron-500"
                          />
                          <span>लिप्यंतरण (Translit)</span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-dharma-text hover:bg-dharma-bg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showHindi}
                            onChange={(e) => updateLayers({ hindi: e.target.checked })}
                            className="rounded text-saffron-600 focus:ring-saffron-500"
                          />
                          <span>हिन्दी अर्थ</span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-dharma-text hover:bg-dharma-bg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showEnglish}
                            onChange={(e) => updateLayers({ english: e.target.checked })}
                            className="rounded text-saffron-600 focus:ring-saffron-500"
                          />
                          <span>English Translation</span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-dharma-text hover:bg-dharma-bg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showCommentary}
                            onChange={(e) => updateLayers({ commentary: e.target.checked })}
                            className="rounded text-saffron-600 focus:ring-saffron-500"
                          />
                          <span>विस्तृत व्याख्या / दृष्टि</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick in-chapter search input */}
          <div className="mt-3 pt-3 border-t border-dharma-border/60 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dharma-muted" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="श्लोक संख्या या शब्द खोजें... (e.g. 5, धर्म, कृष्ण)"
                className="w-full rounded-xl border border-dharma-border/70 bg-dharma-bg/80 pl-8 pr-8 py-1.5 text-xs text-dharma-text placeholder:text-dharma-muted/70 outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-400/20"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-dharma-muted hover:text-dharma-text"
                  aria-label="Clear filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredVerses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-dharma-border bg-dharma-card p-8 text-center text-sm text-dharma-muted">
              <p className="font-semibold text-dharma-text mb-1">&lsquo;{filterQuery}&rsquo; के लिए कोई श्लोक नहीं मिला</p>
              <p className="text-xs mb-3">कृपया दूसरा श्लोक क्रमांक या शब्द खोजें।</p>
              <button
                type="button"
                onClick={() => setFilterQuery('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dharma-border bg-dharma-bg text-xs font-semibold hover:border-saffron-300"
              >
                <RotateCcw className="w-3.5 h-3.5" /> फ़िल्टर हटाएं
              </button>
            </div>
          ) : (
            filteredVerses.map((v, index) => {
              const verseKey = canonicalVerseId(chapterId, v.number);
              const verseIdNum = Number(verseKey);
              const comment = state.commentary?.[`${chapterId}:${verseIdNum}`];
              const explanationHi = comment?.explanation;
              const scienceHi = comment?.science;
              const lifeLessonHi = comment?.lifeLesson;
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
                  className={`rounded-xl border border-dharma-border bg-dharma-card p-5 md:p-6 shadow-sm ${
                    chantingMode ? 'border-saffron-200/70 shadow-md ring-1 ring-saffron-500/10' : ''
                  } ${getVerseGraphicClass(category)}`}
                  style={getVerseGraphicStyle({ category, verseId: v.number })}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-saffron-100 text-saffron-800 font-bold text-sm">
                      {v.number}
                    </span>
                    <div className="text-[10px] uppercase tracking-widest text-saffron-800/70 font-semibold">
                      श्लोक {v.number}
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyVerse(v)}
                        className="inline-flex items-center gap-1 rounded-full border border-dharma-border/60 bg-dharma-bg px-2.5 py-0.5 text-[10px] font-medium text-dharma-muted hover:border-saffron-300 hover:text-saffron-700 transition"
                        title="Copy verse with citation"
                        aria-label="Copy verse"
                      >
                        {copiedId === String(v.number) ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <ListenButton
                        compact
                        sanskrit={v.sanskrit}
                        hindi={v.hindi}
                        translation={v.translation}
                      />
                      <ShareVerseButton
                        compact
                        scriptureTitle={scriptureTitle ?? scriptureId}
                        chapterTitle={chapterTitle ?? `अध्याय ${chapterId}`}
                        verseLabel={String(v.number)}
                        sanskrit={v.sanskrit}
                        transliteration={v.transliteration}
                        hindi={v.hindi}
                        translation={v.translation}
                      />
                      {!chantingMode && (
                        <button
                          type="button"
                          onClick={() => setContributeVerse(v)}
                          className="inline-flex items-center gap-1 rounded-full border border-dharma-border/60 bg-dharma-bg px-2.5 py-0.5 text-[10px] font-medium text-dharma-muted hover:border-saffron-300 hover:text-saffron-700"
                          title="Contribute or improve meaning for this verse"
                        >
                          <Edit3 className="h-3 w-3" /> Contribute
                        </button>
                      )}
                    </div>
                  </div>

                  {v.sanskrit && (
                    <div className="mb-4">
                      {!chantingMode && (
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-saffron-800/70 font-semibold mb-1.5">
                          <Feather className="w-3 h-3" />
                          संस्कृत
                        </div>
                      )}
                      <p className={`font-devanagari ${sanskritFontSizeClass} text-dharma-text whitespace-pre-line`}>
                        {v.sanskrit}
                      </p>
                    </div>
                  )}

                  {v.transliteration && showTranslit && (
                    <div className="mb-4">
                      {!chantingMode && (
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-stone-700 font-semibold mb-1.5">
                          <Languages className="w-3 h-3" />
                          लिप्यंतरण
                        </div>
                      )}
                      <p className="text-sm md:text-base italic text-stone-700 whitespace-pre-line leading-relaxed">
                        {v.transliteration}
                      </p>
                    </div>
                  )}

                  {!chantingMode && (
                    <>
                      {v.hindi && showHindi && (
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-rose-800 font-semibold mb-1.5">
                            <Sun className="w-3 h-3" />
                            हिन्दी अर्थ
                          </div>
                          <p className="text-sm md:text-base text-rose-950 leading-loose">{v.hindi}</p>
                        </div>
                      )}

                      {v.translation && showEnglish && (
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-blue-800 font-semibold mb-1.5">
                            <ScrollText className="w-3 h-3" />
                            अनुवाद
                            {v.translationSource === 'ai' && (
                              <span
                                className="ml-1 rounded-full border border-blue-200 bg-blue-50 px-1.5 py-px text-[9px] font-medium normal-case tracking-normal text-blue-700"
                                title="Machine-translated from the Sanskrit; not a scholarly translation"
                              >
                                AI translation
                              </span>
                            )}
                          </div>
                          <p className="text-sm md:text-base text-dharma-text leading-relaxed">{v.translation}</p>
                        </div>
                      )}

                      {showCommentary && (
                        <>
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
                        </>
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
                    </>
                  )}
                </article>
              );
            })
          )}
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
