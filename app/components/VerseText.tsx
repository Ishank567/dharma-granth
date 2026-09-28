import Link from 'next/link';
import { toDevanagari, verseLines } from '@/lib/verse-format';

interface Props {
  verse: {
    number: number | string;
    sanskrit?: string;
    transliteration?: string;
    hindi?: string;
    translation?: string;
  };
  chapterId: number;
  /** Dedicated verse URL, when this scripture has verse pages. */
  href?: string;
}

/**
 * A verse as plain, semantic HTML: the form every chapter page is exported
 * in, so crawlers, link previews and no-JS readers get the full text.
 * FullChapterVerses swaps each one for the interactive VerseCard right after
 * hydration. It mirrors the card's box, header and manuscript leaf (same id,
 * padding and line breaks) so the swap barely moves the layout, but carries
 * no toolbar, icons or animation: a rich card is ~13 KB of HTML per verse,
 * which would add ~2 GB across the 180k-verse export.
 * Styling lives in the short `.vt-*` classes in globals.css for the same
 * reason (repeated Tailwind lists cost ~1 KB per verse).
 */
export function VerseText({ verse: v, chapterId, href }: Props) {
  const label = String(v.number);
  const lines = v.sanskrit ? verseLines(v.sanskrit) : [];
  const title = `श्लोक ${label}`;
  return (
    <article id={`verse-${label}`} className="verse-card vt" aria-label={title}>
      <header className="vt-head">
        <span aria-hidden="true" className="vt-medal">
          {toDevanagari(label)}
        </span>
        <div>
          <p className="vt-ch">अध्याय {toDevanagari(chapterId)}</p>
          <h3 className="vt-title">
            {href ? <Link href={href}>{title}</Link> : title}
          </h3>
        </div>
        {/* Holds the toolbar's row on phones (the card gives it its own row there). */}
        <div aria-hidden="true" className="vt-toolbar" />
      </header>

      {lines.length > 0 && (
        <div className="verse-leaf vt-leaf">
          <p lang="sa" className="vt-sa">
            {lines.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
            <span className="vt-num">॥ {toDevanagari(label)} ॥</span>
          </p>
          {v.transliteration && (
            <p lang="sa-Latn" className="vt-tr">
              {v.transliteration.replace(/[\s|।॥0-9.]+$/, '')}
            </p>
          )}
        </div>
      )}

      {v.hindi && (
        <p lang="hi" className="vt-hi">
          {v.hindi}
        </p>
      )}
      {v.translation && (
        <p lang="en" className="vt-en">
          {v.translation}
        </p>
      )}
    </article>
  );
}
