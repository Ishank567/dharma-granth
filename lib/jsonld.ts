export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';

/** Absolute, trailing-slash URL (the site is exported with trailingSlash). */
export function absUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean.endsWith('/') ? clean : `${clean}/`}`;
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

/** A detail page: breadcrumb trail plus one main entity (Article, DefinedTerm, ...). */
export function pageLd(crumbs: Crumb[], main: Record<string, unknown>) {
  return { '@context': 'https://schema.org', '@graph': [main, breadcrumbLd(crumbs)] };
}

export function articleLd(opts: { path: string; headline: string; description: string; languages?: string[] }) {
  return {
    '@type': 'Article',
    '@id': `${absUrl(opts.path)}#article`,
    headline: opts.headline,
    description: opts.description,
    url: absUrl(opts.path),
    mainEntityOfPage: absUrl(opts.path),
    inLanguage: opts.languages ?? ['en', 'hi'],
    isAccessibleForFree: true,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function definedTermLd(opts: { path: string; name: string; alt?: string[]; description: string; setPath: string; setName: string }) {
  return {
    '@type': 'DefinedTerm',
    '@id': `${absUrl(opts.path)}#term`,
    name: opts.name,
    ...(opts.alt?.length ? { alternateName: opts.alt } : {}),
    description: opts.description,
    url: absUrl(opts.path),
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: opts.setName, url: absUrl(opts.setPath) },
  };
}
