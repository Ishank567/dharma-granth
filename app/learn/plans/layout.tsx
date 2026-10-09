import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scripture Reading Plans · स्वाध्याय योजनाएँ | Dharma Granth',
  description:
    'Calm, structured, non-punitive scripture reading schedules. Explore the 18-Day Bhagavad Gita Immersion and 7-Day Sanatana Foundation at your own natural pace.',
};

export default function ReadingPlansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
