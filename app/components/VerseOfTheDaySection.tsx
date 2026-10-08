'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
  Sparkles,
  Sprout,
  Zap,
} from 'lucide-react';
import { readHref } from '@/lib/verse-paths';
import { triggerTactileFeedback } from '@/lib/haptics';
import { PedagogicalVerseCard, type ContemplationTier } from '@/app/components/PedagogicalVerseCard';
import { getPedagogicalVerse } from '@/data/pedagogical-registry';

export interface VerseOfTheDayItem {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit: string;
  chapterId: number;
  chapterTitle: string;
  verseId: number | string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  hindi: string;
  reflection: string;
  source: string;
}

const FEATURED_VERSES: VerseOfTheDayItem[] = [
  {
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
    chapterId: 2,
    chapterTitle: 'Sankhya Yoga',
    verseId: 47,
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    transliteration: "karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
    translation:
      'You have a right only to perform your prescribed duty; the fruits thereof are not your concern. Let not the fruit of action be your motive, nor let attachment to inaction take hold of you.',
    hindi:
      'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। न तो कर्म के फल का कारण बनो, और न ही कर्म न करने में तुम्हारी आसक्ति हो।',
    reflection:
      'Focus wholly on the integrity of your effort today. Relieve yourself of the mental exhaustion of controlling outcomes; true freedom is acting with excellence and surrendering the results.',
    source: 'भगवद्गीता २.४७ (Bhagavad Gita 2.47)',
  },
  {
    scriptureId: 'ishavasya',
    scriptureTitle: 'Isha Upanishad',
    scriptureTitleSanskrit: 'ईशावास्योपनिषद्',
    chapterId: 1,
    chapterTitle: 'Mantra 1',
    verseId: 1,
    sanskrit: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
    transliteration: 'īśā vāsyāmidaṃ sarvaṃ yatkiñca jagatyāṃ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||',
    translation:
      'All this — whatsoever moves in this changing world — is pervaded by the Divine. Enjoy and protect through renunciation; do not covet the wealth of anyone.',
    hindi:
      'इस गतिशील संसार में जो कुछ भी है, वह सब ईश्वर से व्याप्त है। त्याग भाव से इसका उपभोग करो; किसी के धन का लोभ मत करो।',
    reflection:
      'Recognize the sacred unity in all people and surroundings you encounter. Contentment begins when you release possessiveness and treat what you have as a sacred trust.',
    source: 'ईशावास्योपनिषद् १ (Isha Upanishad 1)',
  },
  {
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
    chapterId: 2,
    chapterTitle: 'Sankhya Yoga',
    verseId: 48,
    sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥',
    transliteration: 'yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya |\nsiddhyasiddhyoḥ samo bhūtvā samatvaṃ yoga ucyate ||',
    translation:
      'Perform your duty poised in yoga, abandoning attachment, O Dhananjaya. Be even-minded in both success and failure; equanimity of mind is called yoga.',
    hindi:
      'हे धनंजय! आसक्ति को त्यागकर तथा सिद्धि और असिद्धि में समान रहकर अपने कर्म करो; यह समत्व (समभाव) ही योग कहलाता है।',
    reflection:
      'Equanimity is not suppression or cold indifference; it is the quiet strength of meeting both triumphs and trials with the same calm, centered consciousness.',
    source: 'भगवद्गीता २.४८ (Bhagavad Gita 2.48)',
  },
  {
    scriptureId: 'mundaka',
    scriptureTitle: 'Mundaka Upanishad',
    scriptureTitleSanskrit: 'मुण्डकोपनिषद्',
    chapterId: 3,
    chapterTitle: 'Khanda 1',
    verseId: 6,
    sanskrit: 'सत्यमेव जयते नानृतं\nसत्येन पन्था विततो देवयानः ।',
    transliteration: 'satyameva jayate nānṛtaṃ\nsatyena panthā vitato devayānaḥ |',
    translation:
      'Truth alone triumphs, never falsehood. By truth is laid out the divine path traveled by sages whose desires are fulfilled.',
    hindi:
      'सत्य की ही विजय होती है, असत्य की नहीं। सत्य के द्वारा ही वह दिव्य मार्ग प्रशस्त होता है जिस पर पूर्णकाम ऋषिगण चलते हैं।',
    reflection:
      'Shortcuts and pretenses may offer fleeting convenience, but alignment with truth (Satya) is what builds enduring clarity, peace, and spiritual fortitude.',
    source: 'मुण्डकोपनिषद् ३.१.६ (Mundaka Upanishad 3.1.6)',
  },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

export function VerseOfTheDaySection() {
  const [index, setIndex] = useState(0);
  const [dateStr, setDateStr] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [genericTier, setGenericTier] = useState<ContemplationTier>('simple');

  useEffect(() => {
    const dayIdx = getDayOfYear() % FEATURED_VERSES.length;
    setIndex(dayIdx);
    setDateStr(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    );
  }, []);

  const current = FEATURED_VERSES[index];
  const pedagogical = getPedagogicalVerse(current.scriptureId, current.chapterId, current.verseId);

  // Check bookmark status
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dharma.bookmarkedVerses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const found = parsed.some(
            (b: { scriptureId: string; verseId: string | number }) =>
              b.scriptureId === current.scriptureId && String(b.verseId) === String(current.verseId),
          );
          setIsSaved(found);
          return;
        }
      }
      setIsSaved(false);
    } catch {
      setIsSaved(false);
    }
  }, [current]);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }

  // 3. SAVE (BOOKMARK) ACTION
  function handleSave() {
    triggerTactileFeedback('light', 'softTap');
    try {
      const raw = localStorage.getItem('dharma.bookmarkedVerses');
      let bookmarks: Array<Record<string, unknown>> = [];
      if (raw) {
        bookmarks = JSON.parse(raw);
        if (!Array.isArray(bookmarks)) bookmarks = [];
      }

      if (isSaved) {
        bookmarks = bookmarks.filter(
          (b) => !(b.scriptureId === current.scriptureId && String(b.verseId) === String(current.verseId)),
        );
        localStorage.setItem('dharma.bookmarkedVerses', JSON.stringify(bookmarks));
        setIsSaved(false);
        showToast('Verse removed from bookmarks');
      } else {
        bookmarks.push({
          scriptureId: current.scriptureId,
          scriptureTitle: current.scriptureTitle,
          chapterId: current.chapterId,
          chapterTitle: current.chapterTitle,
          verseId: current.verseId,
          sanskrit: current.sanskrit,
          translation: current.translation,
          hindi: current.hindi,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('dharma.bookmarkedVerses', JSON.stringify(bookmarks));
        setIsSaved(true);
        showToast('Verse saved to your bookmarks (संग्रह में सहेजा गया)');
      }
    } catch (e) {
      console.error(e);
      showToast('Could not update bookmarks');
    }
  }

  // 4. COPY ACTION
  async function handleCopy() {
    triggerTactileFeedback('light', 'click');
    const textToCopy = [
      current.sanskrit,
      `IAST: ${current.transliteration}`,
      `हिंदी: ${current.hindi}`,
      `English: ${current.translation}`,
      `Reflection: ${current.reflection}`,
      `Source: ${current.source}`,
      `Read at: ${typeof window !== 'undefined' ? window.location.origin : ''}${readHref(
        current.scriptureId,
        current.chapterId,
        current.verseId,
      )}`,
    ].join('\n\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast('Verse copied with translation & reflection');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy to clipboard');
    }
  }

  // 5. SHARE ACTION
  async function handleShare() {
    triggerTactileFeedback('light', 'click');
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}${readHref(
      current.scriptureId,
      current.chapterId,
      current.verseId,
    )}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${current.scriptureTitle} ${current.chapterId}.${current.verseId}`,
          text: `${current.sanskrit}\n\n${current.translation}\n\n${current.hindi}`,
          url,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard');
    } catch {
      showToast('Could not share link');
    }
  }

  function handlePrev() {
    triggerTactileFeedback('light', 'softTap');
    setIndex((prev) => (prev - 1 + FEATURED_VERSES.length) % FEATURED_VERSES.length);
  }

  function handleNext() {
    triggerTactileFeedback('light', 'softTap');
    setIndex((prev) => (prev + 1) % FEATURED_VERSES.length);
  }

  return (
    <section
      aria-labelledby="verse-of-the-day-heading"
      className="relative border-b border-dharma-border bg-gradient-to-b from-dharma-bg via-dharma-card/50 to-dharma-bg py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-saffron-600 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
                दैनिक श्लोक · Verse of the Day
              </p>
            </div>
            <h2
              id="verse-of-the-day-heading"
              className="font-serif text-3xl font-bold text-dharma-text sm:text-4xl"
            >
              One Verse, Read with Care
            </h2>
            <p className="mt-1 text-sm text-dharma-muted">
              for a quiet moment of contemplation before continuing your day.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-dharma-muted" suppressHydrationWarning>
              {dateStr}
            </span>
            <div className="flex items-center gap-1 border-l border-dharma-border pl-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous contemplation verse"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-card p-2 text-dharma-muted transition hover:border-saffron-300 hover:text-dharma-text"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next contemplation verse"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-card p-2 text-dharma-muted transition hover:border-saffron-300 hover:text-dharma-text"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* If Current Verse has a Pedagogical Breakdown, Render Pedagogical Card */}
        {pedagogical ? (
          <PedagogicalVerseCard data={pedagogical} initialTier="simple" />
        ) : (
          /* Generic Verse Card with Depth Selector & Actions */
          <article className="relative overflow-hidden rounded-3xl border border-amber-200/90 bg-dharma-card shadow-xl dark:border-amber-900/50">
            {/* Top Bar with Depth Selector */}
            <div className="border-b border-dharma-border bg-gradient-to-r from-amber-500/10 via-saffron-500/10 to-amber-500/5 px-6 py-4 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{current.source}</span>
                  </span>
                  <span className="text-xs text-dharma-muted">
                    {index + 1} of {FEATURED_VERSES.length}
                  </span>
                </div>

                {/* Depth Tier Selector: [⚡ Quick] [🌱 Simple] [📖 Deep] */}
                <div
                  role="tablist"
                  aria-label="Contemplation depth"
                  className="inline-flex rounded-full border border-dharma-border bg-dharma-panel p-1 shadow-inner"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={genericTier === 'quick'}
                    onClick={() => {
                      triggerTactileFeedback('light', 'softTap');
                      setGenericTier('quick');
                    }}
                    className={`flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                      genericTier === 'quick'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-dharma-muted hover:text-dharma-text'
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>⚡ Quick</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={genericTier === 'simple'}
                    onClick={() => {
                      triggerTactileFeedback('light', 'softTap');
                      setGenericTier('simple');
                    }}
                    className={`flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                      genericTier === 'simple'
                        ? 'bg-saffron-600 text-white shadow'
                        : 'text-dharma-muted hover:text-dharma-text'
                    }`}
                  >
                    <Sprout className="h-3.5 w-3.5" />
                    <span>🌱 Simple</span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={genericTier === 'deep'}
                    onClick={() => {
                      triggerTactileFeedback('light', 'softTap');
                      setGenericTier('deep');
                    }}
                    className={`flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                      genericTier === 'deep'
                        ? 'bg-stone-800 text-amber-200 shadow dark:bg-stone-700'
                        : 'text-dharma-muted hover:text-dharma-text'
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>📖 Deep</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.1fr]">
              {/* Left Column: Sanskrit & Transliteration */}
              <div className="relative overflow-hidden bg-gradient-to-br from-saffron-900 via-amber-900 to-stone-900 p-6 text-white sm:p-8 lg:p-10 flex flex-col justify-between">
                <div className="pointer-events-none absolute inset-0 mandala-bg opacity-15" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full border border-amber-400/20 opacity-20" />

                <div className="relative z-10">
                  <div className="my-6">
                    <p
                      lang="sa"
                      className="font-devanagari text-2xl font-medium leading-[2.1] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-3xl sm:leading-[2.1]"
                    >
                      {current.sanskrit}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 border-t border-white/15 pt-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-300/80 mb-1">
                    Transliteration (IAST)
                  </p>
                  <p className="text-sm italic leading-relaxed text-amber-100/90 whitespace-pre-line">
                    {current.transliteration}
                  </p>
                </div>
              </div>

              {/* Right Column: English, Hindi, Reflection, & Actions */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-dharma-card">
                <div className="space-y-6">
                  {genericTier === 'quick' ? (
                    <div className="rounded-2xl border border-amber-300/80 bg-amber-500/10 p-5 dark:border-amber-900/60">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                        ⚡ In One Line
                      </p>
                      <p className="mt-2 font-serif text-lg font-bold text-dharma-text leading-snug">
                        &ldquo;{current.reflection}&rdquo;
                      </p>
                      <p className="mt-3 text-xs text-dharma-muted">
                        Switch to Simple or Deep mode to read full linguistic translations and commentary.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Plain English Translation */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-saffron-700 dark:text-saffron-400">
                          English Meaning
                        </h3>
                        <p className="mt-2 font-serif text-base leading-relaxed text-dharma-text sm:text-lg">
                          {current.translation}
                        </p>
                      </div>

                      {/* Hindi Bhavarth */}
                      <div className="border-t border-dharma-border pt-5">
                        <h3
                          lang="hi"
                          className="font-devanagari text-xs font-bold uppercase tracking-[0.14em] text-rose-700 dark:text-rose-400"
                        >
                          हिंदी भावार्थ
                        </h3>
                        <p
                          lang="hi"
                          className="mt-2 font-devanagari text-base leading-loose text-dharma-text sm:text-lg"
                        >
                          {current.hindi}
                        </p>
                      </div>

                      {/* Reflection */}
                      <div className="rounded-2xl border border-amber-200/80 bg-amber-500/5 p-4 dark:border-amber-900/40">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                          दैनिक चिंतन · Today’s Contemplation
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-dharma-text/90 italic">
                          &ldquo;{current.reflection}&rdquo;
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions: Save, Copy, Share, Read Context */}
                <div className="mt-8 border-t border-dharma-border pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* 3. Save */}
                      <button
                        type="button"
                        onClick={handleSave}
                        aria-label={isSaved ? 'Remove from saved verses' : 'Save verse to bookmarks'}
                        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition shadow-sm ${
                          isSaved
                            ? 'border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-200'
                            : 'border-dharma-border bg-dharma-panel text-dharma-text hover:border-amber-300 hover:text-amber-700'
                        }`}
                      >
                        <Bookmark
                          className={`h-3.5 w-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : 'text-dharma-muted'}`}
                        />
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                      </button>

                      {/* 4. Copy */}
                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copy verse text"
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-panel px-3.5 py-2 text-xs font-bold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700 shadow-sm"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-dharma-muted" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* 5. Share */}
                      <button
                        type="button"
                        onClick={handleShare}
                        aria-label="Share verse"
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-panel px-3.5 py-2 text-xs font-bold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700 shadow-sm"
                      >
                        <Share2 className="h-3.5 w-3.5 text-dharma-muted" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Read Context */}
                    <Link
                      href={readHref(current.scriptureId, current.chapterId, current.verseId)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Read Context</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Toast Notification */}
            {toastMsg && (
              <div
                role="status"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-amber-300 bg-stone-900/95 px-5 py-2 text-xs font-medium text-white shadow-2xl backdrop-blur-md animate-fade-in z-30"
              >
                {toastMsg}
              </div>
            )}
          </article>
        )}
      </div>
    </section>
  );
}
