import Link from 'next/link';
import { BookOpen, Home, Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Path Not Found',
  description: 'The page you are looking for is not part of the library yet.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-dharma-bg flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        <div
          lang="sa"
          className="font-devanagari text-7xl text-saffron-700 opacity-90 mb-6 leading-none"
        >
          ॐ
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-saffron-700 font-semibold mb-3">
          Page Not Found
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-dharma-text mb-4">
          This path is not in the library.
        </h1>
        <p className="text-base text-dharma-muted mb-10 max-w-lg mx-auto leading-relaxed">
          The page you tried to reach does not exist, or the verse has not been
          assembled yet. Step back to the library, or begin with the Bhagavad Gita.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-saffron-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-saffron-700 transition"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/scriptures"
            className="inline-flex items-center gap-2 bg-white border border-dharma-border text-dharma-text px-5 py-3 rounded-full font-semibold hover:bg-saffron-50 transition"
          >
            <Search className="w-4 h-4" />
            Browse the Library
          </Link>
          <Link
            href="/scripture/bhagavadgita"
            className="inline-flex items-center gap-2 bg-white border border-dharma-border text-dharma-text px-5 py-3 rounded-full font-semibold hover:bg-saffron-50 transition"
          >
            <BookOpen className="w-4 h-4" />
            Read the Gita
          </Link>
        </div>
      </div>
    </main>
  );
}
