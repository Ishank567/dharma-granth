import { MessageCircle } from 'lucide-react';
import { ShareButton } from '@/app/components/ShareButton';
import { absUrl } from '@/lib/jsonld';
import { whatsappShareUrl } from '@/lib/whatsapp';

/**
 * WhatsApp + Share for a page's own URL. The WhatsApp link is a plain anchor
 * built when the page is built (no client JS); only the small ShareButton is a
 * client component. Works in server and client components alike.
 */
export function ShareChips({
  title,
  summary,
  path,
  tone = 'light',
  className = '',
}: {
  /** Name of the thing being shared: "Karma Yoga". */
  title: string;
  /** One-paragraph description; trimmed to ~180 characters. */
  summary?: string;
  /** Site path of the page: "/concepts/karma". */
  path: string;
  /** `dark` chips sit on a coloured hero, `light` on a card. */
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const flat = (summary ?? '').replace(/\s+/g, ' ').trim();
  const text = flat.length > 180 ? `${flat.slice(0, 179).trimEnd()}…` : flat;
  const url = absUrl(path);
  const heading = `${title} · Dharma Granth`;
  const chip =
    'inline-flex min-h-[44px] items-center gap-1.5 px-4 rounded-full text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 ' +
    (tone === 'dark'
      ? 'bg-white/15 hover:bg-white/25 backdrop-blur text-white focus-visible:outline-white'
      : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-400 hover:text-saffron-800 dark:hover:text-saffron-300 focus-visible:outline-saffron-600');

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <a
        href={whatsappShareUrl({ heading, body: text ? [text] : [], url })}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share ${title} on WhatsApp`}
        className={chip}
      >
        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
      <ShareButton title={heading} text={text} url={url} className={chip}>
        Share
      </ShareButton>
    </div>
  );
}
