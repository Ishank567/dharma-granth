'use client';

import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { readSavedConcepts, toggleSavedConcept } from '@/lib/saved-concepts';

/** Saves a concept to the reader's study desk. Stored only in this browser. */
export function SaveConceptButton({ conceptId, label }: { conceptId: string; label: string }) {
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => setSaved(readSavedConcepts().includes(conceptId)), [conceptId]);
  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => {
          const next = toggleSavedConcept(conceptId);
          if (next === null) return setMsg('Your browser blocked storage, so the concept was not saved.');
          setSaved(next.includes(conceptId));
          setMsg(next.includes(conceptId) ? `${label} saved to your study desk.` : `${label} removed from saved concepts.`);
        }}
        className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 text-sm font-semibold text-dharma-text hover:border-saffron-400"
      >
        {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
        {saved ? 'Saved concept' : 'Save concept'}
      </button>
      <span role="status" aria-live="polite" className="min-h-[1.25rem] text-sm text-dharma-muted">{msg}</span>
    </span>
  );
}
