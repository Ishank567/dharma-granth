import { sitemapSection, sitemapXml } from '@/lib/sitemap-sections';

export const dynamic = 'force-static';

export function GET() {
  return new Response(sitemapXml(sitemapSection('pages')), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
