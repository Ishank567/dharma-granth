import type { Verse } from '@/app/lib/types';
import BookmarkButton from '@/app/components/BookmarkButton';
import Link from 'next/link';

interface Props {
  verse: Verse;
  bookTitle: string;
  bookSlug: string;
  categorySlug: string;
  showInterpretButton?: boolean;
}

export default function VerseDisplay({ verse, bookTitle, bookSlug, categorySlug, showInterpretButton = true }: Props) {
  const verseHref = `/categories/${categorySlug}/${bookSlug}/${verse.id}`;

  return (
    <div
      id={`verse-${verse.id}`}
      className="group relative rounded-2xl border border-verse-border bg-verse-bg p-6 transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-0.5 duration-200"
    >
      {/* Verse header */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={verseHref}
          className="inline-flex items-center gap-2 rounded-full bg-accent-bg px-3 py-1 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
        >
          श्लोक {verse.verse_number}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent/60">→</span>
        </Link>
        <BookmarkButton
          verseId={verse.id}
          bookSlug={bookSlug}
          categorySlug={categorySlug}
          originalText={verse.original_text.slice(0, 100)}
          bookTitle={bookTitle}
          verseNumber={verse.verse_number}
        />
      </div>

      {/* Original text — clickable */}
      <Link href={verseHref} className="block">
        <div className="font-scripture text-lg leading-loose text-foreground whitespace-pre-wrap cursor-pointer">
          {verse.original_text}
        </div>
      </Link>

      {/* Translation Hindi */}
      {verse.translation_hindi && (
        <div className="mt-4 border-t border-verse-border pt-4">
          <p className="text-xs font-semibold text-muted mb-1">हिन्दी अर्थ:</p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            {verse.translation_hindi}
          </p>
        </div>
      )}

      {/* Translation English */}
      {verse.translation_english && (
        <div className="mt-3 border-t border-verse-border pt-3">
          <p className="text-xs font-semibold text-muted mb-1">अंग्रेज़ी अर्थ:</p>
          <p className="text-sm text-muted leading-relaxed italic">
            {verse.translation_english}
          </p>
        </div>
      )}

      {/* Interpret button */}
      {showInterpretButton && (
        <div className="mt-4 pt-3 border-t border-verse-border flex items-center justify-between">
          <Link
            href={verseHref}
            className="inline-flex items-center gap-2 rounded-xl bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent hover:bg-accent/20 hover:shadow-sm transition-all active:scale-[0.98]"
          >
            ✨ गहन हिन्दी व्याख्या
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <span className="text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
            क्लिक करें गहन अध्ययन के लिए
          </span>
        </div>
      )}
    </div>
  );
}
