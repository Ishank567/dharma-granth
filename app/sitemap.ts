import type { MetadataRoute } from 'next';
import { getAllScriptures, getScriptureChapters } from '@/data/scriptures';
import { readSeededChapterNumbers } from '@/lib/read-seeded-chapters';
import { lastChanged, scriptureLastChanged } from '@/lib/content-dates';
import { verseStaticParams } from '@/lib/verse-pages';
import { chapterPartHref, chapterParts } from '@/lib/chapter-parts';
import { topics } from '@/data/topics';
import { characters } from '@/data/characters';
import { dictionary } from '@/data/dictionary';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';

type Entry = MetadataRoute.Sitemap[number];

/**
 * lastModified comes from git history (see lib/content-dates): each URL's date
 * is when its content last changed, and it is omitted when unknown. A single
 * build timestamp on every URL is ignored by Google.
 */
function entry(
  path: string,
  lastModified: Date | undefined,
  changeFrequency: Entry['changeFrequency'],
  priority: number,
): Entry {
  return {
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  };
}

/** A top-level page: its own page file, plus the data file it renders. */
function pageDate(route: string, ...dataFiles: string[]): Date | undefined {
  const page = route === '/' ? 'app/page.tsx' : `app${route}/page.tsx`;
  return lastChanged(page, ...dataFiles);
}

export default function sitemap(): MetadataRoute.Sitemap {
  // 1. Static Top-Level Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/', pageDate('/'), 'weekly', 1.0),
    entry('/scriptures', pageDate('/scriptures', 'data/scripture-meta.ts'), 'weekly', 0.95),
    entry('/learn', pageDate('/learn'), 'weekly', 0.9),
    entry('/learn/pathways', pageDate('/learn/pathways', 'data/pathways.ts'), 'weekly', 0.9),
    entry('/concepts', pageDate('/concepts'), 'weekly', 0.85),
    entry('/topics', pageDate('/topics', 'data/topics.ts'), 'weekly', 0.85),
    entry('/characters', pageDate('/characters', 'data/characters.ts'), 'weekly', 0.85),
    entry('/locations', pageDate('/locations'), 'monthly', 0.8),
    entry('/festivals', pageDate('/festivals'), 'monthly', 0.8),
    entry('/timelines', pageDate('/timelines'), 'monthly', 0.8),
    entry('/rituals', pageDate('/rituals'), 'monthly', 0.8),
    entry('/dictionary', pageDate('/dictionary', 'data/dictionary.ts'), 'monthly', 0.8),
    entry('/practice', pageDate('/practice'), 'monthly', 0.75),
    entry('/collections', pageDate('/collections'), 'monthly', 0.75),
  ];

  // 2. Individual Entity Pages
  const topicDate = lastChanged('data/topics.ts', 'app/topics/[id]/page.tsx');
  const topicRoutes = topics.map((t) => entry(`/topics/${t.id}`, topicDate, 'monthly', 0.8));

  const characterDate = lastChanged('data/characters.ts', 'app/characters/[id]/page.tsx');
  const characterRoutes = characters.map((c) => entry(`/characters/${c.id}`, characterDate, 'monthly', 0.8));

  const dictionaryDate = lastChanged('data/dictionary.ts', 'app/dictionary/[id]/page.tsx');
  const dictionaryRoutes = dictionary.map((d) => entry(`/dictionary/${d.id}`, dictionaryDate, 'monthly', 0.8));

  // 3. Scripture Landing Pages, 4. Chapter Pages (all seeded + curated
  // chapters) and 5. Verse Pages — dated by when the scripture's text or
  // commentary last changed.
  const scriptureRoutes: MetadataRoute.Sitemap = [];
  const chapterRoutes: MetadataRoute.Sitemap = [];
  for (const meta of getAllScriptures()) {
    const date = scriptureLastChanged(meta.id);
    scriptureRoutes.push(entry(`/scripture/${meta.id}`, date, 'monthly', meta.hasData ? 0.9 : 0.5));

    const chapterSet = new Set<number>(readSeededChapterNumbers(meta.id));
    for (const ch of getScriptureChapters(meta.id)) chapterSet.add(ch.id);
    for (const chId of Array.from(chapterSet).sort((a, b) => a - b)) {
      chapterRoutes.push(entry(`/scripture/${meta.id}/chapter/${chId}`, date, 'monthly', 0.75));
      // Parts 2…N of chapters too large for one page (lib/chapter-parts).
      for (const part of chapterParts(meta.id, chId)?.slice(1) ?? []) {
        chapterRoutes.push(entry(chapterPartHref(meta.id, chId, part.part), date, 'monthly', 0.6));
      }
    }
  }

  const verseRoutes = verseStaticParams().map((p) =>
    entry(`/scripture/${p.id}/chapter/${p.chapterId}/verse/${p.verseId}`, scriptureLastChanged(p.id), 'monthly', 0.7),
  );

  return [
    ...staticRoutes,
    ...topicRoutes,
    ...characterRoutes,
    ...dictionaryRoutes,
    ...scriptureRoutes,
    ...chapterRoutes,
    ...verseRoutes,
  ].map((e) => ({ ...e, url: withTrailingSlash(e.url) }));
}

/**
 * next.config sets `trailingSlash: true`, so pages are served at `/path/` and
 * `/path` redirects. List the final URLs so crawlers don't hit a redirect.
 */
function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}
