import type { Metadata } from 'next';
import { PackClient } from './PackClient';

export const metadata: Metadata = {
  title: 'Study Pack · अध्ययन-पत्र',
  description: 'Choose verses and layers, then print or save a clean study sheet with references and sources.',
  alternates: { canonical: '/pack' },
  robots: { index: false },
};

export default function PackPage() {
  return <PackClient />;
}
