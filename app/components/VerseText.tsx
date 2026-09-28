import { toDevanagari, verseLines } from './VerseCard';

interface Props {
  verse: {
    number: number | string;
    sanskrit?: string;
    transliteration?: string;
    hindi?: string;
    translation?: string;
  };
  chapterId: number;
}

/**
 * A verse as plain, semantic HTML: the form every chapter page is exported
 * in, so crawlers, link previews and no-JS readers get the full text.
 * FullChapterVerses swaps each one for the interactive VerseCard right after
 * hydration. It mirrors the card's box, header and manuscript leaf (same id,
 * padding and line breaks) so the swap barely moves the layout, but carries
 * no toolbar, icons or animation: a rich card is ~13 KB of HTML per verse,
 * which would push the 180k-verse export past GitHub Pages' 1 GB limit.
 */
export function VerseText({ verse: v, chapterId }: Props) {
  const label = String(v.number);
  const lines = v.sanskrit ? verseLines(v.sanskrit) : [];
  return (
    <article
      id={`verse-${label}`}
      className="verse-card relative scroll-mt-24 rounded-[28px] border border-dharma-border bg-dharma-card"
      aria-label={`श्लोक ${label}`}
    >
      <div className="relative p-5 md:p-7">
        <header className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-saffron-500/15 font-devanagari text-sm font-bold text-saffron-700"
          >
            {toDevanagari(label)}
          </span>
          <div className="shrink-0 whitespace-nowrap">
            <p className="text-[11px] font-semibold text-saffron-700/80 dark:text-saffron-300/80">
              अध्याय {toDevanagari(chapterId)}
            </p>
            <h3 className="font-serif text-base font-bold text-dharma-text">श्लोक {label}</h3>
          </div>
          {/* Holds the toolbar's row on phones (the card gives it its own row there). */}
          <div aria-hidden="true" className="order-last h-11 w-full sm:hidden" />
        </header>

        {lines.length > 0 && (
          <div className="verse-leaf relative rounded-2xl px-5 py-6 text-center md:px-10 md:py-8">
            <p lang="sa" className="font-devanagari text-base leading-loose text-dharma-text md:text-lg">
              {lines.map((line, i) => (
                <span key={i} className="block px-2.5 py-1">
                  {line}
                </span>
              ))}
              <span className="mt-2 block font-bold text-saffron-700 dark:text-amber-300">
                ॥ {toDevanagari(label)} ॥
              </span>
            </p>
            {v.transliteration && (
              <p
                lang="sa-Latn"
                className="mx-auto mt-4 max-w-2xl whitespace-pre-line border-t border-amber-700/15 pt-4 text-sm italic leading-relaxed text-dharma-muted md:text-[15px]"
              >
                {v.transliteration.replace(/[\s|।॥0-9.]+$/, '')}
              </p>
            )}
          </div>
        )}

        {(v.hindi || v.translation) && (
          <div className="mt-5 space-y-4">
            {v.hindi && (
              <p lang="hi" className="font-devanagari text-base leading-loose text-dharma-text md:text-[17px]">
                {v.hindi}
              </p>
            )}
            {v.translation && (
              <p lang="en" className="text-sm leading-relaxed text-dharma-muted md:text-base">
                {v.translation}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
