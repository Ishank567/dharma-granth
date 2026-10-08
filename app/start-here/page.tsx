import type { Metadata } from 'next';
import { StartHere } from './StartHere';

export const metadata: Metadata = {
  title: 'Start Here · कहाँ से शुरू करें?',
  description: 'Four short questions to find a helpful place to begin. No account; your answers stay on your device.',
  alternates: { canonical: '/start-here' },
};

export default function StartHerePage() {
  return <StartHere />;
}
