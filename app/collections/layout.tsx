import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Collections — Curated Verse Sets by Theme',
  description:
    'Curated collections of scripture verses grouped by theme — karma, peace of mind, courage, devotion — drawn from the Bhagavad Gita, Upanishads, and other Hindu texts.',
  alternates: { canonical: '/collections' },
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
