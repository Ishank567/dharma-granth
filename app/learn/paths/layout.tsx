import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guided Reading Paths · स्वाध्याय मार्ग | Dharma Granth',
  description:
    'Structured, text-first reading journeys through Hindu scriptures organized by life questions, philosophical themes, beginner sequences, character studies, and ethical dilemmas.',
};

export default function GuidedPathsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
