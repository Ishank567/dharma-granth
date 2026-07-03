import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hindu Festival Calendar — Dates, Stories & Rituals',
  description:
    'Festival knowledge centre: major Hindu festivals with their dates, scriptural origins, stories, and how they are celebrated — Diwali, Holi, Navaratri, Ekadashi and more.',
  alternates: { canonical: '/festivals' },
};

export default function FestivalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
