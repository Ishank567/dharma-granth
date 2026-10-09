import type { Metadata } from 'next';
import { StartJourney } from './StartJourney';

export const metadata: Metadata = {
  title: 'Discover Your Path · अपना अध्ययन मार्ग खोजें — Dharma Granth',
  description:
    'Answer five short questions to find a serene, non-intimidating starting point through Hindu scriptures. No account required; your choices stay on your device.',
  alternates: { canonical: '/start' },
};

export default function StartPage() {
  return <StartJourney />;
}
