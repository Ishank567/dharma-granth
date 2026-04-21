import { getBookBySlug, getVersesByBook, getTotalVerseCount } from '@/app/lib/db';
import VerseDisplay from '@/app/components/VerseDisplay';
import { hasGuidedCourse } from '@/app/lib/guidedCourses';
import type { Book, Verse } from '@/app/lib/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

  try {
    book = getBookBySlug(bookId) as Book | undefined;
    if (!book) notFound();
    verses = getVersesByBook(book.id, perPage, (page - 1) * perPage) as Verse[];
    totalVerses = getTotalVerseCount(book.id);
  } catch {
    notFound();
  }

  const totalPages = Math.ceil(totalVerses / perPage);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
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
      <div className="mb-10 text-center">
        <h1 className="font-serif-deva text-3xl md:text-4xl font-bold text-foreground mb-2">
          {book!.title_hindi}
        </h1>
        <p className="text-muted">{book!.author} • {book!.language}</p>
        <p className="text-sm text-muted-light mt-1">{book!.description}</p>
        <div className="mt-4 flex justify-center gap-4 text-sm text-muted">
          <span>कुल {totalVerses} श्लोक/पाठ</span>
          <span>•</span>
          <span>पृष्ठ {page} / {totalPages || 1}</span>
        </div>

        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-accent/20 bg-accent-bg/40 p-4 text-left">
          <h2 className="font-serif-deva text-lg font-bold text-primary mb-2">
            अध्ययन विधि
          </h2>
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

        {/* Progress bar */}
        {totalPages > 1 && (
          <div className="mt-4 mx-auto max-w-md h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${(page / totalPages) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Verses */}
      {verses.length > 0 ? (
        <div className="space-y-6">
          {verses.map((verse) => (
            <VerseDisplay
              key={verse.id}
              verse={verse}
              bookTitle={book!.title_hindi}
              bookSlug={bookId}
              categorySlug={category}
            />
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

          <span className="text-sm text-muted">
            {page} / {totalPages}
          </span>

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
  );
}
