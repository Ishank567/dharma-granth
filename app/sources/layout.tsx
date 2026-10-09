import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Source Library & Text Transparency · स्रोत एवं संस्करण | Dharma Granth',
  description:
    'Authoritative provenance, Sanskrit editions, manuscript recensions, primary translators, and traditional commentary attribution for scriptures in Dharma Granth.',
};

export default function SourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
