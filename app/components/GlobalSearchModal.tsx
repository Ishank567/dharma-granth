'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import {
  BookOpen,
  Compass,
  FileText,
  MapPin,
  Search,
  Sparkles,
  User,
  X,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { scriptureCatalog } from '@/data/scripture-meta';
import { concepts } from '@/data/concepts';
import { topics } from '@/data/topics';
import { characters } from '@/data/characters';
import { sacredLocations } from '@/data/locations';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'scripture' | 'concept' | 'topic' | 'character' | 'location';
  categoryLabel: string;
  href: string;
  description?: string;
  extra?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Build searchable index
  const allItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // Scriptures (65 items)
    for (const s of scriptureCatalog) {
      items.push({
        id: `scripture-${s.id}`,
        title: s.title,
        subtitle: s.titleSanskrit,
        category: 'scripture',
        categoryLabel: 'ग्रंथ · Scripture',
        href: `/scripture/${s.id}`,
        description: s.description,
        extra: `${s.totalChapters} ch · ${s.totalVerses} verses`,
      });
    }

    // Concepts
    for (const c of concepts) {
      items.push({
        id: `concept-${c.id}`,
        title: c.label,
        subtitle: `${c.sanskrit} (${c.transliteration})`,
        category: 'concept',
        categoryLabel: 'अवधारणा · Concept',
        href: `/concepts`,
        description: c.shortDesc,
      });
    }

    // Topics
    for (const t of topics) {
      items.push({
        id: `topic-${t.id}`,
        title: t.title,
        subtitle: t.sanskrit,
        category: 'topic',
        categoryLabel: 'विषय · Topic',
        href: `/topics/${t.id}`,
        description: t.shortDesc,
      });
    }

    // Characters
    for (const ch of characters) {
      items.push({
        id: `character-${ch.id}`,
        title: ch.name,
        subtitle: ch.sanskrit,
        category: 'character',
        categoryLabel: 'पात्र · Character',
        href: `/characters`,
        description: ch.shortDesc,
      });
    }

    // Locations
    for (const loc of sacredLocations) {
      items.push({
        id: `location-${loc.id}`,
        title: loc.name,
        subtitle: loc.sanskrit,
        category: 'location',
        categoryLabel: 'स्थान · Location',
        href: `/locations`,
        description: loc.shortDesc,
      });
    }

    return items;
  }, []);

  // Filter results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default recommended / popular items
      return allItems.filter((item) =>
        [
          'scripture-bhagavadgita',
          'scripture-ishavasya',
          'scripture-durgasaptashati',
          'scripture-shivpurana',
          'concept-dharma',
          'concept-karma',
          'concept-moksha',
          'topic-meditation',
        ].includes(item.id),
      );
    }

    return allItems
      .filter((item) => {
        const text = `${item.title} ${item.subtitle || ''} ${item.description || ''} ${item.extra || ''}`.toLowerCase();
        return text.includes(q);
      })
      .slice(0, 12);
  }, [allItems, query]);

  // Keep selection in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[selectedIndex];
      if (target) {
        router.push(target.href);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'scripture':
        return <BookOpen className="h-4 w-4 text-amber-600" />;
      case 'concept':
        return <Sparkles className="h-4 w-4 text-indigo-600" />;
      case 'topic':
        return <Compass className="h-4 w-4 text-emerald-600" />;
      case 'character':
        return <User className="h-4 w-4 text-rose-600" />;
      case 'location':
        return <MapPin className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-saffron-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20"
        role="dialog"
        aria-modal="true"
        aria-label="Global Search"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.15 }}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-dharma-border/80 bg-dharma-card shadow-2xl"
          onKeyDown={handleKeyDown}
        >
          {/* Search Input Bar */}
          <div className="flex items-center border-b border-dharma-border/80 px-4 py-3.5">
            <Search className="mr-3 h-5 w-5 shrink-0 text-saffron-600" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scriptures, Gita, Upanishads, karma, meditation…"
              className="min-w-0 flex-1 bg-transparent text-base text-dharma-text placeholder:text-dharma-muted/70 outline-none"
              aria-autocomplete="list"
              aria-controls="search-results-list"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="rounded-lg p-1 text-dharma-muted hover:text-dharma-text"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden rounded border border-dharma-border bg-dharma-bg px-2 py-0.5 text-[11px] font-medium text-dharma-muted sm:inline-block">
                ESC
              </kbd>
            )}
          </div>

          {/* Results List */}
          <div
            id="search-results-list"
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto p-2 sm:p-3"
            role="listbox"
          >
            {!query.trim() && (
              <div className="mb-2 px-3 pt-2 text-[11px] font-bold uppercase tracking-wider text-dharma-muted flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-saffron-600" /> लोकप्रिय खोजें · Recommended
              </div>
            )}

            {results.length === 0 ? (
              <div className="p-8 text-center text-sm text-dharma-muted">
                कोई परिणाम नहीं मिला। कृपया दूसरा शब्द खोजें।
                <div className="mt-2 text-xs opacity-75">
                  Try searching by Sanskrit name, author, topic, or concept.
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        router.push(item.href);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`group flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-3 transition-colors ${
                        isSelected
                          ? 'bg-saffron-50 text-saffron-950 dark:bg-saffron-900/25 dark:text-saffron-100'
                          : 'text-dharma-text hover:bg-dharma-bg'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dharma-border/60 ${
                            isSelected ? 'bg-white shadow-sm dark:bg-stone-800' : 'bg-dharma-bg'
                          }`}
                        >
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-bold text-dharma-text">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className="truncate text-xs font-devanagari text-dharma-muted">
                                {item.subtitle}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="truncate text-xs text-dharma-muted">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full border border-dharma-border/60 bg-dharma-bg/80 px-2 py-0.5 text-[10px] font-semibold text-dharma-muted">
                          {item.categoryLabel}
                        </span>
                        <ArrowRight
                          className={`h-4 w-4 text-saffron-600 transition-transform ${
                            isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between border-t border-dharma-border/80 bg-dharma-bg/50 px-4 py-2.5 text-[11px] text-dharma-muted">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="rounded border border-dharma-border bg-dharma-card px-1.5 py-0.5 font-mono">
                  ↑↓
                </kbd>{' '}
                Navigate
              </span>
              <span>
                <kbd className="rounded border border-dharma-border bg-dharma-card px-1.5 py-0.5 font-mono">
                  ↵
                </kbd>{' '}
                Open
              </span>
            </div>
            <div className="text-right">
              {results.length} परिणाम · Dharma Granth Library
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
