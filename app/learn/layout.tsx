import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn Hindu Scriptures — Flashcards, Timelines & Mind Maps',
  description:
    'Interactive ways to study Hindu scriptures: flashcards, slide decks, mind maps, quizzes, and timelines covering the Vedas, Upanishads, Bhagavad Gita, and the epics.',
  alternates: { canonical: '/learn' },
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
