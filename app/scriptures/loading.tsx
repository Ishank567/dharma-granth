import { LibrarySkeleton } from '@/app/components/library/LibraryStates';

/** Shown by Next while the library route streams in. */
export default function Loading() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
        <div className="mb-8 animate-pulse" aria-hidden="true">
          <div className="h-12 w-full rounded-xl bg-dharma-border/60" />
        </div>
        <LibrarySkeleton count={6} />
      </div>
    </main>
  );
}
