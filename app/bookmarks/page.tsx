"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  Trash2,
  ArrowRight,
  BookOpen,
  Compass,
  Copy,
  Check,
  Download,
  Search,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ListenButton } from "@/app/components/ListenButton";

interface BookmarkedVerse {
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

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedVerse[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleCopy = async (b: BookmarkedVerse) => {
    try {
      const parts = [
        b.sanskrit,
        b.hindi ? `हिन्दी: ${b.hindi}` : null,
        b.translation ? `English: ${b.translation}` : null,
        `— ${b.scriptureTitle}, ${b.chapterTitle}, Verse ${b.verseId}`,
      ].filter(Boolean);

      await navigator.clipboard.writeText(parts.join("\n\n"));
      const key = `${b.scriptureId}-${b.verseId}`;
      setCopiedId(key);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const exportBookmarks = () => {
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dharma-granth-bookmarks-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredBookmarks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return bookmarks;
    return bookmarks.filter((b) => {
      const haystack = `${b.scriptureTitle} ${b.chapterTitle} ${b.sanskrit} ${b.translation} ${b.hindi || ""} ${b.verseId}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [bookmarks, searchQuery]);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-saffron-700">
            Personal Sanctuary · स्वाध्याय संग्रह
          </p>
          <h1 className="mt-1 text-4xl font-serif font-bold text-dharma-text tracking-tight">
            Saved Verses & Reflections
          </h1>
          <p className="mt-2 text-sm text-dharma-muted max-w-xl leading-relaxed">
            Your client-side repository of sacred wisdom and reflections. Verses bookmarked in any chapter appear here instantly.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={exportBookmarks}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dharma-border bg-dharma-card text-xs font-semibold text-dharma-text hover:border-saffron-300 hover:text-saffron-700 transition shadow-sm"
              title="Export bookmarks as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON ({bookmarks.length})</span>
            </button>
          </div>
        )}
      </header>

      {/* Search Bar for Bookmarks */}
      {bookmarks.length > 0 && (
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dharma-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved verses by scripture, keyword, or Sanskrit..."
              className="w-full rounded-2xl border border-dharma-border bg-dharma-card pl-10 pr-9 py-2.5 text-xs md:text-sm text-dharma-text placeholder:text-dharma-muted/70 outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-dharma-muted hover:text-dharma-text"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

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
          <p className="mt-2 text-sm text-dharma-muted max-w-md mx-auto leading-relaxed">
            Explore the ancient archives, open any chapter, and click the &ldquo;सहेजें (Save)&rdquo; bookmark button next to any verse to preserve it here.
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
      ) : filteredBookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-dharma-border bg-dharma-card p-12 text-center max-w-xl mx-auto">
          <p className="text-sm font-semibold text-dharma-text mb-1">
            No bookmarks matching &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-dharma-muted mb-4">
            Try searching for a different scripture name or term.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-50 text-saffron-800 text-xs font-semibold hover:bg-saffron-100"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence>
            {filteredBookmarks.map((bookmark) => {
              const chapterParam =
                bookmark.chapterId ??
                bookmark.chapterTitle.trim().toLowerCase().replace(/\s+/g, "-");
              const targetUrl = `/scripture/${bookmark.scriptureId}/chapter/${chapterParam}?verse=${bookmark.verseId}#verse-${bookmark.verseId}`;
              const key = `${bookmark.scriptureId}-${bookmark.verseId}`;

              return (
                <motion.article
                  key={key}
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

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(bookmark)}
                          className="p-1.5 rounded-lg text-dharma-muted hover:bg-saffron-50 hover:text-saffron-700 transition"
                          title="Copy verse"
                          aria-label="Copy verse"
                        >
                          {copiedId === key ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <ListenButton
                          compact
                          sanskrit={bookmark.sanskrit}
                          hindi={bookmark.hindi}
                          translation={bookmark.translation}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeBookmark(bookmark.scriptureId, bookmark.verseId)
                          }
                          className="p-1.5 rounded-lg text-dharma-muted hover:bg-red-50 hover:text-red-600 transition"
                          title="Remove bookmark"
                          aria-label="Remove bookmark"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl bg-dharma-bg/60 p-4 border border-dharma-border mb-4">
                      <p
                        lang="sa"
                        className="font-devanagari text-lg leading-relaxed text-dharma-text whitespace-pre-line"
                      >
                        {bookmark.sanskrit}
                      </p>
                      <div className="w-8 h-px bg-saffron-300 my-3" />
                      {bookmark.hindi && (
                        <p className="text-xs md:text-sm leading-relaxed text-rose-950 font-sans mb-2">
                          <span className="font-semibold text-rose-800">हिन्दी: </span>
                          {bookmark.hindi}
                        </p>
                      )}
                      {bookmark.translation && (
                        <p className="text-xs md:text-sm leading-relaxed text-dharma-muted italic line-clamp-3">
                          {bookmark.translation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-dharma-border">
                    <span className="text-xs text-dharma-muted">
                      Saved{" "}
                      {new Date(bookmark.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
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
