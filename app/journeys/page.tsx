import type { Metadata } from 'next';
import { JourneysClient } from './JourneysClient';

export const metadata: Metadata = {
  title: 'Guided Learning Journeys · स्वाध्याय यात्राएँ — Dharma Granth',
  description: 'Structured spiritual learning pathways through Hindu scriptures: Gita, Upanishads, and Yoga paths with daily bite-sized lessons, reflection questions, and progress tracking.',
  alternates: { canonical: '/journeys/' },
};

export default function JourneysPage() {
  return <JourneysClient />;
}
