import Link from 'next/link';
import type { Category } from '../lib/types';

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:bg-card-hover hover:-translate-y-1"
    >
      <div className="mb-4 text-4xl">{category.icon}</div>
      <h3 className="font-serif-deva text-xl font-bold text-foreground group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        {category.description}
      </p>
      {category.book_count !== undefined && (
        <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-accent-bg px-3 py-1 text-xs font-medium text-accent">
          📚 {category.book_count} ग्रंथ
        </div>
      )}
    </Link>
  );
}
