'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { Atom, BookOpen, ChevronDown, Compass, Languages, Lightbulb, Quote, ScrollText, Sparkles } from 'lucide-react';
import { cleanVerseField, toDevanagari, verseLines } from '@/lib/verse-format';
import { parseWordMeanings } from '@/lib/word-gloss';
import { ExplainLine } from '@/app/components/study/ExplainLine';
import { CompareViews } from '@/app/components/study/CompareViews';
import { CommentaryCompare } from '@/app/components/study/CommentaryCompare';
import type { ReaderProvenance, ReaderVerseText } from '@/lib/reader-actions';
import type { ReaderSettings } from '@/lib/useReaderSettings';

/* ── Type scale: full class strings so Tailwind keeps them ──────────── */

const SANSKRIT_SIZE = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-2xl sm:text-3xl',
  lg: 'text-[1.75rem] sm:text-4xl',
  xl: 'text-3xl sm:text-5xl',
} as const;

const TRANSLATION_SIZE = {
  sm: 'text-[0.95rem]',
  md: 'text-base sm:text-[1.075rem]',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
} as const;

// Devanagari carries stacked marks above and below the line, so it needs more leading than Latin.
const DEVANAGARI_LEADING = {
  compact: 'leading-[1.7]',
  normal: 'leading-[1.85]',
  relaxed: 'leading-[2.05]',
  loose: 'leading-[2.35]',
} as const;

const LATIN_LEADING = {
  compact: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
} as const;

/* ── The six kinds of content, each with its own frame, chip and icon ─── */

type Kind = 'source' | 'aid' | 'translation' | 'tradition' | 'editorial' | 'reflection' | 'research' | 'sources';

const KINDS: Record<Kind, { chip: string; chipHi: string; frame: string; chipCls: string; Icon: typeof BookOpen }> = {
  source: {
    chip: 'Source scripture',
    chipHi: 'मूल पाठ',
    frame: 'border-2 border-amber-700/35 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-950/25',
    chipCls: 'border-amber-700/40 bg-amber-100 text-amber-950 dark:border-amber-500/40 dark:bg-amber-900/40 dark:text-amber-100',
    Icon: ScrollText,
  },
  aid: {
    chip: 'Reading aid for the source',
    chipHi: 'मूल पाठ सहायक',
    frame: 'border border-amber-700/25 bg-amber-50/40 dark:border-amber-500/20 dark:bg-amber-950/15',
    chipCls: 'border-amber-700/30 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-900/30 dark:text-amber-100',
    Icon: Languages,
  },
  translation: {
    chip: 'Translation',
    chipHi: 'अनुवाद',
    frame: 'border border-dharma-border border-l-4 border-l-saffron-600 bg-dharma-card',
    chipCls: 'border-saffron-600/40 bg-saffron-100 text-saffron-950 dark:border-saffron-500/40 dark:bg-saffron-900/40 dark:text-saffron-100',
    Icon: Languages,
  },
  tradition: {
    chip: 'Traditional commentary',
    chipHi: 'परम्परागत भाष्य',
    frame: 'border border-stone-400/50 border-l-4 border-l-stone-600 bg-stone-100/70 dark:border-stone-600/50 dark:border-l-stone-400 dark:bg-stone-900/40',
    chipCls: 'border-stone-500/40 bg-stone-200 text-stone-900 dark:border-stone-500/40 dark:bg-stone-800 dark:text-stone-100',
    Icon: Quote,
  },
  editorial: {
    chip: 'Editorial explanation',
    chipHi: 'संपादकीय व्याख्या',
    frame: 'border border-sky-500/30 border-l-4 border-l-sky-600 bg-sky-50/60 dark:border-sky-500/25 dark:bg-sky-950/20',
    chipCls: 'border-sky-600/40 bg-sky-100 text-sky-950 dark:border-sky-500/40 dark:bg-sky-900/40 dark:text-sky-100',
    Icon: Lightbulb,
  },
  reflection: {
    chip: 'Modern reflection · not scripture',
    chipHi: 'आधुनिक चिंतन',
    frame: 'border border-emerald-600/30 border-l-4 border-l-emerald-600 bg-emerald-50/60 dark:border-emerald-500/25 dark:bg-emerald-950/20',
    chipCls: 'border-emerald-600/40 bg-emerald-100 text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100',
    Icon: Compass,
  },
  research: {
    chip: 'Research context · not scripture',
    chipHi: 'शोध संदर्भ',
    frame: 'border border-indigo-500/30 border-l-4 border-l-indigo-600 bg-indigo-50/60 dark:border-indigo-400/25 dark:bg-indigo-950/20',
    chipCls: 'border-indigo-600/40 bg-indigo-100 text-indigo-950 dark:border-indigo-400/40 dark:bg-indigo-900/40 dark:text-indigo-100',
    Icon: Atom,
  },
  sources: {
    chip: 'Sources and edition',
    chipHi: 'स्रोत',
    frame: 'border border-dharma-border bg-dharma-card/70',
    chipCls: 'border-dharma-border bg-dharma-bg text-dharma-text',
    Icon: BookOpen,
  },
};

/** Quiet corner brackets for the source verse only. Decorative: hidden from assistive tech and by the "hide decorative" setting. */
function CornerMarks() {
  const c = 'absolute h-3 w-3 border-amber-700/50 dark:border-amber-400/40';
  return (
    <span aria-hidden="true" data-decor="">
      <span className={`${c} left-2 top-2 border-l-2 border-t-2 rounded-tl-md`} />
      <span className={`${c} right-2 top-2 border-r-2 border-t-2 rounded-tr-md`} />
      <span className={`${c} bottom-2 left-2 border-b-2 border-l-2 rounded-bl-md`} />
      <span className={`${c} bottom-2 right-2 border-b-2 border-r-2 rounded-br-md`} />
    </span>
  );
}

function AiBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/40 bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-950 dark:border-violet-400/40 dark:bg-violet-900/40 dark:text-violet-100">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * One layer of the page. `collapsible` layers are native <details>: open in
 * the server HTML (so every reader and crawler gets the text), then closed on
 * phones after mount so a long verse page stays scannable.
 */
function Layer({
  id,
  kind,
  title,
  titleHi,
  badge,
  collapsible = false,
  children,
}: {
  id: string;
  kind: Kind;
  title: string;
  titleHi?: string;
  badge?: ReactNode;
  collapsible?: boolean;
  children: ReactNode;
}) {
  const k = KINDS[kind];
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (collapsible && ref.current && window.matchMedia('(max-width: 639px)').matches) ref.current.open = false;
  }, [collapsible]);

  const head = (
    <>
      <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${k.chipCls}`}>
        <k.Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`inline-flex flex-wrap items-center gap-x-2 rounded-full border px-2.5 py-0.5 text-xs font-bold ${k.chipCls}`}>
          <span lang="hi" className="font-devanagari text-[0.8125rem] leading-snug">
            {k.chipHi}
          </span>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
          <span>{k.chip}</span>
        </span>
        <span className="mt-1 block font-serif text-base font-bold text-dharma-text sm:text-lg">
          <span id={`${id}-title`}>{title}</span>
          {titleHi && (
            <span lang="hi" className="ml-2 font-devanagari text-[0.95rem] font-normal text-dharma-muted">
              {titleHi}
            </span>
          )}
        </span>
      </span>
      {badge}
    </>
  );

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`relative rounded-2xl shadow-sm ${k.frame}`}>
      {kind === 'source' && <CornerMarks />}
      {collapsible ? (
        <details ref={ref} open className="group">
          <summary className="focus-ring flex min-h-[56px] cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 sm:px-6 [&::-webkit-details-marker]:hidden">
            {head}
            <ChevronDown className="h-5 w-5 shrink-0 text-dharma-muted transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="px-4 pb-5 sm:px-6">{children}</div>
        </details>
      ) : (
        <>
          <div className="flex items-center gap-3 px-4 pt-4 sm:px-6">{head}</div>
          <div className="px-4 pb-5 pt-3 sm:px-6">{children}</div>
        </>
      )}
    </section>
  );
}

/* ── Word-by-word ──────────────────────────────────────────────────── */

export { parseWordMeanings, type WordGloss } from '@/lib/word-gloss';

const dash = (s: string) => s.replace(/[\s|।॥0-9.]+$/, '');

/* ── The ten layers, in the required order ─────────────────────────── */

export function ReaderLayers({
  scriptureId,
  verse,
  chapterId,
  provenance: p,
  settings,
  onReport,
}: {
  scriptureId: string;
  verse: ReaderVerseText;
  chapterId: number;
  provenance: ReaderProvenance;
  settings: ReaderSettings;
  onReport: () => void;
}) {
  const sanskrit = cleanVerseField(verse.sanskrit);
  const lines = sanskrit ? verseLines(sanskrit) : [];
  const glosses = parseWordMeanings(verse.wordMeaning);
  const devLeading = DEVANAGARI_LEADING[settings.lineSpacing];
  const latinLeading = LATIN_LEADING[settings.lineSpacing];
  const tSize = TRANSLATION_SIZE[settings.translationSize];
  const aiCommentary = p.commentaryIsAi ? <AiBadge>AI-drafted · reviewed</AiBadge> : undefined;

  const isQuick = settings.readerMode === 'quick';
  const isDeep = settings.readerMode === 'deep';

  // Language preferences
  const showHindiTrans =
    settings.showHindi &&
    (settings.preferredLanguage === 'all' || settings.preferredLanguage === 'hindi' || isDeep);
  const showEnglishTrans =
    settings.showEnglish &&
    (settings.preferredLanguage === 'all' || settings.preferredLanguage === 'english' || isDeep);

  return (
    <article id={`verse-${verse.number}`} className="space-y-5" aria-label={`Verse ${verse.number}`}>
      {/* 1 · Original Sanskrit */}
      <Layer id="layer-sanskrit" kind="source" title="Original Sanskrit" titleHi="मूल संस्कृत">
        {lines.length > 0 ? (
          <>
          <p id="sanskrit-text" lang="sa" className={`text-center font-devanagari font-semibold text-dharma-text ${SANSKRIT_SIZE[settings.sanskritSize]} ${devLeading}`}>
            {lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
            <span aria-hidden="true" className="mt-2 block text-[0.6em] font-bold text-amber-800 dark:text-amber-300">
              ॥ {toDevanagari(chapterId)}.{toDevanagari(verse.number)} ॥
            </span>
          </p>
          <ExplainLine scriptureId={scriptureId} chapterId={chapterId} verseNumber={verse.number} lines={lines} scopeId="sanskrit-text" verseLabel={`${chapterId}.${verse.number}`} fullTranslation={cleanVerseField(verse.translation)} />
          </>
        ) : (
          <p className="text-center text-sm text-dharma-muted">The Sanskrit text is not available for this verse.</p>
        )}
      </Layer>

      {/* 2 · Roman transliteration (Shown in Simple and Deep modes) */}
      {!isQuick && settings.showTransliteration && verse.transliteration && (
        <Layer id="layer-transliteration" kind="aid" title="Roman transliteration" titleHi="लिप्यन्तरण (IAST)">
          <p lang="sa-Latn" className={`whitespace-pre-line font-serif italic text-dharma-text/90 ${tSize} ${latinLeading}`}>
            {dash(cleanVerseField(verse.transliteration))}
          </p>
        </Layer>
      )}

      {/* 3 · Pada / word-by-word (Deep mode or expanded aid in Simple mode) */}
      {!isQuick && verse.wordMeaning && (
        <Layer id="layer-padas" kind="aid" title="Word by word" titleHi="पदच्छेद" collapsible={!isDeep}>
          {glosses.length > 1 ? (
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {glosses.map((g, i) => (
                <div key={i} className="rounded-xl border border-amber-700/20 bg-dharma-card/70 px-3 py-2">
                  <dt lang="sa-Latn" className="font-serif text-sm font-bold italic text-amber-900 dark:text-amber-200">
                    {g.pada}
                  </dt>
                  <dd className={`text-sm text-dharma-text ${latinLeading}`}>{g.meaning}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className={`text-dharma-text ${tSize} ${latinLeading}`}>{verse.wordMeaning}</p>
          )}
        </Layer>
      )}

      {/* 4 · Hindi translation */}
      {showHindiTrans && verse.hindi && (
        <Layer
          id="layer-hindi"
          kind="translation"
          title="Hindi translation"
          titleHi="हिन्दी अनुवाद"
          badge={p.hindiIsAi ? <AiBadge>AI translation</AiBadge> : undefined}
        >
          <p lang="hi" className={`whitespace-pre-line font-devanagari text-dharma-text ${tSize} ${devLeading}`}>
            {cleanVerseField(verse.hindi)}
          </p>
        </Layer>
      )}

      {/* 5 · English translation */}
      {showEnglishTrans && verse.translation && (
        <Layer
          id="layer-english"
          kind="translation"
          title="English translation"
          badge={p.englishIsAi ? <AiBadge>AI translation</AiBadge> : undefined}
        >
          <p lang="en" className={`font-serif text-dharma-text ${tSize} ${latinLeading}`}>
            {cleanVerseField(verse.translation)}
          </p>
        </Layer>
      )}

      {/* 6 · Traditional commentary (Shown in Deep mode or collapsible in Simple) */}
      {!isQuick && (
        <Layer id="layer-tradition" kind="tradition" title="Traditional commentary" titleHi="परम्परागत भाष्य" collapsible={!isDeep}>
          <p className={`text-sm text-dharma-muted ${latinLeading}`}>
            Classical commentary (for example, by the traditional ācāryas) has not been added for this text yet. The explanation below is an
            editorial aid and should not be read as the view of any commentator.
          </p>
        </Layer>
      )}

      {/* 7 · Simple explanation */}
      {verse.explanation && (
        <Layer
          id="layer-explanation"
          kind="editorial"
          title={isQuick ? "Key Message" : "Simple explanation"}
          titleHi={isQuick ? "मुख्य संदेश" : "सरल व्याख्या"}
          badge={aiCommentary}
          collapsible={false}
        >
          <p
            lang={/[ऀ-ॿ]/.test(verse.explanation) ? 'hi' : 'en'}
            className={`whitespace-pre-line text-dharma-text ${tSize} ${/[ऀ-ॿ]/.test(verse.explanation) ? devLeading : latinLeading} ${/[ऀ-ॿ]/.test(verse.explanation) ? 'font-devanagari' : 'font-serif'}`}
          >
            {verse.explanation}
          </p>
        </Layer>
      )}

      {/* 8 · Modern reflection / Practical action */}
      {verse.reflection && (
        <Layer
          id="layer-reflection"
          kind="reflection"
          title={isQuick ? "Practical Action & Takeaway" : "Modern reflection"}
          titleHi={isQuick ? "दैनिक आचरण" : "आधुनिक चिंतन"}
          badge={aiCommentary}
          collapsible={false}
        >
          <p
            lang={/[ऀ-ॿ]/.test(verse.reflection) ? 'hi' : 'en'}
            className={`whitespace-pre-line text-dharma-text ${tSize} ${/[ऀ-ॿ]/.test(verse.reflection) ? devLeading : latinLeading} ${/[ऀ-ॿ]/.test(verse.reflection) ? 'font-devanagari' : 'font-serif'}`}
          >
            {verse.reflection}
          </p>
        </Layer>
      )}

      {/* 9 · Research note (Deep or Simple modes) */}
      {!isQuick && verse.research && (
        <Layer id="layer-research" kind="research" title="Research note" titleHi="शोध टिप्पणी" badge={aiCommentary} collapsible={!isDeep}>
          <p
            lang={/[ऀ-ॿ]/.test(verse.research) ? 'hi' : 'en'}
            className={`whitespace-pre-line text-dharma-text ${tSize} ${/[ऀ-ॿ]/.test(verse.research) ? devLeading : latinLeading} ${/[ऀ-ॿ]/.test(verse.research) ? 'font-devanagari' : 'font-serif'}`}
          >
            {verse.research}
          </p>
          <p className="mt-3 text-xs text-dharma-muted">
            A modern parallel offered for reflection. It is not part of the scripture, and it has not been checked against the original
            sources it may allude to.
          </p>
        </Layer>
      )}

      {isDeep && (
        <>
          <CompareViews scriptureId={scriptureId} chapterId={chapterId} verse={verse} provenance={p} />
          <CommentaryCompare scriptureId={scriptureId} chapterId={chapterId} verse={verse} />
        </>
      )}

      {/* 10 · Sources and edition details (Always accessible, collapsible) */}
      <Layer id="layer-sources" kind="sources" title="Sources and edition" titleHi="स्रोत एवं संस्करण" collapsible>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Sanskrit text</dt>
            <dd className="mt-0.5 text-dharma-text">
              {p.sourceHost ? (
                p.sourceUrl ? (
                  <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-[44px] items-center rounded font-medium underline underline-offset-4">
                    {p.sourceHost}
                  </a>
                ) : (
                  p.sourceHost
                )
              ) : (
                <span className="text-dharma-muted">Not recorded</span>
              )}
              {p.sourceFetched && <span className="text-dharma-muted"> · fetched {p.sourceFetched.slice(0, 10)}</span>}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Translations</dt>
            <dd className="mt-0.5 text-dharma-text">
              {[p.hindiIsAi ? 'Hindi: AI translation' : 'Hindi: not flagged as AI', p.englishIsAi ? 'English: AI translation' : 'English: not flagged as AI']
                .join(' · ')}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Explanation, reflection, research</dt>
            <dd className="mt-0.5 text-dharma-text">{p.commentaryIsAi ? 'AI-drafted and editor-reviewed' : 'Editorial text; no AI flag recorded'}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Last updated</dt>
            <dd className="mt-0.5 text-dharma-text">{p.lastUpdated ? p.lastUpdated.slice(0, 10) : <span className="text-dharma-muted">Not recorded</span>}</dd>
          </div>
          {p.sourceLicense && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Licence note (as recorded)</dt>
              <dd className="mt-0.5 text-dharma-muted">{p.sourceLicense}</dd>
            </div>
          )}
        </dl>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-dharma-muted">
          <p className="flex flex-wrap items-center gap-x-2">
            Found a mistake?{' '}
            <button type="button" onClick={onReport} className="focus-ring inline-flex min-h-[44px] items-center rounded font-semibold text-saffron-800 underline underline-offset-4 dark:text-saffron-300">
              Report a textual error
            </button>
          </p>
          <a
            href="#sources-interpretation-heading"
            className="focus-ring inline-flex min-h-[44px] items-center gap-1 font-semibold text-saffron-700 hover:text-saffron-800 dark:text-saffron-300 underline underline-offset-4"
          >
            <span>विस्तृत स्रोत एवं भाष्य वर्गीकरण</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </Layer>
    </article>
  );
}
