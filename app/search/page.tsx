import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllCategories } from '@/app/lib/content';
import SearchClient from './SearchClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'खोजें — धर्म ग्रंथ',
  description: 'सभी ग्रंथों में श्लोक और पाठ खोजें',
};

export default function SearchPage() {
  const categories = getAllCategories().map((c) => ({
    slug: c.slug,
    name: c.name,
    icon: c.icon,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">खोजें</span>
      </nav>
      <Suspense fallback={<p className="text-center text-muted">लोड हो रहा है...</p>}>
        <SearchClient categories={categories} />
      </Suspense>
    </div>
  );
}
