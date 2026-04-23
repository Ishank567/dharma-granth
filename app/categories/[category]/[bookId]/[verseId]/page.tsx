import { getVerseDetail, getInterpretedVerseParams } from '@/app/lib/content';
import InterpretationPanel from '@/app/components/InterpretationPanel';
import BookmarkButton from '@/app/components/BookmarkButton';
import ShareButton from '@/app/components/ShareButton';
import VerseJournalPanel from '@/app/components/VerseJournalPanel';
import KeyboardNav from '@/app/components/KeyboardNav';
import ReadingTracker from '@/app/components/ReadingTracker';
import SpeakerBadge from '@/app/components/SpeakerBadge';
import ChapterContextStrip from '@/app/components/ChapterContextStrip';
import { getChapterPosition, isGita, resolveSpeaker } from '@/app/lib/gitaContext';
import type { Interpretation } from '@/app/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return getInterpretedVerseParams();
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; bookId: string; verseId: string }> }): Promise<Metadata> {
  const { bookId, verseId: verseIdStr } = await params;
  const detail = getVerseDetail(bookId, parseInt(verseIdStr, 10));
  if (detail) {
    return {
      title: `श्लोक ${detail.verse.verse_number} — ${detail.book.title_hindi} — धर्म ग्रंथ`,
      description: detail.verse.original_text.slice(0, 160),
    };
  }
  return { title: 'श्लोक — धर्म ग्रंथ' };
}

export default async function VerseDetailPage({
  params,
}: {
  params: Promise<{ category: string; bookId: string; verseId: string }>;
}) {
  const { category, bookId, verseId: verseIdStr } = await params;
  const verseId = parseInt(verseIdStr, 10);
  const detail = getVerseDetail(bookId, verseId);
  if (!detail) notFound();

  const { verse, book, interpretation: rawInterp, prevVerseId, nextVerseId, totalVerses } = detail;
  const interpretation: Interpretation | null = rawInterp
    ? {
        id: rawInterp.id,
        verse_id: rawInterp.verse_id,
        shabdarth: rawInterp.shabdarth ?? '',
        bhavarth: rawInterp.bhavarth ?? '',
        simple_example: rawInterp.simple_example ?? '',
        guided_learning: rawInterp.guided_learning ?? '',
        scientific_temperament: rawInterp.scientific_temperament ?? '',
        modern_relevance: rawInterp.modern_relevance ?? '',
        next_curiosity: rawInterp.next_curiosity ?? '',
        source: (rawInterp.source as Interpretation['source']) || 'ai',
        created_at: rawInterp.created_at ?? '',
      }
    : null;
  const bookTitle = book.title_hindi;
  const gitaView = isGita(bookId);
  const chapterPosition = gitaView ? getChapterPosition(book, verse) : null;
  const speaker = gitaView ? resolveSpeaker(book, verse) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ReadingTracker
        bookSlug={bookId}
        categorySlug={category}
        bookTitle={bookTitle}
        verseId={verse.id}
        verseNumber={verse.verse_number}
        totalVerses={totalVerses}
      />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
        <span className="mx-2">›</span>
        <Link href={`/categories/${category}`} className="hover:text-accent transition-colors">
          {book.category_name || category}
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/categories/${category}/${bookId}`} className="hover:text-accent transition-colors">
          {bookTitle}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">श्लोक {verse.verse_number}</span>
      </nav>

      {/* Chapter context strip (Gita only) */}
      {chapterPosition && <ChapterContextStrip position={chapterPosition} />}

      {/* Verse Display */}
      <div className="rounded-2xl border border-verse-border bg-verse-bg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif-deva text-2xl font-bold text-foreground">
              श्लोक {verse.verse_number}
            </h1>
            <p className="text-sm text-muted mt-1">{bookTitle}</p>
            {speaker && (
              <div className="mt-3">
                <SpeakerBadge speaker={speaker} />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ShareButton
              text={verse.original_text.slice(0, 200)}
              title={`${bookTitle} — श्लोक ${verse.verse_number}`}
            />
            <BookmarkButton
              verseId={verse.id}
              bookSlug={bookId}
              categorySlug={category}
              originalText={verse.original_text.slice(0, 100)}
              bookTitle={bookTitle}
              verseNumber={verse.verse_number}
            />
          </div>
        </div>

        {/* Original Text */}
        <div className="font-scripture text-xl leading-loose text-foreground whitespace-pre-wrap mb-6">
          {verse.original_text}
        </div>

        {/* Transliteration */}
        {verse.transliteration && (
          <div className="border-t border-verse-border pt-4 mb-4">
            <p className="text-xs font-semibold text-muted mb-1">लिप्यन्तरण:</p>
            <p className="text-sm text-muted italic">{verse.transliteration}</p>
          </div>
        )}

        {/* Hindi Translation */}
        {verse.translation_hindi && (
          <div className="border-t border-verse-border pt-4 mb-4">
            <p className="text-xs font-semibold text-muted mb-1">हिन्दी अर्थ:</p>
            <p className="text-foreground/80 leading-relaxed">{verse.translation_hindi}</p>
          </div>
        )}

        {/* English Translation */}
        {verse.translation_english && (
          <div className="border-t border-verse-border pt-4">
            <p className="text-xs font-semibold text-muted mb-1">अंग्रेज़ी अर्थ:</p>
            <p className="text-muted leading-relaxed italic">{verse.translation_english}</p>
          </div>
        )}
      </div>

      {/* Interpretation */}
      <div className="mb-8">
        <h2 className="font-serif-deva text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          ✨ गहन हिन्दी व्याख्या
        </h2>
        <InterpretationPanel
          verseId={verse.id}
          initialInterpretation={interpretation}
          nextVerseHref={nextVerseId ? `/categories/${category}/${bookId}/${nextVerseId}` : null}
          categorySlug={category}
          bookSlug={bookId}
        />
      </div>

      <div className="mb-8">
        <VerseJournalPanel
          verseId={verse.id}
          bookSlug={bookId}
          categorySlug={category}
          bookTitle={bookTitle}
          verseNumber={verse.verse_number}
        />
      </div>

      {/* Navigation */}
      <KeyboardNav
        prevHref={prevVerseId ? `/categories/${category}/${bookId}/${prevVerseId}` : null}
        nextHref={nextVerseId ? `/categories/${category}/${bookId}/${nextVerseId}` : null}
      />
      <div className="flex items-center justify-between pt-6 border-t border-border">
        {prevVerseId ? (
          <Link
            href={`/categories/${category}/${bookId}/${prevVerseId}`}
            className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
          >
            ← पिछला श्लोक
          </Link>
        ) : (
          <div />
        )}

        <Link
          href={`/categories/${category}/${bookId}`}
          className="text-sm text-muted hover:text-accent transition-colors"
        >
          सभी श्लोक
        </Link>

        {nextVerseId ? (
          <Link
            href={`/categories/${category}/${bookId}/${nextVerseId}`}
            className="rounded-xl border border-border bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            अगला श्लोक →
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-muted mt-4">
        ← → तीर कुंजियों से पिछला/अगला श्लोक देखें
      </p>
    </div>
  );
}
