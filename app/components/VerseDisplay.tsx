'use client';

import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Atom,
  Bookmark,
  BookmarkCheck,
  Edit3,
  Feather,
  Heart,
  Languages,
  Lightbulb,
  List,
  Network,
  ScrollText,
  Sparkles,
  Sun,
} from 'lucide-react';
import { ContributeMeaningModal } from './ContributeMeaningModal';
import { VerseMindMap, type MindMapVerse } from './VerseMindMap';
import type { ScriptureCategory } from '@/data/types';
import { getVerseGraphicClass, getVerseGraphicStyle } from './verse-background';

export interface VerseDisplayData extends MindMapVerse {
  transliteration?: string;
}

type ViewMode = 'list' | 'mindmap';
type SwipeAction = 'like' | 'save' | null;

interface StoredVerse {
  scriptureId: string;
  scriptureTitle: string;
  chapterId?: number;
  chapterTitle: string;
  verseId: number | string;
  sanskrit: string;
  translation: string;
  timestamp?: string;
  likedAt?: string;
}

function loadStoredVerses(key: string): StoredVerse[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as StoredVerse[]) : [];
  } catch {
    return [];
  }
}

function verseMatches(
  verse: StoredVerse,
  scriptureId: string,
  chapterId: number,
  chapterTitle: string,
  verseId: number | string,
): boolean {
  return (
    verse.scriptureId === scriptureId &&
    String(verse.verseId) === String(verseId) &&
    (verse.chapterId === chapterId ||
      (verse.chapterId === undefined && verse.chapterTitle === chapterTitle))
  );
}

export function VerseDisplay({
  verse,
  scriptureId,
  scriptureTitle,
  chapterId,
  chapterTitle,
  category,
}: {
  verse: VerseDisplayData;
  scriptureId: string;
  scriptureTitle: string;
  chapterId: number;
  chapterTitle: string;
  category: ScriptureCategory;
}) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<ViewMode>('list');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [swipeAction, setSwipeAction] = useState<SwipeAction>(null);
  const [contributeOpen, setContributeOpen] = useState(false);

  const explanation = verse.explanationHi ?? verse.explanation;
  const explanationIsHi = Boolean(verse.explanationHi);
  const science = verse.scienceHi ?? verse.science;
  const scienceIsHi = Boolean(verse.scienceHi);
  const lesson = verse.lifeLessonHi ?? verse.lifeLesson;
  const lessonIsHi = Boolean(verse.lifeLessonHi);
  const verseLabel = verse.number ?? verse.id;
  const storedVerse: StoredVerse = {
    scriptureId,
    scriptureTitle,
    chapterId,
    chapterTitle,
    verseId: verse.id,
    sanskrit: verse.sanskrit,
    translation: verse.translation || '',
  };

  useEffect(() => {
    const bookmarks = loadStoredVerses('dharma.bookmarkedVerses');
    const likes = loadStoredVerses('dharma.likedVerses');

    setIsSaved(
      bookmarks.some((item) =>
        verseMatches(item, scriptureId, chapterId, chapterTitle, verse.id),
      ),
    );
    setIsLiked(
      likes.some((item) =>
        verseMatches(item, scriptureId, chapterId, chapterTitle, verse.id),
      ),
    );
  }, [chapterId, chapterTitle, scriptureId, verse.id]);

  function toggleStoredVerse(key: string, active: boolean, timestampKey: 'timestamp' | 'likedAt') {
    const current = loadStoredVerses(key);
    const next = active
      ? current.filter(
          (item) =>
            !verseMatches(item, scriptureId, chapterId, chapterTitle, verse.id),
        )
      : [...current, { ...storedVerse, [timestampKey]: new Date().toISOString() }];

    window.localStorage.setItem(key, JSON.stringify(next));
    return !active;
  }

  function toggleLike() {
    setIsLiked((active) => toggleStoredVerse('dharma.likedVerses', active, 'likedAt'));
  }

  function toggleSave() {
    setIsSaved((active) =>
      toggleStoredVerse('dharma.bookmarkedVerses', active, 'timestamp'),
    );
  }

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const momentum = info.offset.x + info.velocity.x * 0.12;

    if (momentum > 110) {
      setSwipeAction('like');
      if (!isLiked) toggleLike();
    } else if (momentum < -110) {
      setSwipeAction('save');
      if (!isSaved) toggleSave();
    }

    window.setTimeout(() => setSwipeAction(null), 900);
  }

  return (
    <motion.article
      className={`verse-card verse-modern-card lotus-card ${getVerseGraphicClass(category)}`}
      drag={reduce ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.14}
      onDragEnd={handleDragEnd}
      whileDrag={reduce ? undefined : { scale: 0.985, rotate: swipeAction === 'save' ? -1 : 1 }}
      aria-label={`Verse ${verseLabel}`}
      style={getVerseGraphicStyle({ category, verseId: verse.id })}
    >
      <AnimatePresence>
        {swipeAction && (
          <motion.div
            key={swipeAction}
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            className={`pointer-events-none absolute right-5 top-5 z-20 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg ${
              swipeAction === 'like'
                ? 'bg-rose-600 text-white'
                : 'bg-saffron-600 text-white'
            }`}
          >
            {swipeAction === 'like' ? 'Liked' : 'Saved'}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="verse-modern-header flex flex-col gap-4 border-b border-dharma-border px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="verse-number shadow-lg shadow-saffron-500/20">{verseLabel}</span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-saffron-800/70">
              {scriptureTitle}
            </div>
            <div className="text-sm font-bold text-dharma-text">
              {chapterTitle} · श्लोक {verseLabel}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleLike}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isLiked
                ? 'border-rose-300 bg-rose-100 text-rose-700 shadow-sm'
                : 'border-dharma-border bg-dharma-card/80 text-dharma-muted hover:border-rose-300 hover:text-rose-700'
            }`}
            aria-label={isLiked ? 'Unlike verse' : 'Like verse'}
            aria-pressed={isLiked}
            title={isLiked ? 'Liked' : 'Like'}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={toggleSave}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isSaved
                ? 'border-saffron-300 bg-saffron-100 text-saffron-800 shadow-sm'
                : 'border-dharma-border bg-dharma-card/80 text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
            }`}
            aria-label={isSaved ? 'Remove saved verse' : 'Save verse'}
            aria-pressed={isSaved}
            title={isSaved ? 'Saved' : 'Save'}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 fill-current" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>

          {/* Contribute meaning */}
          <button
            type="button"
            onClick={() => setContributeOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dharma-border bg-dharma-card/80 text-dharma-muted transition hover:border-saffron-300 hover:text-saffron-700"
            aria-label="Contribute or improve the meaning for this verse"
            title="Contribute / improve meaning (व्याख्या सुधारें)"
          >
            <Edit3 className="h-4 w-4" />
          </button>

          <div
            className="inline-flex items-center rounded-full border border-dharma-border bg-dharma-card/80 p-0.5 shadow-sm backdrop-blur"
            role="tablist"
            aria-label="Verse view mode"
          >
            <ToggleButton
              active={mode === 'list'}
              onClick={() => setMode('list')}
              icon={<List className="w-3.5 h-3.5" />}
              label="List"
            />
            <ToggleButton
              active={mode === 'mindmap'}
              onClick={() => setMode('mindmap')}
              icon={<Network className="w-3.5 h-3.5" />}
              label="Mind Map"
            />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <AnimatePresence mode="wait">
          {mode === 'list' ? (
            <motion.div
              key="list"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="verse-section section-sanskrit">
                <div className="section-label text-saffron-800">
                  <Feather className="w-3.5 h-3.5" />
                  संस्कृत
                </div>
                <p className="sanskrit-text text-dharma-text whitespace-pre-line">{verse.sanskrit}</p>
              </div>

              {verse.transliteration && (
                <div className="verse-section section-translit">
                  <div className="section-label text-stone-700">
                    <Languages className="w-3.5 h-3.5" />
                    लिप्यंतरण (IAST)
                  </div>
                  <p className="text-sm md:text-base text-stone-700 italic whitespace-pre-line leading-relaxed">{verse.transliteration}</p>
                </div>
              )}

              {verse.hindi && (
                <div className="verse-section section-hindi">
                  <div className="section-label text-rose-800">
                    <Sun className="w-3.5 h-3.5" />
                    हिन्दी अर्थ
                  </div>
                  <p className="text-base md:text-lg text-rose-950 leading-loose">{verse.hindi}</p>
                </div>
              )}

              {verse.translation && (
                <div className="verse-section section-translation">
                  <div className="section-label text-blue-800">
                    <ScrollText className="w-3.5 h-3.5" />
                    अनुवाद
                  </div>
                  <p className="text-base text-dharma-text leading-relaxed">{verse.translation}</p>
                </div>
              )}

              {explanation && (
                <div className="verse-section section-explanation">
                  <div className="section-label text-emerald-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    {explanationIsHi ? 'आध्यात्मिक व्याख्या' : 'अंग्रेज़ी व्याख्या'}
                  </div>
                  <p className={`text-sm md:text-base text-emerald-950 leading-relaxed ${explanationIsHi ? 'font-devanagari' : ''}`}>{explanation}</p>
                </div>
              )}

              {science && (
                <div className="verse-section section-science">
                  <div className="section-label text-indigo-800">
                    <Atom className="w-3.5 h-3.5" />
                    {scienceIsHi ? 'वैज्ञानिक दृष्टिकोण' : 'अंग्रेज़ी वैज्ञानिक दृष्टिकोण'}
                  </div>
                  <p className={`text-sm md:text-base text-indigo-950 leading-relaxed ${scienceIsHi ? 'font-devanagari' : ''}`}>{science}</p>
                </div>
              )}

              {lesson && (
                <div className="verse-section section-lesson">
                  <div className="section-label text-amber-800">
                    <Lightbulb className="w-3.5 h-3.5" />
                    {lessonIsHi ? 'जीवन की सीख — आज अपनाएँ' : 'अंग्रेज़ी जीवन की सीख'}
                  </div>
                  <p className={`text-sm md:text-base text-amber-950 leading-relaxed font-medium ${lessonIsHi ? 'font-devanagari' : ''}`}>{lesson}</p>
                </div>
              )}

              {verse.keywords && verse.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {verse.keywords.map((k) => (
                    <span key={k} className="chip chip-saffron">
                      #{k}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="mindmap"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <VerseMindMap verse={verse} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ContributeMeaningModal
        open={contributeOpen}
        onClose={() => setContributeOpen(false)}
        scriptureId={scriptureId}
        chapterId={chapterId}
        verseId={verse.id}
        sanskrit={verse.sanskrit}
        scriptureTitle={scriptureTitle}
        chapterTitle={chapterTitle}
        current={{
          explanation: explanation,
          science: science,
          lifeLesson: lesson,
          hindi: verse.hindi,
          translation: verse.translation,
        }}
      />
    </motion.article>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
        active ? 'text-white' : 'text-dharma-muted hover:text-dharma-text'
      }`}
      role="tab"
      aria-selected={active}
    >
      {active && (
        <motion.span
          layoutId="verse-view-toggle-pill"
          className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 shadow-md"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative inline-flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </button>
  );
}
