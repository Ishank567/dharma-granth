'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MiniSearch, { type SearchResult as MSResult } from 'minisearch';
import Link from 'next/link';
import SearchBar from '@/app/components/SearchBar';

type Doc = {
  id: number;
  book_slug: string;
  category_slug: string;
  book_title: string;
  verse_number: number;
  text: string;
  translation: string;
};

type Category = { slug: string; name: string; icon: string };

const RESULTS_PER_PAGE = 20;

function useMiniSearch(): { ms: MiniSearch<Doc> | null; loading: boolean; error: string | null } {
  const [ms, setMs] = useState<MiniSearch<Doc> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/data/search-index.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const docs: Doc[] = await res.json();
        const instance = new MiniSearch<Doc>({
          fields: ['text', 'translation', 'book_title'],
          storeFields: ['book_slug', 'category_slug', 'book_title', 'verse_number', 'text', 'translation'],
          idField: 'id',
        });
        instance.addAll(docs);
        if (!cancelled) {
          setMs(instance);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ms, loading, error };
}

export default function SearchClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get('q') ?? '';
  const categoryFilter = params.get('category') ?? '';
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10));

  const { ms, loading, error } = useMiniSearch();

  const results = useMemo<Array<Doc & MSResult>>(() => {
    if (!ms || !query.trim()) return [];
    const raw = ms.search(query.trim(), {
      prefix: true,
      fuzzy: 0.15,
    }) as Array<Doc & MSResult>;
    return categoryFilter ? raw.filter((r) => r.category_slug === categoryFilter) : raw;
  }, [ms, query, categoryFilter]);

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / RESULTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = results.slice((safePage - 1) * RESULTS_PER_PAGE, safePage * RESULTS_PER_PAGE);

  function setParam(key: string, value: string | null) {
    const sp = new URLSearchParams(params);
    if (value == null || value === '') sp.delete(key);
    else sp.set(key, value);
    if (key !== 'page') sp.delete('page');
    router.push(`?${sp.toString()}`);
  }

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="font-serif-deva text-3xl font-bold text-foreground mb-4">
          🔍 ग्रंथों में खोजें
        </h1>
        <SearchBar initialQuery={query} />
      </div>

      {query && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-muted">श्रेणी:</span>
          <button
            type="button"
            onClick={() => setParam('category', null)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              !categoryFilter
                ? 'border-accent bg-accent text-white'
                : 'border-border bg-card text-muted hover:bg-accent-bg hover:text-accent'
            }`}
          >
            सभी
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setParam('category', cat.slug)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                categoryFilter === cat.slug
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-card text-muted hover:bg-accent-bg hover:text-accent'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      )}

      {query && (
        <div className="mt-8">
          {loading && (
            <p className="text-sm text-muted mb-6">
              खोज सूचकांक लोड हो रहा है... (पहली बार लगभग 5-10 सेकंड लग सकते हैं)
            </p>
          )}
          {error && (
            <p className="text-sm text-red-600 mb-6">
              खोज सूचकांक लोड करने में समस्या: {error}
            </p>
          )}
          {!loading && !error && (
            <>
              <p className="text-sm text-muted mb-6">
                &ldquo;{query}&rdquo; के लिए {total} परिणाम मिले
                {totalPages > 1 && ` — पृष्ठ ${safePage} / ${totalPages}`}
              </p>

              {paged.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {paged.map((result) => (
                      <Link
                        key={result.id}
                        href={`/categories/${result.category_slug}/${result.book_slug}/${result.id}`}
                        className="block rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-md hover:bg-card-hover"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center rounded-full bg-accent-bg px-2.5 py-0.5 text-xs font-medium text-accent">
                                {result.book_title}
                              </span>
                              <span className="text-xs text-muted">
                                श्लोक {result.verse_number}
                              </span>
                            </div>
                            <p className="font-scripture text-sm text-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap">
                              {result.text}
                            </p>
                            {result.translation && (
                              <p className="mt-2 text-xs text-muted line-clamp-2">
                                {result.translation}
                              </p>
                            )}
                          </div>
                          <span className="text-muted text-lg">→</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <nav aria-label="खोज पृष्ठ नेविगेशन" className="mt-8 flex items-center justify-center gap-2">
                      {safePage > 1 && (
                        <button
                          type="button"
                          onClick={() => setParam('page', String(safePage - 1))}
                          className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted hover:bg-accent-bg hover:text-accent transition-colors"
                        >
                          ← पिछला
                        </button>
                      )}
                      <span className="text-sm text-muted px-3">{safePage} / {totalPages}</span>
                      {safePage < totalPages && (
                        <button
                          type="button"
                          onClick={() => setParam('page', String(safePage + 1))}
                          className="rounded-xl border border-border bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 transition-colors"
                        >
                          अगला →
                        </button>
                      )}
                    </nav>
                  )}
                </>
              ) : (
                <div className="text-center py-12 rounded-2xl border border-border bg-card">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="text-muted">कोई परिणाम नहीं मिला</p>
                  <p className="text-sm text-muted-light mt-2">
                    कृपया अन्य शब्दों से खोजें
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📜</p>
          <p className="text-muted">
            ऊपर खोज बॉक्स में कोई शब्द टाइप करें
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['धर्म', 'कर्म', 'योग', 'आत्मा', 'ब्रह्म', 'मोक्ष', 'प्रेम', 'शान्ति'].map((word) => (
              <Link
                key={word}
                href={`/search?q=${encodeURIComponent(word)}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted hover:bg-accent-bg hover:text-accent hover:border-accent/30 transition-colors"
              >
                {word}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
