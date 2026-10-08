import type { Metadata } from 'next';
import { DeskClient } from './DeskClient';

export const metadata: Metadata = {
  title: 'My Study Desk · मेरा अध्ययन-पटल',
  description: 'Your saved verses, notes, reading queue and journeys, kept privately in this browser.',
  alternates: { canonical: '/desk' },
  robots: { index: false },
};

export default function DeskPage() {
  return <DeskClient />;
}
