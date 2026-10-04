'use client';

import { useState, useRef, useEffect } from 'react';
import { StickyNote, Edit3, Trash2, Check, Sparkles } from 'lucide-react';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { triggerTactileFeedback } from '@/lib/haptics';

interface Props {
  scriptureId: string;
  chapterId: number;
  verseId: string | number;
}

export function VerseStudyNotes({ scriptureId, chapterId, verseId }: Props) {
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { getNote, setNote } = useStudyProgress();
  const vIdStr = String(verseId);
  const savedNote = mounted ? getNote(scriptureId, chapterId, vIdStr) : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  const openEditor = () => {
    setDraft(savedNote?.text ?? '');
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 80);
  };

  const handleSave = () => {
    setNote(scriptureId, chapterId, vIdStr, draft.trim());
    triggerTactileFeedback('success', 'softTap');
    setEditing(false);
  };

  const handleDelete = () => {
    setNote(scriptureId, chapterId, vIdStr, '');
    triggerTactileFeedback('medium', 'softTap');
    setEditing(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-6">
      {editing ? (
        <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50/50 p-4 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <StickyNote className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              <span>व्यक्तिगत स्वाध्याय टिप्पणी (Personal Study Note)</span>
            </span>
            <span className="text-[11px] text-dharma-muted">{draft.length}/2000 अक्षर</span>
          </div>

          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="इस श्लोक से क्या सीख मिली? अपने विचार, अनुभव या संकल्प यहाँ लिखें..."
            rows={3}
            maxLength={2000}
            className="w-full rounded-xl border border-indigo-200 bg-white p-3 text-sm text-dharma-text placeholder:text-dharma-muted/60 focus:border-indigo-400 focus:outline-none dark:border-indigo-800 dark:bg-dharma-card"
          />

          <div className="mt-3 flex items-center justify-between">
            {savedNote?.text ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>हटाएं</span>
              </button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border border-dharma-border bg-dharma-card px-3 py-1.5 text-xs font-medium text-dharma-text hover:bg-dharma-border/30"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>सुरक्षित करें</span>
              </button>
            </div>
          </div>
        </div>
      ) : savedNote?.text ? (
        <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/40 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <StickyNote className="h-4 w-4 text-indigo-600" aria-hidden="true" />
              <span>मेरी स्वाध्याय टिप्पणी (My Study Note)</span>
            </span>
            <button
              type="button"
              onClick={openEditor}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>संपादित करें</span>
            </button>
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-dharma-text">
            {savedNote.text}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={openEditor}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-dharma-border px-4 py-2.5 text-xs font-semibold text-dharma-muted transition hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-700 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-300"
        >
          <StickyNote className="h-4 w-4 text-indigo-500" aria-hidden="true" />
          <span>इस श्लोक पर अपनी व्यक्तिगत स्वाध्याय टिप्पणी लिखें</span>
          <Sparkles className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
