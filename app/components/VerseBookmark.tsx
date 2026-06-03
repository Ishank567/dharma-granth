'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, BookmarkCheck, Heart, X, Download } from 'lucide-react';

interface VerseBookmarkProps {
  verseId: string;
  scriptureId: string;
  chapterId: number;
  verseNumber: number;
  sanskrit?: string;
  hindi?: string;
  english?: string;
  className?: string;
}

interface BookmarkData {
  verseId: string;
  scriptureId: string;
  chapterId: number;
  verseNumber: number;
  sanskrit?: string;
  hindi?: string;
  english?: string;
  savedAt: string;
}

export function VerseBookmark({
  verseId,
  scriptureId,
  chapterId,
  verseNumber,
  sanskrit,
  hindi,
  english,
  className = ''
}: VerseBookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);

  useEffect(() => {
    // Load bookmark status
    const savedBookmarks = localStorage.getItem('verse-bookmarks');
    if (savedBookmarks) {
      const parsed = JSON.parse(savedBookmarks);
      setBookmarks(parsed);
      setIsBookmarked(parsed.some((b: BookmarkData) => b.verseId === verseId));
    }
  }, [verseId]);

  const toggleBookmark = () => {
    let newBookmarks: BookmarkData[];
    
    if (isBookmarked) {
      // Remove bookmark
      newBookmarks = bookmarks.filter(b => b.verseId !== verseId);
    } else {
      // Add bookmark
      const newBookmark: BookmarkData = {
        verseId,
        scriptureId,
        chapterId,
        verseNumber,
        sanskrit,
        hindi,
        english,
        savedAt: new Date().toISOString()
      };
      newBookmarks = [...bookmarks, newBookmark];
    }
    
    setBookmarks(newBookmarks);
    setIsBookmarked(!isBookmarked);
    localStorage.setItem('verse-bookmarks', JSON.stringify(newBookmarks));
    
    // Show tooltip
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const exportBookmarks = () => {
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dharma-granth-bookmarks.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={toggleBookmark}
        className={`relative p-2 rounded-xl transition-all ${
          isBookmarked
            ? 'bg-saffron-500/20 text-saffron-700 dark:text-saffron-400 border border-saffron-500/30'
            : 'bg-dharma-card text-dharma-muted hover:bg-saffron-500/10 hover:text-saffron-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-saffron-900/20 border border-dharma-border dark:border-gray-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this verse'}
      >
        <AnimatePresence mode="wait">
          {isBookmarked ? (
            <motion.div
              key="bookmarked"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <BookmarkCheck className="w-5 h-5 fill-current" />
            </motion.div>
          ) : (
            <motion.div
              key="not-bookmarked"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Bookmark className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-lg whitespace-nowrap z-50"
          >
            {isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookmark count badge */}
      {bookmarks.length > 0 && (
        <motion.div
          className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-saffron-500 to-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {bookmarks.length}
        </motion.div>
      )}
    </div>
  );
}

export function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('verse-bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const removeBookmark = (verseId: string) => {
    const newBookmarks = bookmarks.filter(b => b.verseId !== verseId);
    setBookmarks(newBookmarks);
    localStorage.setItem('verse-bookmarks', JSON.stringify(newBookmarks));
  };

  const clearAll = () => {
    setBookmarks([]);
    localStorage.removeItem('verse-bookmarks');
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl bg-dharma-card text-dharma-muted hover:bg-saffron-500/10 hover:text-saffron-600 border border-dharma-border transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="View bookmarks"
      >
        <Heart className="w-5 h-5" />
        {bookmarks.length > 0 && (
          <motion.div
            className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-saffron-500 to-amber-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {bookmarks.length}
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 border-b border-dharma-border dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-dharma-text dark:text-gray-100 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-saffron-600" />
                  Saved Verses ({bookmarks.length})
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {bookmarks.length === 0 ? (
                  <div className="text-center py-12 text-dharma-muted">
                    <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No bookmarks yet</p>
                    <p className="text-sm mt-1">Click the bookmark icon on any verse to save it</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookmarks.map((bookmark) => (
                      <motion.div
                        key={bookmark.verseId}
                        className="p-4 bg-gradient-to-br from-saffron-50 to-amber-50 dark:from-saffron-900/20 dark:to-amber-900/20 rounded-xl border border-saffron-200 dark:border-saffron-800"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-bold text-saffron-700 dark:text-saffron-400 uppercase tracking-wider">
                            {bookmark.scriptureId} · Chapter {bookmark.chapterId} · Verse {bookmark.verseNumber}
                          </span>
                          <button
                            onClick={() => removeBookmark(bookmark.verseId)}
                            className="p-1 rounded hover:bg-white dark:hover:bg-gray-800 transition-colors"
                          >
                            <X className="w-4 h-4 text-dharma-muted" />
                          </button>
                        </div>
                        {bookmark.sanskrit && (
                          <p className="font-devanagari text-saffron-800 dark:text-saffron-200 mb-1">{bookmark.sanskrit}</p>
                        )}
                        {bookmark.english && (
                          <p className="text-sm text-dharma-text dark:text-gray-200">{bookmark.english}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {bookmarks.length > 0 && (
                <div className="p-6 border-t border-dharma-border dark:border-gray-700 flex gap-3">
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(bookmarks, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'dharma-granth-bookmarks.json';
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-saffron-600 text-white rounded-lg font-semibold hover:bg-saffron-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export Bookmarks
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-dharma-text dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
