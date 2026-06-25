"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Trash2, ArrowRight, BookOpen, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookmarkedVerse {
  scriptureId: string;
  scriptureTitle: string;
  chapterId?: number;
  chapterTitle: string;
  verseId: number | string;
  sanskrit: string;
  translation: string;
  timestamp: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedVerse[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dharma.bookmarkedVerses");
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load bookmarks:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  function removeBookmark(scriptureId: string, verseId: number | string) {
    const updated = bookmarks.filter(
      (b) => !(b.scriptureId === scriptureId && b.verseId === verseId)
    );
    setBookmarks(updated);
    try {
      localStorage.setItem("dharma.bookmarkedVerses", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save bookmarks:", e);
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <header className="mb-10 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-saffron-700">
          Personal Sanctuary
        </p>
        <h1 className="mt-1 text-4xl font-serif font-bold text-dharma-text tracking-tight">
          Saved Verses & Reflections
        </h1>
        <p className="mt-2 text-sm text-dharma-muted max-w-xl">
          Your curated repository of sacred wisdom, reflections, and deep insights. Access your saved verses client-side anytime.
        </p>
      </header>

      {!isLoaded ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-saffron-200 border-t-saffron-600" />
        </div>
      ) : bookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-dharma-border bg-dharma-card p-12 text-center shadow-sm max-w-2xl mx-auto"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-saffron-100 text-saffron-600 mb-6">
            <Bookmark className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-serif font-bold text-dharma-text">
            Your sanctuary is empty
          </h2>
          <p className="mt-2 text-sm text-dharma-muted max-w-md mx-auto">
            Explore the ancient archives, open a scripture chapter, and click the bookmark button (Save) next to any verse to save it here.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/scriptures"
              className="inline-flex items-center gap-2 rounded-full bg-saffron-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-saffron-700 shadow-md"
            >
              <Compass className="h-4 w-4" />
              Browse Scriptures
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence>
            {bookmarks.map((bookmark) => {
              const chapterParam =
                bookmark.chapterId ?? bookmark.chapterTitle.trim().toLowerCase().replace(/\s+/g, "-");
              const targetUrl = `/scripture/${bookmark.scriptureId}/chapter/${chapterParam}?verse=${bookmark.verseId}`;
              
              return (
                <motion.article
                  key={`${bookmark.scriptureId}-${bookmark.verseId}`}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group relative rounded-2xl border border-dharma-border bg-dharma-card p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-saffron-700">
                          {bookmark.scriptureTitle}
                        </span>
                        <h3 className="text-base font-serif font-bold text-dharma-text leading-tight mt-0.5">
                          {bookmark.chapterTitle} • Verse {bookmark.verseId}
                        </h3>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeBookmark(bookmark.scriptureId, bookmark.verseId)}
                        className="p-2 rounded-lg text-dharma-muted hover:bg-red-50 hover:text-red-600 transition"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="rounded-xl bg-dharma-bg/60 p-4 border border-dharma-border mb-4">
                      <p lang="sa" className="font-devanagari text-lg leading-relaxed text-dharma-text whitespace-pre-line">
                        {bookmark.sanskrit}
                      </p>
                      <div className="w-8 h-px bg-saffron-300 my-3" />
                      <p className="text-sm leading-relaxed text-dharma-muted italic line-clamp-3">
                        {bookmark.translation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-dharma-border">
                    <span className="text-xs text-dharma-muted">
                      Saved {new Date(bookmark.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    
                    <Link
                      href={targetUrl}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-saffron-500/10 text-saffron-800 px-3.5 py-1.5 text-xs font-semibold hover:bg-saffron-600 hover:text-white transition"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Study Verse
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
