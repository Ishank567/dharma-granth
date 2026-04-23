import { getBookBySlug, getAllCategories, getBooksByCategory } from '@/app/lib/content';
import VerseDisplay from '@/app/components/VerseDisplay';
import TableOfContents from '@/app/components/TableOfContents';
import { hasGuidedCourse } from '@/app/lib/guidedCourses';
import type { Verse } from '@/app/lib/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: Array<{ category: string; bookId: string }> = [];
  for (const cat of getAllCategories()) {
    for (const book of getBooksByCategory(cat.slug)) {
      params.push({ category: cat.slug, bookId: book.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; bookId: string }> }): Promise<Metadata> {
  const { bookId } = await params;
  const book = getBookBySlug(bookId);
  if (book) {
    return { title: `${book.title_hindi} — धर्म ग्रंथ`, description: book.description };
  }
  return { title: 'ग्रंथ — धर्म ग्रंथ' };
}

export default async function BookReaderPage({
  params,
}: {
  params: Promise<{ category: string; bookId: string }>;
}) {
  const { category, bookId } = await params;
  const guidedCourseAvailable = hasGuidedCourse(bookId);

  const book = getBookBySlug(bookId);
  if (!book) notFound();

  const VERSE_CAP = 100;
  const allVerses: Verse[] = book.content_status === 'ready' ? book.verses : [];
  const totalVerses = allVerses.length;
  const verses = allVerses.slice(0, VERSE_CAP);
  const hasMore = totalVerses > verses.length;
  const chapters = book.chapters;

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
          {hasMore && (
            <>
              <span>•</span>
              <span>पहले {verses.length} श्लोक यहाँ दिखाए गए हैं</span>
            </>
          )}
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
            currentPage={1}
            perPage={verses.length || 1}
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

          {hasMore && (
            <div className="mt-12 rounded-2xl border border-accent/20 bg-accent-bg/40 p-6 text-center">
              <p className="text-sm text-foreground/85 leading-relaxed">
                इस ग्रंथ के पहले {verses.length} श्लोक यहाँ प्रदर्शित हैं। शेष {totalVerses - verses.length} श्लोकों तक पहुँच शीघ्र उपलब्ध होगी।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
