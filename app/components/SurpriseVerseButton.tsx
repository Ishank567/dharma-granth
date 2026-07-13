'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Dices, Loader2 } from 'lucide-react';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

interface ChapterIndexEntry {
  id: number;
  verseCount: number;
}

/**
 * "Surprise me" — opens a random chapter from anywhere in the library, using
 * the lightweight chapters index so no scripture text is downloaded up front.
 */
export function SurpriseVerseButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function go() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`${BASE_PATH}/data/chapters.json`, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const index = (await res.json()) as Record<string, ChapterIndexEntry[]>;
      const ids = Object.keys(index).filter((k) => (index[k]?.length ?? 0) > 0);
      if (ids.length === 0) return;
      const scriptureId = ids[Math.floor(Math.random() * ids.length)];
      const withVerses = index[scriptureId].filter((c) => c.verseCount > 0);
      const pool = withVerses.length > 0 ? withVerses : index[scriptureId];
      const chapter = pool[Math.floor(Math.random() * pool.length)];
      router.push(`/scripture/${scriptureId}/chapter/${chapter.id}/`);
    } catch {
      // Offline or index missing — stay where we are.
      setBusy(false);
    }
    // Deliberately leave `busy` true on success: the spinner runs until the
    // route change unmounts this button, avoiding a double-tap window.
  }

  return (
    <motion.button
      type="button"
      onClick={go}
      whileTap={{ scale: 0.96 }}
      className={
        className ||
        'inline-flex items-center gap-2.5 rounded-full border-2 border-white/30 bg-white/20 px-8 py-4 font-semibold text-white shadow-xl backdrop-blur-md transition-all hover:bg-white/30 md:px-10 md:py-5'
      }
      aria-label="Open a random chapter from the library"
    >
      {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Dices className="h-5 w-5" />}
      कोई भी श्लोक
    </motion.button>
  );
}
