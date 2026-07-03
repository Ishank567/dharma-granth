import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sacred Geography — Holy Places of Hindu Scripture',
  description:
    'Map of sacred places in Hindu scripture — Ayodhya, Kurukshetra, Vrindavan, Kashi and more — with the texts, stories, and pilgrimage significance of each site.',
  alternates: { canonical: '/locations' },
};

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
