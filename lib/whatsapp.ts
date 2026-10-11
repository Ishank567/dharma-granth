/**
 * WhatsApp share link (https://wa.me/?text=...). Opens the WhatsApp app on
 * phones and WhatsApp Web on desktop; no SDK or third-party script involved.
 * `utm_source=whatsapp` lets analytics attribute the visits a share brings back.
 */
export function whatsappShareUrl(parts: { heading: string; body?: string[]; url: string }): string {
  const url = new URL(parts.url);
  url.searchParams.set('utm_source', 'whatsapp');
  url.searchParams.set('utm_medium', 'share');
  const text = [`*${parts.heading}*`, ...(parts.body ?? []).map((b) => b.trim()).filter(Boolean), url.toString()].join('\n\n');
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
