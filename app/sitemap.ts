import type { MetadataRoute } from 'next';
import { getAllScriptures, getScripture } from '@/data/scriptures';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.example';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/scriptures`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
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
    const scripture = getScripture(meta.id);
    if (!scripture) continue;
    for (const chapter of scripture.chapters) {
      chapterRoutes.push({
        url: `${SITE_URL}/scripture/${meta.id}/chapter/${chapter.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: chapter.verses.length > 0 ? 0.8 : 0.3,
      });
    }
  }

  return [...staticRoutes, ...scriptureRoutes, ...chapterRoutes];
}
