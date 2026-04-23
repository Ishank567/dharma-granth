import { getCategoryBySlug, getBooksByCategory } from '@/app/lib/db';
import BookCard from '@/app/components/BookCard';
import type { Category, Book } from '@/app/lib/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  // For demo, return sample categories
  return [
    { category: 'गीता' },
    { category: 'रामायण' },
    { category: 'वेद' }
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  try {
    const cat = getCategoryBySlug(slug) as Category | undefined;
    if (cat) {
      return { title: `${cat.name} — धर्म ग्रंथ`, description: cat.description };
    }
  } catch {}
  return { title: 'श्रेणी — धर्म ग्रंथ' };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;

  let category: Category | undefined;
  let books: Book[] = [];

  try {
    category = getCategoryBySlug(slug) as Category | undefined;
    if (!category) notFound();
    books = getBooksByCategory(slug) as Book[];
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
        <span className="mx-2">›</span>
        <Link href="/categories" className="hover:text-accent transition-colors">ग्रंथ श्रेणियाँ</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{category!.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">{category!.icon}</span>
          <h1 className="font-serif-deva text-3xl font-bold text-foreground">
            {category!.name}
          </h1>
        </div>
        <p className="text-muted text-lg">{category!.description}</p>
        <p className="mt-2 text-sm text-muted-light">
          कुल {books.length} ग्रंथ इस श्रेणी में उपलब्ध हैं
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book.id} book={book} categorySlug={slug} />
        ))}
      </div>
    </div>
  );
}
