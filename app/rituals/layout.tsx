import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Temple Rituals & Practices Explained',
  description:
    'Temple and ritual explainer: what Hindu rituals mean, how they are performed, and where they come from in scripture — puja, aarti, sandhya, nitya karma and more.',
  alternates: { canonical: '/rituals' },
};

export default function RitualsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
