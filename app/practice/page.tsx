import type { Metadata } from 'next';
import { PracticeDashboard } from './PracticeDashboard';

export const metadata: Metadata = {
  title: 'साधना — Daily Practice | Dharma Granth',
  description:
    'A private daily practice dashboard: daily verse, reflection prompts, reading plans, japa counter, meditation timer, festival reminders, and saṅkalpa and gratitude journals. Everything stays on your device.',
  alternates: { canonical: '/practice' },
  openGraph: {
    title: 'साधना — Daily Practice | Dharma Granth',
    description:
      'A private daily practice dashboard: daily verse, reflection prompts, reading plans, japa counter, meditation timer, and journals.',
    url: 'https://dharmagranth.in/practice',
  },
};

export default function PracticePage() {
  return <PracticeDashboard />;
}
