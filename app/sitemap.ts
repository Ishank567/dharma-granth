import type { MetadataRoute } from 'next';
import { getAllScriptures, getScriptureChapters } from '@/data/scriptures';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/scriptures`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/practice`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const scriptureRoutes: MetadataRoute.Sitemap = getAllScriptures().map(s => ({
    url: `${SITE_URL}/scripture/${s.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    // Pages with real verse data are higher priority — they actually deliver value to a searcher.
    priority: s.hasData ? 0.85 : 0.4,
  }));

  const chapterRoutes: MetadataRoute.Sitemap = [];
  for (const meta of getAllScriptures()) {
    for (const chapter of getScriptureChapters(meta.id)) {
      chapterRoutes.push({
        url: `${SITE_URL}/scripture/${meta.id}/chapter/${chapter.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: chapter.verseCount > 0 ? 0.8 : 0.3,
      });
    }
  }

  return [...staticRoutes, ...scriptureRoutes, ...chapterRoutes];
}
