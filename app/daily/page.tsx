import type { Metadata } from 'next';
import { DailyDharmaJourneySession } from '@/app/components/daily/DailyDharmaJourneySession';

export const metadata: Metadata = {
  title: 'Daily Dharma Journey · दैनिक धर्म यात्रा',
  description:
    'A calm daily session with one verse: original Sanskrit, slow pronunciation, plain meaning, a modern example and private reflection. No streaks.',
  alternates: { canonical: '/daily' },
};

export default function DailyJourneyPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      <DailyDharmaJourneySession />
    </main>
  );
}
