'use client';

import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Clock,
  Compass,
  FileText,
  Flame,
  Languages,
  MapPin,
  ScrollText,
  Search,
  Sparkles,
  Sun,
  User,
  X,
} from 'lucide-react';
import {
  SEARCH_CATEGORIES,
  getSearchIndex,
  isChapterIndexLoaded,
  loadChapterIndex,
  normalizeForSearch,
  searchIndex,
  type ChapterIndex,
  type SearchCategory,
  type SearchResultItem,
} from '@/lib/search';
import { useLocalStorage } from '@/lib/useLocalStorage';

export type { SearchResultItem } from '@/lib/search';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Prefills the search box when the modal opens (e.g. from the home hero). */
  initialQuery?: string;
}

const RECOMMENDED_IDS = [
  'scripture-bhagavadgita',
  'scripture-ishavasya',
  'scripture-durgasaptashati',
  'scripture-shivpurana',
  'concept-dharma',
  'concept-karma',
  'concept-moksha',
  'topic-meditation',
  'dict-dharma',
  'pathway-gita-intro',
];

const RECENT_KEY = 'dharma-search-recent';
const MAX_RECENT = 5;
const RESULT_LIMIT = 30;

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Shared across modal opens; a failed fetch is forgotten so the next open retries.
let chapterIndexRequest: Promise<void> | null = null;

function ensureChapterIndex(): Promise<void> {
  if (isChapterIndexLoaded()) return Promise.resolve();
  if (!chapterIndexRequest) {
    chapterIndexRequest = fetch(`${BASE_PATH}/chapter-index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`chapter index: HTTP ${res.status}`);
        return res.json() as Promise<ChapterIndex>;
      })
      .then(loadChapterIndex)
      .catch((err) => {
        chapterIndexRequest = null;
        // Search still works without chapter titles, so don't surface this.
        console.warn('[search] chapter index unavailable:', err);
      });
  }
  return chapterIndexRequest;
}

function isStoredItem(value: unknown): value is SearchResultItem {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<SearchResultItem>;
  return (
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    typeof v.href === 'string' &&
    // Same-site paths only (not "//host" or "javascript:"), since this is
    // read back from localStorage and rendered as a link.
    /^\/(?!\/)/.test(v.href) &&
    typeof v.category === 'string' &&
    typeof v.categoryLabel === 'string'
  );
}

interface Section {
  label: ReactNode;
  items: SearchResultItem[];
}

function getCategoryIcon(category: SearchCategory) {
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
    case 'dictionary':
      return <Languages className="h-4 w-4 text-teal-600" />;
    case 'festival':
      return <Flame className="h-4 w-4 text-orange-600" />;
    case 'ritual':
      return <Sun className="h-4 w-4 text-amber-600" />;
    case 'pathway':
      return <ScrollText className="h-4 w-4 text-purple-600" />;
    case 'chapter':
      return <BookMarked className="h-4 w-4 text-saffron-700" />;
    default:
      return <FileText className="h-4 w-4 text-saffron-600" />;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Wrap literal (case-insensitive) occurrences of the query tokens in <mark>. */
function highlight(text: string, tokens: string[]): ReactNode {
  if (tokens.length === 0) return text;
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(pattern);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-saffron-200/70 px-0.5 text-inherit dark:bg-saffron-700/40">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function GlobalSearchModal({ isOpen, onClose, initialQuery = '' }: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [storedRecent, setRecent] = useLocalStorage<Array<string | SearchResultItem>>(
    RECENT_KEY,
    [],
  );
  const [chaptersReady, setChaptersReady] = useState(isChapterIndexLoaded);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen || chaptersReady) return;
    let cancelled = false;
    ensureChapterIndex().then(() => {
      if (!cancelled && isChapterIndexLoaded()) setChaptersReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, chaptersReady]);

  // Reset (to any prefilled query) and focus on open
  useEffect(() => {
    if (!isOpen) return;
    setQuery(initialQuery);
    setCategory(null);
    setSelectedIndex(0);
    const t = setTimeout(() => {
      const input = inputRef.current;
      if (!input) return;
      input.focus();
      // Caret at the end so a prefilled query can be refined straight away.
      input.setSelectionRange(input.value.length, input.value.length);
    }, 50);
    return () => clearTimeout(t);
  }, [isOpen, initialQuery]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const byId = useMemo(() => new Map(getSearchIndex().map((item) => [item.id, item])), []);
  const trimmed = query.trim();
  const tokens = useMemo(() => {
    const q = normalizeForSearch(query);
    return q ? q.split(' ') : [];
  }, [query]);

  const search = useMemo(
    () => (trimmed ? searchIndex(trimmed, { category, limit: RESULT_LIMIT }) : null),
    // chaptersReady re-runs the search once chapter titles arrive.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trimmed, category, chaptersReady],
  );

  const sections: Section[] = useMemo(() => {
    if (search) return [{ label: null, items: search.results }];

    const recent = (Array.isArray(storedRecent) ? storedRecent : [])
      .map((entry) =>
        // Older versions stored ids only; chapters aren't in byId, so new
        // entries keep the whole item.
        typeof entry === 'string' ? byId.get(entry) : isStoredItem(entry) ? entry : undefined,
      )
      .filter((item): item is SearchResultItem => Boolean(item));
    const recentSet = new Set(recent.map((item) => item.id));
    const recommended = RECOMMENDED_IDS.filter((id) => !recentSet.has(id))
      .map((id) => byId.get(id))
      .filter((item): item is SearchResultItem => Boolean(item));

    const out: Section[] = [];
    if (recent.length > 0) {
      out.push({
        label: (
          <>
            <Clock className="h-3.5 w-3.5 text-saffron-600" /> हाल में देखे · Recent
          </>
        ),
        items: recent,
      });
    }
    out.push({
      label: (
        <>
          <Flame className="h-3.5 w-3.5 text-saffron-600" /> लोकप्रिय खोजें · Recommended
        </>
      ),
      items: recommended,
    });
    return out;
  }, [search, storedRecent, byId]);

  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  // Reset selection whenever the result set changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [flat]);

  // Keep the keyboard selection visible
  useEffect(() => {
    if (!isOpen) return;
    document
      .getElementById(`search-option-${selectedIndex}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, isOpen]);

  const remember = (item: SearchResultItem) => {
    setRecent((prev) =>
      [
        item,
        ...(Array.isArray(prev) ? prev : []).filter(
          (entry) => (typeof entry === 'string' ? entry : entry?.id) !== item.id,
        ),
      ].slice(0, MAX_RECENT),
    );
  };

  const openItem = (item: SearchResultItem) => {
    remember(item);
    router.push(item.href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (flat.length ? (prev + 1) % flat.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (flat.length ? (prev - 1 + flat.length) % flat.length : 0));
    } else if (e.key === 'Enter') {
      const target = flat[selectedIndex];
      if (target) {
        e.preventDefault();
        openItem(target);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const counts = search?.categoryCounts ?? {};
  const totalAcrossCategories = Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0);
  const chipClass = (active: boolean) =>
    `shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition ${
      active
        ? 'border-saffron-600 bg-saffron-600 text-white'
        : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
    }`;

  let optionIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="global-search"
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
              <Search className="mr-3 h-5 w-5 shrink-0 text-saffron-600" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search scriptures, Gita, Upanishads, karma, meditation…"
                className="min-w-0 flex-1 bg-transparent text-base text-dharma-text placeholder:text-dharma-muted/70 outline-none"
                role="combobox"
                aria-expanded={flat.length > 0}
                aria-autocomplete="list"
                aria-controls="search-results-list"
                aria-activedescendant={flat.length ? `search-option-${selectedIndex}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="rounded-lg p-1 text-dharma-muted hover:text-dharma-text"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="hidden rounded border border-dharma-border bg-dharma-bg px-2 py-0.5 text-[11px] font-medium text-dharma-muted hover:text-dharma-text sm:inline-block"
                  aria-label="Close search"
                >
                  ESC
                </button>
              )}
            </div>

            {/* Category filters (only while searching) */}
            {search && totalAcrossCategories > 0 && (
              <div
                className="flex gap-1.5 overflow-x-auto border-b border-dharma-border/60 px-3 py-2"
                role="group"
                aria-label="Filter by category"
              >
                <button
                  type="button"
                  className={chipClass(category === null)}
                  onClick={() => setCategory(null)}
                  aria-pressed={category === null}
                >
                  सभी · All {totalAcrossCategories}
                </button>
                {SEARCH_CATEGORIES.filter((c) => (counts[c.id] ?? 0) > 0).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={chipClass(category === c.id)}
                    onClick={() => setCategory((prev) => (prev === c.id ? null : c.id))}
                    aria-pressed={category === c.id}
                  >
                    {c.label} {counts[c.id]}
                  </button>
                ))}
              </div>
            )}

            {/* Results List */}
            <div
              id="search-results-list"
              className="max-h-[60vh] overflow-y-auto p-2 sm:p-3"
              role="listbox"
              aria-label="Search results"
            >
              {flat.length === 0 ? (
                <div className="p-8 text-center text-sm text-dharma-muted">
                  कोई परिणाम नहीं मिला। कृपया दूसरा शब्द खोजें।
                  <div className="mt-2 text-xs opacity-75">
                    Try a Sanskrit name, author, topic, or concept.
                  </div>
                  {trimmed && (
                    <Link
                      href={`/scriptures?q=${encodeURIComponent(trimmed)}`}
                      onClick={onClose}
                      className="mt-4 inline-flex items-center gap-1 rounded-full border border-saffron-300 px-3 py-1.5 text-xs font-semibold text-saffron-700 hover:bg-saffron-50 dark:hover:bg-saffron-900/20"
                    >
                      ग्रंथालय में खोजें · Search the library <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              ) : (
                sections.map((section, sIdx) => (
                  <div key={sIdx} className={sIdx > 0 ? 'mt-3' : undefined}>
                    {section.label && (
                      <div className="mb-2 flex items-center gap-1.5 px-3 pt-2 text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                        {section.label}
                      </div>
                    )}
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        optionIndex += 1;
                        const idx = optionIndex;
                        const isSelected = idx === selectedIndex;
                        return (
                          <Link
                            key={`${sIdx}-${item.id}`}
                            id={`search-option-${idx}`}
                            href={item.href}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={-1}
                            onClick={(e) => {
                              remember(item);
                              // Let modified clicks open a new tab without closing search
                              if (!(e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) onClose();
                            }}
                            onMouseMove={() => {
                              if (!isSelected) setSelectedIndex(idx);
                            }}
                            className={`group flex items-center justify-between rounded-xl px-3.5 py-3 transition-colors ${
                              isSelected
                                ? 'bg-saffron-50 text-saffron-900 dark:bg-saffron-900/25 dark:text-saffron-100'
                                : 'text-dharma-text hover:bg-dharma-bg'
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3 pr-2">
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
                                    {highlight(item.title, tokens)}
                                  </span>
                                  {item.subtitle && (
                                    <span lang="hi" className="truncate font-devanagari text-xs text-dharma-muted">
                                      {highlight(item.subtitle, tokens)}
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
                              <span className="hidden rounded-full border border-dharma-border/60 bg-dharma-bg/80 px-2 py-0.5 text-[10px] font-semibold text-dharma-muted sm:inline">
                                {item.categoryLabel}
                              </span>
                              <ArrowRight
                                className={`h-4 w-4 text-saffron-600 transition-transform ${
                                  isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-0'
                                }`}
                                aria-hidden="true"
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Shortcuts */}
            <div className="flex items-center justify-between border-t border-dharma-border/80 bg-dharma-bg/50 px-4 py-2.5 text-[11px] text-dharma-muted">
              <div className="hidden items-center gap-3 sm:flex">
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
              <div className="ml-auto text-right" aria-live="polite">
                {search
                  ? `${search.totalMatches} परिणाम${
                      search.totalMatches > RESULT_LIMIT ? ` · top ${RESULT_LIMIT}` : ''
                    }`
                  : 'Dharma Granth Library'}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
