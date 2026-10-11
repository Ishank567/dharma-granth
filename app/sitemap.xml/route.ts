import { sitemapIndexXml } from '@/lib/sitemap-sections';

// Sitemap index; the sections are app/sitemap-<section>.xml. Emitted as a
// static file by `output: 'export'`.
export const dynamic = 'force-static';

export function GET() {
  return new Response(sitemapIndexXml(), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
