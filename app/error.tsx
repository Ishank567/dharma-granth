'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-6xl mb-6">⚠️</p>
      <h1 className="font-serif-deva text-3xl font-bold text-foreground mb-4">
        कुछ गलत हो गया
      </h1>
      <p className="text-muted mb-8 leading-relaxed">
        इस पृष्ठ को लोड करने में एक अप्रत्याशित त्रुटि हुई।
        कृपया पुनः प्रयास करें या मुख्य पृष्ठ पर लौटें।
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
        >
          पुनः प्रयास करें
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-card-hover transition-colors"
        >
          मुख्य पृष्ठ पर जाएँ
        </Link>
      </div>
    </div>
  );
}
