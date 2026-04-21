import { searchVerses, searchVersesCount, getAllCategories } from '@/app/lib/db';
import SearchBar from '@/app/components/SearchBar';
import type { SearchResult, Category } from '@/app/lib/types';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const RESULTS_PER_PAGE = 20;

export const metadata: Metadata = {
  title: 'खोजें — धर्म ग्रंथ',
  description: 'सभी ग्रंथों में श्लोक और पाठ खोजें',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>;
}) {
  const { q: query, page: pageStr, category: categoryFilter } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10));
  let results: SearchResult[] = [];
  let total = 0;
  let totalPages = 0;
  let categories: Category[] = [];

  try {
    categories = getAllCategories() as Category[];
  } catch {}

  if (query && query.trim()) {
    try {
      total = searchVersesCount(query.trim(), categoryFilter || undefined);
      totalPages = Math.ceil(total / RESULTS_PER_PAGE);
      const safePage = Math.min(page, Math.max(1, totalPages));
      results = searchVerses(query.trim(), RESULTS_PER_PAGE, (safePage - 1) * RESULTS_PER_PAGE, categoryFilter || undefined) as SearchResult[];
    } catch {
      // FTS not ready
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">खोजें</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="font-serif-deva text-3xl font-bold text-foreground mb-4">
          🔍 ग्रंथों में खोजें
        </h1>
        <SearchBar initialQuery={query || ''} />
      </div>

      {/* Category Filter */}
      {query && categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-muted">श्रेणी:</span>
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              !categoryFilter
                ? 'border-accent bg-accent text-white'
                : 'border-border bg-card text-muted hover:bg-accent-bg hover:text-accent'
            }`}
          >
            सभी
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?q=${encodeURIComponent(query)}&category=${cat.slug}`}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                categoryFilter === cat.slug
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-card text-muted hover:bg-accent-bg hover:text-accent'
              }`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Results */}
      {query && (
        <div className="mt-8">
          <p className="text-sm text-muted mb-6">
            &ldquo;{query}&rdquo; के लिए {total} परिणाम मिले
            {totalPages > 1 && ` — पृष्ठ ${page} / ${totalPages}`}
          </p>

          {results.length > 0 ? (
            <>
              <div className="space-y-4">
                {results.map((result) => (
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
                          {result.original_text.slice(0, 200)}
                          {result.original_text.length > 200 && '...'}
                        </p>
                        {result.translation_hindi && (
                          <p className="mt-2 text-xs text-muted line-clamp-2">
                            {result.translation_hindi.slice(0, 150)}
                          </p>
                        )}
                      </div>
                      <span className="text-muted text-lg">→</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (() => {
                const catParam = categoryFilter ? `&category=${encodeURIComponent(categoryFilter)}` : '';
                return (
                <nav aria-label="खोज पृष्ठ नेविगेशन" className="mt-8 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}${catParam}`}
                      className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      ← पिछला
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .reduce<(number | 'ellipsis')[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('ellipsis');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === 'ellipsis' ? (
                        <span key={`e${i}`} className="px-2 text-muted">…</span>
                      ) : (
                        <Link
                          key={p}
                          href={`/search?q=${encodeURIComponent(query)}&page=${p}${catParam}`}
                          className={`rounded-xl border px-3.5 py-2 text-sm transition-colors ${
                            p === page
                              ? 'border-accent bg-accent text-white'
                              : 'border-border bg-card text-muted hover:bg-accent-bg hover:text-accent'
                          }`}
                        >
                          {p}
                        </Link>
                      )
                    )}

                  {page < totalPages && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}${catParam}`}
                      className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      अगला →
                    </Link>
                  )}
                </nav>
                );
              })()}
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
    </div>
  );
}
