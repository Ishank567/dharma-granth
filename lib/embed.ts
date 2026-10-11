/**
 * "Embed this verse": a self-contained HTML quote other sites can paste into a
 * page. It is a plain <blockquote> with inline styles (no script, no iframe, so
 * it works in any CMS and needs no CSP or X-Frame-Options exceptions) and a
 * normal link back to the verse page, which is the credit and the backlink.
 */
export type EmbedMeaning = 'hindi' | 'english' | 'none';

export interface VerseEmbedInput {
  reference: string;
  sanskrit?: string;
  hindi?: string;
  english?: string;
  /** Absolute URL of the verse page. */
  url: string;
  meaning: EmbedMeaning;
}

const MAX_MEANING = 400;

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clip(text: string, max: number): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

/** Verse lines keep their breaks; everything is escaped. */
function lines(text: string): string {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map(escapeHtml)
    .join('<br>');
}

export function verseEmbedHtml(input: VerseEmbedInput): string {
  const sanskrit = (input.sanskrit ?? '').trim();
  const meaningText =
    input.meaning === 'hindi' ? input.hindi : input.meaning === 'english' ? input.english : undefined;
  const meaning = clip(meaningText ?? '', MAX_MEANING);
  const lang = input.meaning === 'hindi' ? 'hi' : 'en';
  const url = escapeHtml(input.url);

  const parts: string[] = [];
  if (sanskrit) {
    parts.push(
      `<p lang="sa" style="margin:0 0 .75em;font-size:1.25em;line-height:1.7;font-weight:600">${lines(sanskrit)}</p>`,
    );
  }
  if (meaning) {
    parts.push(`<p lang="${lang}" style="margin:0 0 .75em;line-height:1.6">${escapeHtml(meaning)}</p>`);
  }
  parts.push(
    `<footer style="font-size:.85em;opacity:.8">— ${escapeHtml(input.reference)}, ` +
      `<a href="${url}" style="color:inherit">read the full verse on Dharma Granth</a></footer>`,
  );

  return (
    `<blockquote cite="${url}" style="margin:1em 0;padding:1em 1.25em;border-left:4px solid #c2410c;` +
    `background:#fffaf0;color:#3b2415;font-family:Georgia,serif;border-radius:4px">\n` +
    parts.map((p) => `  ${p}`).join('\n') +
    `\n</blockquote>`
  );
}
