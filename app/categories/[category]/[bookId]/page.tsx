import { getBookBySlug, getVersesByBook, getTotalVerseCount, getChaptersByBook } from '@/app/lib/db';
import VerseDisplay from '@/app/components/VerseDisplay';
import TableOfContents from '@/app/components/TableOfContents';
import { hasGuidedCourse } from '@/app/lib/guidedCourses';
import type { Book, Verse } from '@/app/lib/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  // For demo, return sample book paths
  return [
    { category: 'गीता', bookId: 'gita' },
    { category: 'रामायण', bookId: 'ramcharitmanas' }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; bookId: string }> }): Promise<Metadata> {
  const { bookId } = await params;
  try {
    const book = getBookBySlug(bookId) as Book | undefined;
    if (book) {
      return { title: `${book.title_hindi} — धर्म ग्रंथ`, description: book.description };
    }
  } catch {}
  return { title: 'ग्रंथ — धर्म ग्रंथ' };
}

export default async function BookReaderPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; bookId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category, bookId } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10));
  const perPage = 20;
  const guidedCourseAvailable = hasGuidedCourse(bookId);

  let book: Book | undefined;
  let verses: Verse[] = [];
  let totalVerses = 0;
  let chapters: ReturnType<typeof getChaptersByBook> = [];

  try {
    book = getBookBySlug(bookId) as Book | undefined;
    if (!book) notFound();
    if (book.content_status !== 'ocr_pending') {
      verses = getVersesByBook(book.id, perPage, (page - 1) * perPage) as Verse[];
      totalVerses = getTotalVerseCount(book.id);
      chapters = getChaptersByBook(book.id);
    }
  } catch {
    notFound();
  }

  if (book!.content_status === 'ocr_pending') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
          <span className="mx-2">›</span>
          <Link href="/categories" className="hover:text-accent transition-colors">ग्रंथ श्रेणियाँ</Link>
          <span className="mx-2">›</span>
          <Link href={`/categories/${category}`} className="hover:text-accent transition-colors">
            {book!.category_name}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">{book!.title_hindi}</span>
        </nav>
        <div className="rounded-2xl border border-accent/20 bg-card p-10 text-center">
          <p className="text-5xl mb-4" aria-hidden="true">🕉️</p>
          <h1 className="font-serif-deva text-3xl font-bold text-foreground mb-3">
            {book!.title_hindi}
          </h1>
          <p className="text-sm text-muted mb-6">{book!.author} • {book!.language}</p>
          <div className="mx-auto max-w-xl rounded-xl border border-accent/20 bg-accent-bg/40 p-5 text-left">
            <p className="font-semibold text-primary mb-2">📜 डिजिटलीकरण जारी है</p>
            <p className="text-sm text-foreground/85 leading-relaxed">
              यह ग्रंथ स्कैन किए गए पृष्ठों के रूप में उपलब्ध है। इसका OCR (पाठ-निष्कर्षण) अभी प्रगति पर है।
              जैसे ही शब्द-स्तरीय पाठ तैयार होगा, पूरी व्याख्या यहाँ उपलब्ध कराई जाएगी।
            </p>
          </div>
          <Link
            href={`/categories/${category}`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-all"
          >
            ← इस श्रेणी के अन्य ग्रंथ देखें
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalVerses / perPage);

  // Group verses by chapter for section dividers
  type VerseGroup = { chapterId: number | null; chapterTitleHindi: string | null; chapterTitle: string | null; verses: Verse[] };
  const verseGroups: VerseGroup[] = [];
  for (const verse of verses) {
    const last = verseGroups[verseGroups.length - 1];
    if (!last || last.chapterId !== verse.chapter_id) {
      verseGroups.push({
        chapterId: verse.chapter_id,
        chapterTitleHindi: (verse as Verse & { chapter_title_hindi?: string }).chapter_title_hindi ?? null,
        chapterTitle: verse.chapter_title ?? null,
        verses: [verse],
      });
    } else {
      last.verses.push(verse);
    }
  }

  const hasChapters = chapters.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
        <span className="mx-2">›</span>
        <Link href="/categories" className="hover:text-accent transition-colors">ग्रंथ श्रेणियाँ</Link>
        <span className="mx-2">›</span>
        <Link href={`/categories/${category}`} className="hover:text-accent transition-colors">
          {book!.category_name}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{book!.title_hindi}</span>
      </nav>

      {/* Book Header */}
      <div className="mb-8 text-center">
        <h1 className="font-serif-deva text-3xl md:text-4xl font-bold text-foreground mb-2">
          {book!.title_hindi}
        </h1>
        <p className="text-muted">{book!.author} • {book!.language}</p>
        <p className="text-sm text-muted-light mt-1">{book!.description}</p>
        <div className="mt-4 flex justify-center gap-4 text-sm text-muted">
          <span>कुल {totalVerses} श्लोक/पाठ</span>
          <span>•</span>
          <span>पृष्ठ {page} / {totalPages || 1}</span>
          {hasChapters && (
            <>
              <span>•</span>
              <span>{chapters.length} अध्याय</span>
            </>
          )}
        </div>

        <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-accent/20 bg-accent-bg/40 p-4 text-left">
          <h2 className="font-serif-deva text-lg font-bold text-primary mb-2">अध्ययन विधि</h2>
          <p className="text-sm text-foreground/85 leading-relaxed">
            किसी भी श्लोक पर जाकर गहन हिन्दी व्याख्या देखें। वहाँ आपको शब्दार्थ, भावार्थ, मार्गदर्शित अध्ययन, वैज्ञानिक दृष्टि और जीवन-अभ्यास क्रमशः मिलेंगे।
          </p>
          {guidedCourseAvailable && (
            <div className="mt-4">
              <Link
                href={`/courses/${bookId}`}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                🧭 इस ग्रंथ का अध्यायवार पाठ्यक्रम देखें
              </Link>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 mx-auto max-w-md h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${(page / totalPages) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Two-column layout on desktop: TOC sidebar + verse content */}
      {/* On mobile, TOC renders as a collapsible drawer before the verse list */}
      <div className={hasChapters ? 'lg:grid lg:grid-cols-[260px_1fr] lg:gap-8 lg:items-start' : ''}>
        {hasChapters && (
          <TableOfContents
            chapters={chapters as Parameters<typeof TableOfContents>[0]['chapters']}
            bookTitle={book!.title_hindi}
            bookSlug={bookId}
            categorySlug={category}
            currentPage={page}
            perPage={perPage}
            totalVerses={totalVerses}
          />
        )}

        {/* Verse content */}
        <div>
          {verses.length > 0 ? (
            <div className="space-y-0">
              {verseGroups.map((group, gi) => (
                <div key={gi}>
                  {/* Chapter heading divider */}
                  {(group.chapterTitleHindi || group.chapterTitle) && (
                    <div
                      id={group.chapterId ? `chapter-${group.chapterId}` : undefined}
                      className="chapter-divider my-8 first:mt-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                        <div className="text-center px-4">
                          <p className="text-xs text-muted font-semibold uppercase tracking-widest mb-1">अध्याय</p>
                          <h3 className="font-serif-deva text-lg font-bold text-primary">
                            {group.chapterTitleHindi || group.chapterTitle}
                          </h3>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                      </div>
                    </div>
                  )}
                  {/* No-chapter page start ornament */}
                  {!group.chapterTitleHindi && !group.chapterTitle && gi === 0 && page > 1 && (
                    <div className="mb-6 text-center text-muted text-sm">
                      — पृष्ठ {page} —
                    </div>
                  )}
                  <div className="space-y-5">
                    {group.verses.map((verse) => (
                      <VerseDisplay
                        key={verse.id}
                        verse={verse}
                        bookTitle={book!.title_hindi}
                        bookSlug={bookId}
                        categorySlug={category}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-border bg-card">
              <p className="text-4xl mb-4">📄</p>
              <p className="text-muted">इस ग्रंथ में अभी कोई पाठ उपलब्ध नहीं है</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              {page > 1 && (
                <Link
                  href={`/categories/${category}/${bookId}?page=${page - 1}`}
                  className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
                >
                  ← पिछला पृष्ठ
                </Link>
              )}

              <span className="text-sm text-muted">{page} / {totalPages}</span>

              {page < totalPages && (
                <Link
                  href={`/categories/${category}/${bookId}?page=${page + 1}`}
                  className="rounded-xl border border-border bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
                >
                  अगला पृष्ठ →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
