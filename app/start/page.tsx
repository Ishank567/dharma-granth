import type { Metadata } from 'next';
import { StartJourney } from './StartJourney';

export const metadata: Metadata = {
  title: 'Start My Journey · अपनी अध्ययन यात्रा शुरू करें',
  description: 'Answer five short questions and get a suggested path through Dharma Granth. No sign-in; your choices stay on your device.',
};

export default function StartPage() {
  return <StartJourney />;
}
