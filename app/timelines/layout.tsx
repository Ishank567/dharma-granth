import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timelines of Hindu Scriptures & Traditions',
  description:
    'Visual timelines of Hindu scripture and tradition — from the Vedic period through the Upanishads, epics, and Puranas — showing how the texts and schools relate.',
  alternates: { canonical: '/timelines' },
};

export default function TimelinesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
