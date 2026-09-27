import { Quote, ExternalLink } from 'lucide-react';
import { FadeUpOnView, Stagger, StaggerItem } from '@/app/components/motion/primitives';
import { pinterestQuotes } from '@/data/pinterest-quotes';

/**
 * Renders pins pulled from Pinterest (via `npm run fetch:pinterest`) as
 * quote/wisdom cards. Renders nothing until data/pinterest-quotes.ts has
 * been populated by the fetch script.
 */
export function PinterestWisdom() {
  if (pinterestQuotes.length === 0) return null;

  return (
    <FadeUpOnView>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-dharma-text mb-1">
            Wisdom from Pinterest
          </h2>
          <p className="text-sm text-dharma-muted">
            {pinterestQuotes.length} pins from your boards
          </p>
        </div>
      </div>

      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pinterestQuotes.map((pin) => (
          <StaggerItem key={pin.id}>
            <a
              href={pin.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[4/5] rounded-2xl overflow-hidden border border-dharma-border shadow-sm hover:shadow-lg transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
              <img
                src={pin.imageUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <Quote className="absolute top-3 left-3 w-5 h-5 text-white/70" />
              <ExternalLink className="absolute top-3 right-3 w-4 h-4 text-white/70 opacity-0 group-hover:opacity-100 transition" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-serif text-white text-base leading-snug line-clamp-4">
                  {pin.quote}
                </p>
                {pin.board && (
                  <p className="mt-2 text-xs uppercase tracking-wider text-white/70">
                    {pin.board}
                  </p>
                )}
              </div>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </FadeUpOnView>
  );
}
