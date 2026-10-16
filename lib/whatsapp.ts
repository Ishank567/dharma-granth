/** `url` with `utm_source=whatsapp&utm_medium=share` (any #fragment is kept). */
export function whatsappTagged(url: string): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', 'whatsapp');
  u.searchParams.set('utm_medium', 'share');
  return u.toString();
}

/**
 * WhatsApp share link (https://wa.me/?text=...). Opens the WhatsApp app on
 * phones and WhatsApp Web on desktop; no SDK or third-party script involved.
 * `utm_source=whatsapp` lets analytics attribute the visits a share brings back.
 */
export function whatsappShareUrl(parts: { heading: string; body?: string[]; url: string }): string {
  const text = [`*${parts.heading}*`, ...(parts.body ?? []).map((b) => b.trim()).filter(Boolean), whatsappTagged(parts.url)].join('\n\n');
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
