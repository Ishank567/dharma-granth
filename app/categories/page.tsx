import { getAllCategories } from '@/app/lib/db';
import CategoryCard from '@/app/components/CategoryCard';
import type { Category } from '@/app/lib/types';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'ग्रंथ श्रेणियाँ — धर्म ग्रंथ',
  description: 'वेद, उपनिषद, गीता, पुराण, स्मृति और भक्ति ग्रंथों की सूची',
};

export default function CategoriesPage() {
  let categories: Category[] = [];

  try {
    categories = getAllCategories() as Category[];
  } catch {
    // DB not initialized
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">ग्रंथ श्रेणियाँ</span>
      </nav>

      <div className="text-center mb-12">
        <h1 className="font-serif-deva text-3xl font-bold text-foreground mb-2">
          📚 ग्रंथ श्रेणियाँ
        </h1>
        <p className="text-muted">
          सनातन धर्म के विभिन्न ग्रंथों को श्रेणी अनुसार खोजें
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-border bg-card">
          <p className="text-muted">डेटाबेस तैयार नहीं है। कृपया PDF निष्कर्षण आदेश चलाएँ।</p>
        </div>
      )}
    </div>
  );
}
