'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  Flame,
  Heart,
  Music,
  Scale,
  Scroll,
  Search,
  Sparkles,
  TreePine,
  WandSparkles,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { ScriptureCategory, ScriptureMeta } from '@/data/types';
import type { BookExplanation } from '@/data/book-explanations';
import { ScriptureCard } from '@/app/components/motion/ScriptureCard';
import { FadeUpOnView, Stagger, StaggerItem } from '@/app/components/motion/primitives';

type CategoryOption = {
  id: ScriptureCategory;
  label: string;
  description: string;
};

type LibraryItem = ScriptureMeta & {
  explanation?: BookExplanation;
};

type CategoryFilter = 'all' | ScriptureCategory;
type SortMode = 'featured' | 'az' | 'verses';

const categoryIcons: Record<ScriptureCategory, ReactNode> = {
  veda: <Flame className="h-5 w-5" />,
  upanishad: <BookOpen className="h-5 w-5" />,
  itihasa: <Scroll className="h-5 w-5" />,
  purana: <TreePine className="h-5 w-5" />,
  smriti: <Scale className="h-5 w-5" />,
  tantra: <WandSparkles className="h-5 w-5" />,
  stotra: <Music className="h-5 w-5" />,
  other: <Heart className="h-5 w-5" />,
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function scriptureMatchesQuery(scripture: LibraryItem, query: string): boolean {
  if (!query) return true;

  const haystack = [
    scripture.title,
    scripture.titleSanskrit,
    scripture.description,
    scripture.author,
    scripture.category,
    scripture.explanation?.overview.en,
    scripture.explanation?.overview.hi,
    ...scripture.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

function sortScriptures(scriptures: LibraryItem[], sortMode: SortMode): LibraryItem[] {
  return [...scriptures].sort((a, b) => {
    if (sortMode === 'az') {
      return a.title.localeCompare(b.title);
    }

    if (sortMode === 'verses') {
      return b.totalVerses - a.totalVerses;
    }

    return Number(b.hasData) - Number(a.hasData);
  });
}

export function ScriptureLibraryClient({
  scriptures,
  categories,
}: {
  scriptures: LibraryItem[];
  categories: CategoryOption[];
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [explainedOnly, setExplainedOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('featured');
  const hasHydratedFilters = useRef(false);

  const normalizedQuery = normalize(query);
  const explainedCount = scriptures.filter((scripture) => scripture.hasData).length;
  const validCategoryIds = useMemo(
    () => new Set(categories.map((category) => category.id)),
    [categories],
  );
  const activeCategoryLabel =
    activeCategory === 'all'
      ? ''
      : categories.find((category) => category.id === activeCategory)?.label ??
        activeCategory;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const sort = params.get('sort');

    setQuery(params.get('q') ?? '');
    setExplainedOnly(params.get('explained') === '1');

    if (category && validCategoryIds.has(category as ScriptureCategory)) {
      setActiveCategory(category as ScriptureCategory);
    }

    if (sort === 'az' || sort === 'verses') {
      setSortMode(sort);
    }

    hasHydratedFilters.current = true;
  }, [validCategoryIds]);

  useEffect(() => {
    if (!hasHydratedFilters.current) return;

    const params = new URLSearchParams();
    if (normalizedQuery) params.set('q', normalizedQuery);
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (explainedOnly) params.set('explained', '1');
    if (sortMode !== 'featured') params.set('sort', sortMode);

    const nextUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState(null, '', nextUrl);
  }, [activeCategory, explainedOnly, normalizedQuery, sortMode]);

  const filteredScriptures = useMemo(
    () =>
      sortScriptures(scriptures, sortMode).filter((scripture) => {
        const categoryMatches =
          activeCategory === 'all' || scripture.category === activeCategory;
        const dataMatches = !explainedOnly || scripture.hasData;

        return (
          categoryMatches &&
          dataMatches &&
          scriptureMatchesQuery(scripture, normalizedQuery)
        );
      }),
    [activeCategory, explainedOnly, normalizedQuery, scriptures, sortMode],
  );

  const visibleCategories = categories
    .map((category) => ({
      ...category,
      scriptures: filteredScriptures.filter(
        (scripture) => scripture.category === category.id,
      ),
      total: scriptures.filter((scripture) => scripture.category === category.id)
        .length,
    }))
    .filter((category) => category.total > 0);

  const hasActiveFilters =
    query.length > 0 ||
    activeCategory !== 'all' ||
    explainedOnly ||
    sortMode !== 'featured';

  const resetFilters = () => {
    setQuery('');
    setActiveCategory('all');
    setExplainedOnly(false);
    setSortMode('featured');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <section className="mb-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-dharma-border bg-dharma-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-dharma-muted">
              Catalog
            </p>
            <p className="mt-2 text-3xl font-bold text-dharma-text">
              {formatCount(scriptures.length)}
            </p>
            <p className="text-sm text-dharma-muted">texts organized for study</p>
          </div>
          <div className="rounded-xl border border-dharma-border bg-dharma-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-dharma-muted">
              Explained
            </p>
            <p className="mt-2 text-3xl font-bold text-dharma-text">
              {formatCount(explainedCount)}
            </p>
            <p className="text-sm text-dharma-muted">with verse-by-verse data</p>
          </div>
          <div className="rounded-xl border border-dharma-border bg-dharma-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-dharma-muted">
              Showing
            </p>
            <p className="mt-2 text-3xl font-bold text-dharma-text">
              {formatCount(filteredScriptures.length)}
            </p>
            <p className="text-sm text-dharma-muted">matching the current view</p>
          </div>
        </div>
      </section>

      <section className="mb-12 rounded-xl border border-dharma-border bg-dharma-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dharma-muted" />
            <span className="sr-only">Search scriptures</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, Sanskrit name, author, topic..."
              className="w-full rounded-lg border border-dharma-border bg-dharma-bg py-3 pl-11 pr-4 text-sm text-dharma-text outline-none transition focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-lg border border-dharma-border bg-dharma-bg px-3 py-2 text-sm font-semibold text-dharma-text">
              Sort
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="bg-transparent text-sm font-semibold text-dharma-text outline-none"
              >
                <option value="featured">Featured</option>
                <option value="az">A-Z</option>
                <option value="verses">Most verses</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => setExplainedOnly((value) => !value)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                explainedOnly
                  ? 'border-emerald-300 bg-emerald-100 text-emerald-800'
                  : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-300 hover:text-saffron-700'
              }`}
              aria-pressed={explainedOnly}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded border border-current">
                {explainedOnly && <Check className="h-3 w-3" />}
              </span>
              Explained only
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 rounded-lg border border-dharma-border bg-dharma-bg px-3 py-2 text-sm font-semibold text-dharma-muted transition hover:border-saffron-300 hover:text-saffron-700"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              activeCategory === 'all'
                ? 'border-saffron-300 bg-saffron-100 text-saffron-800'
                : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
            }`}
          >
            All
          </button>
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                activeCategory === category.id
                  ? 'border-saffron-300 bg-saffron-100 text-saffron-800'
                  : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
              }`}
            >
              {categoryIcons[category.id]}
              {category.label}
              <span className="text-xs opacity-70">{category.total}</span>
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <p className="mt-4 text-sm text-dharma-muted" aria-live="polite">
            Showing {formatCount(filteredScriptures.length)} of{' '}
            {formatCount(scriptures.length)} texts
            {activeCategoryLabel ? ` in ${activeCategoryLabel}` : ''}
            {normalizedQuery ? ` matching "${normalizedQuery}"` : ''}.
          </p>
        )}
      </section>

      {filteredScriptures.length === 0 ? (
        <section className="rounded-xl border border-dharma-border bg-dharma-card p-10 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-saffron-600" />
          <h2 className="mt-4 text-2xl font-serif font-bold text-dharma-text">
            No scriptures found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-dharma-muted">
            Try a broader title, author, category, or topic. The catalog search
            includes Sanskrit names, tags, and short explanations.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-lg bg-saffron-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-saffron-700"
          >
            Reset filters
          </button>
        </section>
      ) : (
        visibleCategories.map((category) => {
          if (category.scriptures.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="mb-14 scroll-mt-24">
              <FadeUpOnView className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-saffron-100 text-saffron-700">
                  {categoryIcons[category.id]}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-serif font-bold text-dharma-text">
                      {category.label}
                    </h2>
                    <span className="rounded-full bg-dharma-card px-2.5 py-1 text-xs font-semibold text-dharma-muted ring-1 ring-dharma-border">
                      {category.scriptures.length} shown
                    </span>
                  </div>
                  <p className="text-sm text-dharma-muted">{category.description}</p>
                </div>
              </FadeUpOnView>

              <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" amount={0.05}>
                {category.scriptures.map((scripture) => (
                  <StaggerItem key={scripture.id}>
                    <ScriptureCard
                      href={`/scripture/${scripture.id}`}
                      className="scripture-card group flex h-full flex-col"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-lg font-serif font-bold text-dharma-text transition group-hover:text-saffron-700">
                          {scripture.title}
                        </h3>
                        {scripture.hasData && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                            <Check className="h-3 w-3" />
                            Explained
                          </span>
                        )}
                      </div>
                      <p
                        lang="sa"
                        className="mb-3 text-sm font-devanagari text-dharma-muted"
                      >
                        {scripture.titleSanskrit}
                      </p>
                      <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-dharma-text">
                        {scripture.description}
                      </p>
                      {scripture.explanation && (
                        <p
                          className="mb-4 line-clamp-2 text-sm font-devanagari leading-relaxed text-dharma-muted"
                          lang="hi"
                        >
                          {scripture.explanation.overview.hi}
                        </p>
                      )}
                      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-dharma-muted">
                        <span>{formatCount(scripture.totalChapters)} chapters</span>
                        <span>{formatCount(scripture.totalVerses)} verses</span>
                        {scripture.author && <span>by {scripture.author}</span>}
                      </div>
                      {scripture.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {scripture.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-saffron-50 px-2 py-1 text-xs font-semibold text-saffron-800 ring-1 ring-saffron-100"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </ScriptureCard>
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          );
        })
      )}
    </div>
  );
}
