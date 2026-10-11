import { SITE_URL } from '@/lib/jsonld';

/** Server-rendered schema.org JSON-LD (`<` escaped so text can't close the script tag). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export { SITE_URL };
