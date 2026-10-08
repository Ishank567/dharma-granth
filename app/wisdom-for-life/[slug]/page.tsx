import { getLibraryFacts } from '@/lib/library-server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import {
  wisdomTopics,
  getWisdomTopic,
  type WisdomTopic,
} from '@/data/wisdom-for-life';
import { TopicDetailClient } from './TopicDetailClient';

export function generateStaticParams() {
  return wisdomTopics.map((topic) => ({
    slug: topic.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const topic = getWisdomTopic(params.slug);
  if (!topic) {
    return {
      title: 'Topic Not Found',
    };
  }

  const title = `${topic.titleEn} (${topic.titleHi}) — Wisdom for Life`;
  const description = `${topic.shortDescEn} Explore original Sanskrit verses, literal translations, and traditional context from the Gita and Upanishads.`;

  return {
    title,
    description,
    alternates: { canonical: `/wisdom-for-life/${topic.slug}` },
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      // openGraph titles are not run through the layout's title template.
      title: `${title} — Dharma Granth`,
      description,
      url: `https://dharmagranth.in/wisdom-for-life/${topic.slug}`,
    },
  };
}

export default function WisdomTopicPage({
  params,
}: {
  params: { slug: string };
}) {
  const topic = getWisdomTopic(params.slug);
  if (!topic) {
    notFound();
  }

  // Where each cited text's Sanskrit comes from, measured from the library's own data files.
  const libraryFacts: Record<string, { host?: string; fetched?: string }> = {};
  topic.verses.forEach((v) => {
    if (libraryFacts[v.scriptureId]) return;
    const facts = getLibraryFacts(v.scriptureId);
    libraryFacts[v.scriptureId] = { host: facts.sourceHost, fetched: facts.sourceFetched };
  });

  const currentIndex = wisdomTopics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIndex > 0 ? wisdomTopics[currentIndex - 1] : undefined;
  const nextTopic =
    currentIndex < wisdomTopics.length - 1 ? wisdomTopics[currentIndex + 1] : undefined;

  return (
    <div className="min-h-screen bg-dharma-bg">
      <TopicDetailClient
        topic={topic}
        libraryFacts={libraryFacts}
        prevTopic={prevTopic}
        nextTopic={nextTopic}
      />
    </div>
  );
}
