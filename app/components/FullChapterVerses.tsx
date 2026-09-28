'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Flame,
  Headphones,
  Maximize2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { ScriptureCategory } from '@/data/types';
import type { HiCommentaryFragment } from '@/data/hi-commentary/_types';
import { canonicalVerseId } from '@/lib/canonical-verse-id';
import { normalizeForSearch, normalizeTransliteration } from '@/lib/normalize-search';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { updateLastVerse } from '@/lib/reading-history';
import { reciteVerse, stopRecitation } from '@/lib/verse-recite';
import { ContributeMeaningModal } from './ContributeMeaningModal';
import { VerseCard } from './VerseCard';
import { MobileFocusMode } from './MobileFocusMode';
import { triggerTactileFeedback } from '@/lib/haptics';

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
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [continuousRecite, setContinuousRecite] = useState(false);
  const continuousReciteRef = useRef(false);
  continuousReciteRef.current = continuousRecite;
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const [focusVerseIndex, setFocusVerseIndex] = useState(0);
  const layersMenuRef = useRef<HTMLDivElement>(null);
  // One store for the whole chapter (not one per card): notes and highlights
  // are passed down to each VerseCard.
  const { recordReading, getNote, setNote, getHighlight, toggleHighlight } = useStudyProgress();

  // Auto-record study reading when chapter is loaded
  useEffect(() => {
    if (state.kind === 'ready' && state.verses.length > 0) {
      recordReading();
    }
  }, [state, recordReading]);

  // Remember the verse being read, so "continue reading" resumes at it.
  useEffect(() => {
    if (state.kind !== 'ready') return;
    let timer = 0;
    const record = () => {
      // The reading line: a third of the way down the viewport.
      const line = window.innerHeight / 3;
      const cards = document.querySelectorAll<HTMLElement>('.verse-card[id^="verse-"]');
      for (const card of Array.from(cards)) {
        if (card.getBoundingClientRect().bottom > line) {
          updateLastVerse(scriptureId, chapterId, card.id.slice('verse-'.length));
          return;
        }
      }
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(record, 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [state.kind, scriptureId, chapterId]);

  // Load verse bookmark statuses from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dharma.bookmarkedVerses');
      if (saved) {
        const list: Array<{
          scriptureId: string;
          chapterId?: number;
          verseId: number | string;
        }> = JSON.parse(saved);
        const map: Record<string, boolean> = {};
        for (const b of list) {
          if (b.scriptureId === scriptureId && b.chapterId === chapterId) {
            map[String(b.verseId)] = true;
          }
        }
        setBookmarkedMap(map);
      }
    } catch {}
  }, [scriptureId, chapterId]);

  const toggleBookmark = (v: FullVerse) => {
    try {
      const saved = localStorage.getItem('dharma.bookmarkedVerses');
      const list: Array<{
        scriptureId: string;
        scriptureTitle: string;
        chapterId?: number;
        chapterTitle: string;
        verseId: number | string;
        sanskrit: string;
        translation: string;
        hindi?: string;
        timestamp: string;
      }> = saved ? JSON.parse(saved) : [];

      const vId = String(v.number);
      const isCurrentlySaved = Boolean(bookmarkedMap[vId]);

      let nextList: typeof list;
      if (isCurrentlySaved) {
        nextList = list.filter(
          (b) =>
            !(
              b.scriptureId === scriptureId &&
              b.chapterId === chapterId &&
              String(b.verseId) === vId
            ),
        );
      } else {
        const item = {
          scriptureId,
          scriptureTitle: scriptureTitle ?? scriptureId,
          chapterId,
          chapterTitle: chapterTitle ?? `अध्याय ${chapterId}`,
          verseId: v.number,
          sanskrit: v.sanskrit ?? '',
          translation: v.translation ?? v.hindi ?? '',
          hindi: v.hindi,
          timestamp: new Date().toISOString(),
        };
        nextList = [item, ...list];
      }

      localStorage.setItem('dharma.bookmarkedVerses', JSON.stringify(nextList));
      setBookmarkedMap((prev) => ({
        ...prev,
        [vId]: !isCurrentlySaved,
      }));
      triggerTactileFeedback(!isCurrentlySaved ? 'success' : 'medium', !isCurrentlySaved ? 'success' : 'softTap');
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const scrollToVerse = (verseNum: string | number, behavior: ScrollBehavior = 'smooth') => {
    const el = document.getElementById(`verse-${verseNum}`);
    if (el) {
      el.scrollIntoView({ behavior, block: 'center' });
    }
  };

  // Deep-link auto-scroll on mount if ?verse= or #verse- is present
  useEffect(() => {
    if (state.kind !== 'ready') return;
    const urlParams = new URLSearchParams(window.location.search);
    const targetVerse =
      urlParams.get('verse') ||
      (window.location.hash.startsWith('#verse-')
        ? window.location.hash.replace('#verse-', '')
        : null);
    if (targetVerse) {
      const timer = setTimeout(() => {
        // Jump, like a native #hash link: a smooth scroll across a long
        // chapter is slow and can be cut short by layout shifts.
        scrollToVerse(targetVerse, 'auto');
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [state.kind]);

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
      triggerTactileFeedback('medium', 'click');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy verse:', err);
    }
  };

  // Match keys computed once per chapter, not on every keystroke.
  const verseSearchKeys = useMemo(() => {
    if (state.kind !== 'ready') return [];
    return state.verses.map((v) => ({
      number: String(v.number),
      // Transliteration gets phonetic folding, so "dharmakshetre" finds IAST
      // "dharmakṣetre".
      phonetic: normalizeTransliteration(v.transliteration ?? ''),
      text: normalizeForSearch([v.sanskrit, v.hindi, v.translation].filter(Boolean).join(' ')),
    }));
  }, [state]);

  const filteredVerses = useMemo(() => {
    if (state.kind !== 'ready') return [];
    const q = normalizeForSearch(filterQuery);
    if (!q) return state.verses;
    const qPhonetic = normalizeTransliteration(filterQuery);
    const rawNumber = filterQuery.trim();
    return state.verses.filter((_, i) => {
      const keys = verseSearchKeys[i];
      return (
        keys.number.includes(rawNumber) ||
        (qPhonetic !== '' && keys.phonetic.includes(qPhonetic)) ||
        keys.text.includes(q)
      );
    });
  }, [state, filterQuery, verseSearchKeys]);

  const handleVerseReciteFinish = (currentIndex: number, naturalEnd: boolean) => {
    if (!continuousReciteRef.current || !naturalEnd) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < filteredVerses.length) {
      const nextVerse = filteredVerses[nextIndex];
      scrollToVerse(nextVerse.number);
      setTimeout(() => {
        if (!continuousReciteRef.current) return;
        reciteVerse(
          {
            sanskrit: nextVerse.sanskrit,
            hindi: nextVerse.hindi,
            translation: nextVerse.translation,
          },
          (nextNatural) => handleVerseReciteFinish(nextIndex, nextNatural),
        );
      }, 750);
    }
  };

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
        // Default caching, not 'force-cache': that serves a cached copy however
        // old, so readers kept seeing chapters from before a data repair.
        const shardRes = await fetch(
          `${basePath}/data/scriptures-full/${scriptureId}/ch-${chapterId}.json`,
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
          // Fallback to monolithic book JSON
          const bookRes = await fetch(`${basePath}/data/scriptures-full/${scriptureId}.json`);
          if (!bookRes.ok) {
            if (!cancelled) setState({ kind: 'empty' });
            return;
          }
          const data: FullScripture = await bookRes.json();
          chapter = data.chapters?.find((c) => c.number === chapterId);
          source = data.source;
        }

        if (!chapter || chapter.verses.length === 0) {
          if (!cancelled) setState({ kind: 'empty' });
          return;
        }

        const commentaryRes = await fetch(`${basePath}/data/hi-commentary/${scriptureId}.json`);
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

  // Retry by itself once the connection comes back.
  useEffect(() => {
    if (state.kind !== 'error') return;
    const retry = () => setState({ kind: 'loading' });
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [state.kind]);

  if (state.kind === 'idle') {
    return (
      <div className="rounded-2xl border border-dashed border-saffron-300 bg-saffron-500/10 p-6 text-center">
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
      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        अध्याय लोड हो रहा है…
      </div>
    );
  }

  if (state.kind === 'empty') {
    return (
      <div className="rounded-2xl border border-dashed border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        इस ग्रंथ का पूर्ण-पाठ अभी तैयार नहीं हुआ है। पूर्ण पाठ संग्रहीत करने के लिए{' '}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100">npm run seed:all</code> चलाएँ ताकि{' '}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100">public/data/scriptures-full/</code> भर जाए।
      </div>
    );
  }

  if (state.kind === 'error') {
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-200 bg-rose-50/10 p-6 text-center"
      >
        <p className="font-semibold text-rose-900">
          {offline ? 'आप ऑफ़लाइन हैं — अध्याय लोड नहीं हो सका।' : 'अध्याय लोड नहीं हो सका।'}
        </p>
        <p className="mt-1 text-sm text-dharma-muted">
          {offline
            ? 'इंटरनेट से जुड़ने के बाद फिर से प्रयास करें।'
            : 'कनेक्शन में रुकावट हो सकती है। कृपया फिर से प्रयास करें।'}
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: 'loading' })}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-saffron-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-saffron-700"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          पुनः प्रयास करें
        </button>
        {/* Kept for bug reports, out of the way of readers. */}
        <p className="mt-3 text-[11px] text-dharma-muted/70" lang="en">
          {state.message}
        </p>
      </div>
    );
  }

  if (state.verses.length === 0) {
    return (
      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        इस अध्याय के सभी श्लोक ऊपर दिखाए जा चुके हैं।
      </div>
    );
  }

  return (
    <>
      <section>
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
              {/* Continuous Guided Recitation Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !continuousRecite;
                  setContinuousRecite(next);
                  triggerTactileFeedback('medium', next ? 'softTap' : 'click');
                  if (!next) {
                    stopRecitation();
                  }
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  continuousRecite
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/30'
                    : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-amber-300 hover:text-amber-700'
                }`}
                title="एक श्लोक समाप्त होने पर स्वतः अगले श्लोक का पाठ शुरू करें"
                aria-label="निरंतर पाठ"
                aria-pressed={continuousRecite}
              >
                <Headphones className={`h-3.5 w-3.5 ${continuousRecite ? 'text-white' : 'text-amber-600'}`} />
                {/* Icon-only on phones so the whole toolbar fits one row. */}
                <span className="hidden sm:inline">निरंतर पाठ</span>
              </button>

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
                aria-label="स्वाध्याय मोड"
                aria-pressed={chantingMode}
              >
                <Flame className={`h-3.5 w-3.5 ${chantingMode ? 'text-white' : 'text-saffron-600'}`} />
                <span className="hidden sm:inline">स्वाध्याय मोड</span>
              </button>

              {/* Focus Mode Button */}
              <button
                type="button"
                onClick={() => {
                  setFocusVerseIndex(0);
                  setFocusModeOpen(true);
                  triggerTactileFeedback('medium', 'click');
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-bg px-3 py-1.5 text-xs font-semibold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700 active:scale-95"
                title="एक-एक श्लोक स्वाध्याय के लिए एकाग्रता मोड खोलें (Focus Mode)"
                aria-label="एकाग्रता मोड"
              >
                <Maximize2 className="h-3.5 w-3.5 text-amber-600" />
                <span className="hidden sm:inline">एकाग्रता मोड</span>
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
                    aria-label="दृश्य — भाषा व व्याख्या विकल्प"
                    aria-expanded={showLayersMenu}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-saffron-600" />
                    <span className="hidden sm:inline">दृश्य</span>
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

          {/* Quick in-chapter search & verse jump */}
          <div className="mt-3 pt-3 border-t border-dharma-border/60 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
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

            {state.verses.length > 5 && (
              <div className="flex items-center gap-1.5 text-xs text-dharma-muted">
                <span className="shrink-0 text-[11px] font-medium">श्लोक पर जाएं:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      scrollToVerse(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  aria-label="श्लोक पर सीधे जाएं"
                  className="rounded-lg border border-dharma-border/70 bg-dharma-bg px-2 py-1 text-xs text-dharma-text outline-none focus:border-saffron-400 cursor-pointer"
                >
                  <option value="" disabled>
                    चुनें...
                  </option>
                  {state.verses.map((v) => (
                    <option key={String(v.number)} value={String(v.number)}>
                      श्लोक {v.number}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
              return (
                <VerseCard
                  key={`${String(v.number)}-${index}`}
                  verse={v}
                  meaning={{
                    isAi: Boolean(comment?.ai),
                    explanation,
                    explanationIsHi,
                    science,
                    scienceIsHi,
                    lesson,
                    lessonIsHi,
                  }}
                  layers={{
                    translit: showTranslit,
                    hindi: showHindi,
                    english: showEnglish,
                    commentary: showCommentary,
                  }}
                  chapterId={chapterId}
                  category={category}
                  scriptureTitle={scriptureTitle ?? scriptureId}
                  chapterTitle={chapterTitle ?? `अध्याय ${chapterId}`}
                  chantingMode={chantingMode}
                  sanskritFontSizeClass={sanskritFontSizeClass}
                  bookmarked={Boolean(bookmarkedMap[String(v.number)])}
                  copied={copiedId === String(v.number)}
                  onToggleBookmark={() => toggleBookmark(v)}
                  onCopy={() => handleCopyVerse(v)}
                  onContribute={() => setContributeVerse(v)}
                  note={getNote(scriptureId, chapterId, v.number)?.text}
                  onSaveNote={(text) => setNote(scriptureId, chapterId, v.number, text)}
                  highlight={getHighlight(scriptureId, chapterId, v.number)?.color}
                  onHighlight={(color) => toggleHighlight(scriptureId, chapterId, v.number, color)}
                  onReciteFinish={(naturalEnd) => handleVerseReciteFinish(index, naturalEnd)}
                  onOpenFocus={() => {
                    setFocusVerseIndex(index);
                    setFocusModeOpen(true);
                  }}
                />
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

      {/* Fullscreen Mobile & Screen Focus Mode */}
      <MobileFocusMode
        isOpen={focusModeOpen}
        onClose={() => setFocusModeOpen(false)}
        verses={filteredVerses}
        initialVerseIndex={focusVerseIndex}
        scriptureId={scriptureId}
        scriptureTitle={scriptureTitle ?? scriptureId}
        chapterTitle={chapterTitle ?? `अध्याय ${chapterId}`}
        chapterId={chapterId}
        category={category}
        commentary={state.commentary}
        bookmarkedMap={bookmarkedMap}
        onToggleBookmark={(v) => toggleBookmark(v as FullVerse)}
        onVerseChange={(verseNum) => scrollToVerse(verseNum)}
      />
    </>
  );
}
