'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  FolderPlus,
  Highlighter,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ListenButton } from './ListenButton';
import { ShareVerseButton } from './ShareVerseButton';
import { AddToCollectionModal } from './AddToCollectionModal';
import { useStudyProgress, type VerseHighlight } from '@/lib/useStudyProgress';
import { triggerTactileFeedback } from '@/lib/haptics';

interface Props {
  scriptureId: string;
  scriptureTitle: string;
  chapterId: number;
  chapterTitle: string;
  verse: {
    number: number | string;
    sanskrit?: string;
    transliteration?: string;
    hindi?: string;
    translation?: string;
  };
}

interface SavedVerse {
  scriptureId: string;
  scriptureTitle: string;
  chapterId?: number;
  chapterTitle: string;
  verseId: number | string;
  sanskrit: string;
  translation: string;
  hindi?: string;
  timestamp: string;
}

const KEY = 'dharma.bookmarkedVerses';

const iconButton =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-dharma-border/70 bg-dharma-card/80 text-dharma-muted transition hover:border-saffron-300 hover:text-saffron-700';

type HighlightColor = VerseHighlight['color'];

const HIGHLIGHTS: Record<HighlightColor, { label: string; swatch: string }> = {
  saffron: { label: 'केसरिया', swatch: 'bg-saffron-500' },
  amber: { label: 'सुनहरा', swatch: 'bg-amber-400' },
  rose: { label: 'गुलाबी', swatch: 'bg-rose-500' },
  emerald: { label: 'हरा', swatch: 'bg-emerald-500' },
  indigo: { label: 'नीला', swatch: 'bg-indigo-500' },
};

function readSaved(): SavedVerse[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(parsed) ? (parsed as SavedVerse[]) : [];
  } catch {
    return [];
  }
}

/** Listen, copy, share, collection, and bookmark for a dedicated verse page. */
export function VersePageActions({
  scriptureId,
  scriptureTitle,
  chapterId,
  chapterTitle,
  verse,
}: Props) {
  const verseId = String(verse.number);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const { getHighlight, toggleHighlight } = useStudyProgress();
  const highlight = getHighlight(scriptureId, chapterId, verseId);

  useEffect(() => {
    setBookmarked(
      readSaved().some(
        (b) =>
          b.scriptureId === scriptureId &&
          b.chapterId === chapterId &&
          String(b.verseId) === verseId,
      ),
    );
  }, [scriptureId, chapterId, verseId]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [pickerOpen]);

  function toggleBookmark() {
    const list = readSaved();
    const saved = list.some(
      (b) =>
        b.scriptureId === scriptureId &&
        b.chapterId === chapterId &&
        String(b.verseId) === verseId,
    );
    const next = saved
      ? list.filter(
          (b) =>
            !(
              b.scriptureId === scriptureId &&
              b.chapterId === chapterId &&
              String(b.verseId) === verseId
            ),
        )
      : [
          {
            scriptureId,
            scriptureTitle,
            chapterId,
            chapterTitle,
            verseId: verse.number,
            sanskrit: verse.sanskrit ?? '',
            translation: verse.translation ?? verse.hindi ?? '',
            hindi: verse.hindi,
            timestamp: new Date().toISOString(),
          },
          ...list,
        ];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setBookmarked(!saved);
      triggerTactileFeedback(!saved ? 'success' : 'medium', !saved ? 'success' : 'softTap');
    } catch {
      // Private mode or a full store: the page still reads without the mark.
    }
  }

  async function copyVerse() {
    const parts = [
      verse.sanskrit,
      verse.transliteration,
      verse.hindi && `हिन्दी: ${verse.hindi}`,
      verse.translation && `English: ${verse.translation}`,
      `— ${scriptureTitle}, ${chapterTitle}, श्लोक ${verseId}`,
      window.location.href,
    ].filter(Boolean);
    const text = parts.join('\n\n');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('clipboard unavailable');
      }
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      if (!ok) return;
    }
    setCopied(true);
    triggerTactileFeedback('medium', 'click');
    window.setTimeout(() => setCopied(false), 2000);
  }

  const verseRefForCollection = {
    scriptureId,
    scriptureTitle,
    chapterId,
    chapterTitle,
    verseId: verse.number,
    sanskrit: verse.sanskrit ?? '',
    translation: verse.translation ?? verse.hindi ?? '',
  };

  return (
    <div
      className="order-last flex w-full items-center justify-end gap-1.5 sm:order-none sm:ml-auto sm:w-auto"
      role="toolbar"
      aria-label="श्लोक विकल्प"
    >
      <button
        type="button"
        onClick={toggleBookmark}
        className={`${iconButton} ${bookmarked ? '!border-saffron-400 !bg-saffron-50 !text-saffron-700 dark:!bg-saffron-900/30' : ''}`}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
        title={bookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
      >
        {bookmarked ? (
          <BookmarkCheck className="h-4 w-4 fill-saffron-500/25" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setCollectionModalOpen(true)}
        className={iconButton}
        aria-label="संग्रह में जोड़ें"
        title="संग्रह में जोड़ें"
      >
        <FolderPlus className="h-4 w-4" />
      </button>

      {/* Highlighter popover */}
      <div className="relative" ref={pickerRef}>
        <button
          type="button"
          onClick={() => setPickerOpen((o) => !o)}
          className={`${iconButton} ${highlight ? '!border-transparent !text-white ' + HIGHLIGHTS[highlight.color].swatch : ''}`}
          aria-expanded={pickerOpen}
          aria-haspopup="true"
          aria-label={highlight ? `हाइलाइट: ${HIGHLIGHTS[highlight.color].label}` : 'हाइलाइट करें'}
          title="हाइलाइट करें"
        >
          <Highlighter className="h-4 w-4" />
        </button>
        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 top-full z-30 mt-2 flex items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card p-1.5 shadow-xl"
            >
              {(Object.keys(HIGHLIGHTS) as HighlightColor[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    toggleHighlight(scriptureId, chapterId, verseId, c);
                    setPickerOpen(false);
                  }}
                  className={`h-6 w-6 rounded-full ${HIGHLIGHTS[c].swatch} transition hover:scale-110 ${
                    highlight?.color === c ? 'ring-2 ring-offset-2 ring-saffron-500' : ''
                  }`}
                  title={HIGHLIGHTS[c].label}
                />
              ))}
              {highlight && (
                <button
                  type="button"
                  onClick={() => {
                    toggleHighlight(scriptureId, chapterId, verseId, highlight.color);
                    setPickerOpen(false);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-dharma-border text-dharma-muted hover:text-dharma-text"
                  title="हाइलाइट हटाएं"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={copyVerse}
        className={`${iconButton} ${copied ? '!border-emerald-300 !text-emerald-600' : ''}`}
        aria-label={copied ? 'कॉपी हो गया' : 'उद्धरण सहित कॉपी करें'}
        title="कॉपी करें"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>

      <ListenButton sanskrit={verse.sanskrit} hindi={verse.hindi} translation={verse.translation} />

      <ShareVerseButton
        scriptureTitle={scriptureTitle}
        chapterTitle={chapterTitle}
        verseLabel={verseId}
        sanskrit={verse.sanskrit}
        transliteration={verse.transliteration}
        hindi={verse.hindi}
        translation={verse.translation}
      />

      <AddToCollectionModal
        open={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        verse={verseRefForCollection}
      />
    </div>
  );
}
