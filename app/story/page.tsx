import type { Metadata } from 'next';
import { StoryClient } from './StoryClient';

export const metadata: Metadata = {
  title: 'Visual Story Mode · कथा-दर्शन',
  description: 'Follow the Ramayana and Mahabharata through characters, relationships, events, dialogue and decision points, each labelled by what it is.',
  alternates: { canonical: '/story' },
};

export default function StoryPage() {
  return <StoryClient />;
}
