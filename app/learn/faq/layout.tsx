import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scripture & Tradition FAQs · जिज्ञासा एवं समाधान | Dharma Granth',
  description:
    'Authoritative, sourced, non-dogmatic answers to essential questions about Hindu scriptures, philosophical traditions, ethics, and common misconceptions.',
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
