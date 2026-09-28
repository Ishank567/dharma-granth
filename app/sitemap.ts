import type { MetadataRoute } from 'next';
import { getAllScriptures, getScriptureChapters } from '@/data/scriptures';
import { readSeededChapterNumbers } from '@/lib/read-seeded-chapters';
import { topics } from '@/data/topics';
import { characters } from '@/data/characters';
import { dictionary } from '@/data/dictionary';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 1. Static Top-Level Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/scriptures`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE_URL}/learn`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/learn/pathways`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/concepts`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_URL}/topics`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_URL}/characters`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_URL}/locations`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/festivals`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/timelines`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/rituals`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dictionary`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/practice`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE_URL}/collections`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
  ];

  // 2. Individual Entity Pages
  const topicRoutes: MetadataRoute.Sitemap = topics.map((t) => ({
    url: `${SITE_URL}/topics/${t.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const characterRoutes: MetadataRoute.Sitemap = characters.map((c) => ({
    url: `${SITE_URL}/characters/${c.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const dictionaryRoutes: MetadataRoute.Sitemap = dictionary.map((d) => ({
    url: `${SITE_URL}/dictionary/${d.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 3. Scripture Landing Pages (65 scriptures)
  const scriptureRoutes: MetadataRoute.Sitemap = getAllScriptures().map((s) => ({
    url: `${SITE_URL}/scripture/${s.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: s.hasData ? 0.9 : 0.5,
  }));

  // 4. Chapter Pages (All seeded + curated chapters across all scriptures)
  const chapterRoutes: MetadataRoute.Sitemap = [];
  for (const meta of getAllScriptures()) {
    const chapterSet = new Set<number>();

    // Add seeded chapters from public/data/scriptures-full
    for (const chNum of readSeededChapterNumbers(meta.id)) {
      chapterSet.add(chNum);
    }

    // Add curated chapters
    for (const ch of getScriptureChapters(meta.id)) {
      chapterSet.add(ch.id);
    }

    for (const chId of Array.from(chapterSet).sort((a, b) => a - b)) {
      chapterRoutes.push({
        url: `${SITE_URL}/scripture/${meta.id}/chapter/${chId}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.75,
      });
    }
  }

  return [
    ...staticRoutes,
    ...topicRoutes,
    ...characterRoutes,
    ...dictionaryRoutes,
    ...scriptureRoutes,
    ...chapterRoutes,
  ].map((entry) => ({ ...entry, url: withTrailingSlash(entry.url) }));
}

/**
 * next.config sets `trailingSlash: true`, so pages are served at `/path/` and
 * `/path` redirects. List the final URLs so crawlers don't hit a redirect.
 */
function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}
