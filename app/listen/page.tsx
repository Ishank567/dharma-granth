import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ListenClient } from './ListenClient';

export const metadata: Metadata = {
  title: 'Listen · सुनें',
  description: 'Listen to a chapter verse by verse, with line highlighting, slow pronunciation, repeat and a sleep timer.',
  alternates: { canonical: '/listen' },
};

export default function ListenPage() {
  return (
    <Suspense fallback={<main id="main" className="mx-auto max-w-3xl px-4 py-10"><p role="status" className="text-sm text-dharma-muted">Loading…</p></main>}>
      <ListenClient />
    </Suspense>
  );
}
