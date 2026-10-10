import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';

export const metadata: Metadata = {
  title: 'पञ्चाङ्ग · Educational Vedic Calendar',
  description:
    'A clear educational Panchang calendar for contemplative study: Tithi, Paksha, Nakshatra, Yoga, Karana, Ritu, and approximate sunrise and sunset times.',
  alternates: { canonical: '/panchang' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'पञ्चाङ्ग · Educational Vedic Calendar — Dharma Granth',
    description:
      'A clear educational Panchang calendar for contemplative study: Tithi, Paksha, Nakshatra, Yoga, Karana, Ritu, and approximate sunrise and sunset times.',
    url: 'https://dharmagranth.in/panchang',
  },
};

export default function PanchangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
