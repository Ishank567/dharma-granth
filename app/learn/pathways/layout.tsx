import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Pathways — Guided Scripture Study Plans',
  description:
    'Step-by-step guided pathways through Hindu scriptures — structured reading plans that take you from first verse to full understanding at your own pace.',
  alternates: { canonical: '/learn/pathways' },
};

export default function PathwaysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
