import type { Metadata } from 'next';
import { JsonLd } from '@/app/components/JsonLd';
import { GUIDED_READING_PATHS } from '@/data/guided-reading-paths';
import { pageLd, readingListLd } from '@/lib/jsonld';

const TITLE = 'Guided Reading Paths · स्वाध्याय मार्ग | Dharma Granth';
const DESCRIPTION =
  'Structured, text-first reading journeys through Hindu scriptures organized by life questions, philosophical themes, beginner sequences, character studies, and ethical dilemmas.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/learn/paths' },
};

const PATHS_JSON_LD = pageLd(
  [
    { name: 'Learn', path: '/learn' },
    { name: 'Reading Paths', path: '/learn/paths' },
  ],
  readingListLd({
    path: '/learn/paths',
    name: 'Guided Reading Paths',
    description: DESCRIPTION,
    items: GUIDED_READING_PATHS.map((p) => ({
      id: p.id,
      name: p.title,
      nameHi: p.titleHi,
      description: p.purpose,
      minutes: p.estimatedMinutes,
      teaches: p.coreInsight,
      prerequisites: p.prerequisites,
      parts: p.verses.map((v) => ({ name: `${v.title} (${v.scriptureId} ${v.chapter}.${v.verse})`, description: v.takeaway })),
    })),
  }),
);

export default function GuidedPathsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={PATHS_JSON_LD} />
      {children}
    </>
  );
}
