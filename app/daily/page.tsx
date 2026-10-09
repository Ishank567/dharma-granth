import type { Metadata } from 'next';
import { DailyDharmaJourneySession } from '@/app/components/daily/DailyDharmaJourneySession';

export const metadata: Metadata = {
  title: 'Daily Dharma Journey · दैनिक धर्म यात्रा — Dharma Granth',
  description:
    'A tranquil, source-transparent daily session through Hindu scriptures. Original Sanskrit, slow pronunciation, plain meaning, modern example, and private reflection without pressure or streaks.',
  alternates: { canonical: '/daily' },
};

export default function DailyJourneyPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      <DailyDharmaJourneySession />
    </main>
  );
}
