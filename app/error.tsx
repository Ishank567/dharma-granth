'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console for now. Wire to a real error tracker (Sentry, etc.) later.
    console.error('[dharma-granth] route error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-dharma-bg flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron-100 text-saffron-700 mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-saffron-700 font-semibold mb-3">
          Something Broke
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-dharma-text mb-4">
          The page could not be loaded.
        </h1>
        <p className="text-base text-dharma-muted mb-8 max-w-lg mx-auto leading-relaxed">
          A small error interrupted this page. Try again — and if it keeps
          happening, head back to the library.
        </p>
        {error.digest && (
          <p className="text-xs text-dharma-muted/70 mb-8 font-mono">
            ref: {error.digest}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-saffron-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-saffron-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white border border-dharma-border text-dharma-text px-5 py-3 rounded-full font-semibold hover:bg-saffron-50 transition"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
