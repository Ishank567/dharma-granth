'use client';

import { useEffect } from 'react';
import { LoadFailure } from '@/app/components/library/LibraryStates';

/** The library failed while rendering; offer a reload without losing the site chrome. */
export default function LibraryError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error('[dharma-granth] library error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-dharma-bg">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6">
        <LoadFailure onRetry={() => window.location.reload()} />
      </div>
    </main>
  );
}
