import type { MetadataRoute } from 'next';
import { getAllScriptures, getScriptureChapters } from '@/data/scriptures';
import { readSeededChapterNumbers } from '@/lib/read-seeded-chapters';
import { lastChanged, scriptureLastChanged } from '@/lib/content-dates';
import { verseStaticParams } from '@/lib/verse-pages';
import { chapterPartHref, chapterParts } from '@/lib/chapter-parts';
import { topics } from '@/data/topics';
import { wisdomTopics } from '@/data/wisdom-for-life';
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

/**
 * The sitemap is published as an index (/sitemap.xml) pointing at one file per
 * section. The total is far below Google's 50,000-URL limit; the split is for
 * Search Console, which reports indexing per sitemap file, so verse pages can
 * be monitored apart from chapters and the editorial pages.
 */
export type SitemapSection = 'pages' | 'scriptures' | 'chapters' | 'verses';

export const SITEMAP_SECTIONS: SitemapSection[] = ['pages', 'scriptures', 'chapters', 'verses'];

/** Top-level routes plus wisdom, topic, character and dictionary entries. */
function pagesSection(): MetadataRoute.Sitemap {
  // 1. Static Top-Level Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/', pageDate('/'), 'weekly', 1.0),
    entry('/scriptures', pageDate('/scriptures', 'data/scripture-meta.ts'), 'weekly', 0.95),
    entry('/learn', pageDate('/learn'), 'weekly', 0.9),
    entry('/learn/pathways', pageDate('/learn/pathways', 'data/pathways.ts'), 'weekly', 0.9),
    entry('/learn/faq', pageDate('/learn/faq', 'data/scripture-faqs.ts'), 'monthly', 0.7),
    entry('/learn/paths', pageDate('/learn/paths', 'data/guided-reading-paths.ts'), 'monthly', 0.7),
    entry('/learn/plans', pageDate('/learn/plans', 'data/reading-plans.ts'), 'monthly', 0.7),
    entry('/wisdom-for-life', pageDate('/wisdom-for-life', 'data/wisdom-for-life.ts'), 'weekly', 0.9),
    entry('/guidance', pageDate('/guidance', 'data/wisdom-for-life.ts'), 'weekly', 0.92),
    entry('/concepts', pageDate('/concepts'), 'weekly', 0.85),
    entry('/topics', pageDate('/topics', 'data/topics.ts'), 'weekly', 0.85),
    entry('/characters', pageDate('/characters', 'data/characters.ts'), 'weekly', 0.85),
    entry('/locations', pageDate('/locations'), 'monthly', 0.8),
    entry('/festivals', pageDate('/festivals'), 'monthly', 0.8),
    entry('/panchang', pageDate('/panchang'), 'weekly', 0.85),
    entry('/timelines', pageDate('/timelines'), 'monthly', 0.8),
    entry('/rituals', pageDate('/rituals'), 'monthly', 0.8),
    entry('/dictionary', pageDate('/dictionary', 'data/dictionary.ts'), 'monthly', 0.8),
    entry('/practice', pageDate('/practice'), 'monthly', 0.75),
    entry('/start', pageDate('/start'), 'monthly', 0.7),
    entry('/journeys', pageDate('/journeys', 'data/reading-journeys.ts'), 'monthly', 0.7),
    entry('/story', pageDate('/story'), 'monthly', 0.6),
    entry('/collections', pageDate('/collections'), 'monthly', 0.75),
  ];

  // 2. Individual Entity Pages
  const wisdomDate = lastChanged('data/wisdom-for-life.ts', 'app/wisdom-for-life/[slug]/page.tsx');
  const wisdomRoutes = wisdomTopics.map((w) => entry(`/wisdom-for-life/${w.slug}`, wisdomDate, 'weekly', 0.85));
  // /guidance/<slug> serves the same page with a canonical to /wisdom-for-life/<slug>, so only the canonical URL is listed.

  const topicDate = lastChanged('data/topics.ts', 'app/topics/[id]/page.tsx');
  const topicRoutes = topics.map((t) => entry(`/topics/${t.id}`, topicDate, 'monthly', 0.8));

  const characterDate = lastChanged('data/characters.ts', 'app/characters/[id]/page.tsx');
  const characterRoutes = characters.map((c) => entry(`/characters/${c.id}`, characterDate, 'monthly', 0.8));

  const dictionaryDate = lastChanged('data/dictionary.ts', 'app/dictionary/[id]/page.tsx');
  const dictionaryRoutes = dictionary.map((d) => entry(`/dictionary/${d.id}`, dictionaryDate, 'monthly', 0.8));

  return [...staticRoutes, ...wisdomRoutes, ...topicRoutes, ...characterRoutes, ...dictionaryRoutes];
}

/** Scripture landing pages and chapter pages (all seeded + curated chapters), dated by when the scripture's text or commentary last changed. */
function scriptureRoutes(): { scriptures: MetadataRoute.Sitemap; chapters: MetadataRoute.Sitemap } {
  const scriptures: MetadataRoute.Sitemap = [];
  const chapters: MetadataRoute.Sitemap = [];
  for (const meta of getAllScriptures()) {
    const date = scriptureLastChanged(meta.id);
    scriptures.push(entry(`/scripture/${meta.id}`, date, 'monthly', meta.hasData ? 0.9 : 0.5));

    const chapterSet = new Set<number>(readSeededChapterNumbers(meta.id));
    for (const ch of getScriptureChapters(meta.id)) chapterSet.add(ch.id);
    for (const chId of Array.from(chapterSet).sort((a, b) => a - b)) {
      chapters.push(entry(`/scripture/${meta.id}/chapter/${chId}`, date, 'monthly', 0.75));
      // Parts 2…N of chapters too large for one page (lib/chapter-parts).
      for (const part of chapterParts(meta.id, chId)?.slice(1) ?? []) {
        chapters.push(entry(chapterPartHref(meta.id, chId, part.part), date, 'monthly', 0.6));
      }
    }
  }

  return { scriptures, chapters };
}

function versesSection(): MetadataRoute.Sitemap {
  return verseStaticParams().map((p) =>
    entry(`/scripture/${p.id}/chapter/${p.chapterId}/verse/${p.verseId}`, scriptureLastChanged(p.id), 'monthly', 0.7),
  );
}

export function sitemapSection(section: SitemapSection): MetadataRoute.Sitemap {
  const entries =
    section === 'pages'
      ? pagesSection()
      : section === 'scriptures'
        ? scriptureRoutes().scriptures
        : section === 'chapters'
          ? scriptureRoutes().chapters
          : versesSection();
  return entries.map((e) => ({ ...e, url: withTrailingSlash(e.url) }));
}

function escapeXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Serialises a section as a <urlset> sitemap document. */
export function sitemapXml(entries: MetadataRoute.Sitemap): string {
  const urls = entries
    .map((e) => {
      const lastmod = e.lastModified ? `<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>` : '';
      const freq = e.changeFrequency ? `<changefreq>${e.changeFrequency}</changefreq>` : '';
      const priority = e.priority != null ? `<priority>${e.priority.toFixed(2)}</priority>` : '';
      return `<url><loc>${escapeXml(e.url)}</loc>${lastmod}${freq}${priority}</url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Serialises the <sitemapindex>; each section's lastmod is its newest entry (omitted when none is known). */
export function sitemapIndexXml(): string {
  const items = SITEMAP_SECTIONS.map((section) => {
    const times = sitemapSection(section)
      .map((e) => (e.lastModified ? new Date(e.lastModified).getTime() : 0))
      .filter((t) => t > 0);
    const lastmod = times.length ? `<lastmod>${new Date(Math.max(...times)).toISOString()}</lastmod>` : '';
    return `<sitemap><loc>${SITE_URL}/sitemap-${section}.xml</loc>${lastmod}</sitemap>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

/**
 * next.config sets `trailingSlash: true`, so pages are served at `/path/` and
 * `/path` redirects. List the final URLs so crawlers don't hit a redirect.
 */
function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}
