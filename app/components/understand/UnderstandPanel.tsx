'use client';

import { useRef, type KeyboardEvent } from 'react';
import type { PedagogicalVerseData } from '@/data/pedagogical-gita-2-47';
import type { UnderstandingExtras } from '@/data/understanding';
import { useReaderSettings } from '@/lib/useReaderSettings';
import {
  BeforeAfter,
  ContextTimeline,
  ExampleTabs,
  ExplainCard,
  Misunderstanding,
  TeachingFlow,
  Verse30,
} from './primitives';
import { PauseAndThink } from './PauseAndThink';
import { ExplanationFeedback } from './ExplanationFeedback';
import { WordExplorer } from './WordExplorer';
import { ShareCardButton } from './ShareCard';

/**
 * "How would you like to understand this verse?" (spec §1–2).
 * Quick / Simple / Deep change only what sits below the verse; the verse
 * itself stays on screen above. The choice is remembered on this device (Reader settings → Reading mode).
 */

type Mode = 'quick' | 'simple' | 'deep';

const MODES: Array<{ id: Mode; en: string; hi: string; hint: string }> = [
  { id: 'quick', en: 'Quick', hi: 'संक्षेप', hint: 'Main idea in under a minute' },
  { id: 'simple', en: 'Simple', hi: 'सरल', hint: 'A clear, meaningful explanation' },
  { id: 'deep', en: 'Deep', hi: 'गहन', hint: 'Words, commentary and sources' },
];

function Bilingual({ en, hi }: { en?: string; hi?: string }) {
  return (
    <>
      {en && <p>{en}</p>}
      {hi && <p lang="hi" className="font-devanagari text-dharma-muted">{hi}</p>}
    </>
  );
}

export function UnderstandPanel({
  data,
  extras,
  refKey,
  reference,
  translation,
  translationIsAi,
  previousHref,
  nextHref,
  pageUrl,
}: {
  data: PedagogicalVerseData;
  extras?: UnderstandingExtras;
  refKey: string;
  reference: string;
  translation?: string;
  translationIsAi?: boolean;
  previousHref?: string;
  nextHref?: string;
  pageUrl: string;
}) {
  const { settings, update, reducedMotion } = useReaderSettings();
  const mode: Mode = settings.readerMode;
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  // One store for the reading depth: the Reader settings panel and this selector share it.
  const choose = (m: Mode) => update('readerMode', m);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % MODES.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + MODES.length) % MODES.length;
    else return;
    e.preventDefault();
    choose(MODES[n].id);
    tabs.current[n]?.focus();
  };

  const c = data.traditionalCommentary;
  const s = data.sourceTransparency;
  const commentators = [c.shankara, c.ramanuja, c.sridhara];

  return (
    <section aria-labelledby="understand-h" data-calm={reducedMotion ? '' : undefined} className="mt-8">
      <style>{`
        .understand-fade{animation:understand-in .35s ease-out backwards}
        @keyframes understand-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){.understand-fade{animation:none}}
        [data-calm] .understand-fade{animation:none}
      `}</style>

      <h2 id="understand-h" className="font-serif text-xl font-bold text-dharma-text">
        How would you like to understand this verse?
      </h2>
      <p lang="hi" className="font-devanagari text-sm text-dharma-muted">आप इस श्लोक को किस गहराई से समझना चाहेंगे?</p>

      <div role="tablist" aria-label="Depth of explanation" className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {MODES.map((m, i) => {
          const sel = mode === m.id;
          return (
            <button
              key={m.id}
              ref={(el) => { tabs.current[i] = el; }}
              role="tab"
              id={`mode-${m.id}`}
              aria-selected={sel}
              aria-controls="mode-panel"
              tabIndex={sel ? 0 : -1}
              onClick={() => choose(m.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`focus-ring min-h-[52px] shrink-0 rounded-2xl border px-5 text-left transition ${sel ? 'border-saffron-700 bg-saffron-100 text-saffron-950 shadow-sm dark:bg-saffron-900/40 dark:text-saffron-100' : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'}`}
            >
              <span className="block text-sm font-bold">
                {m.en} <span lang="hi" className="font-devanagari font-semibold opacity-80">{m.hi}</span>
              </span>
              <span className="block text-xs opacity-75">{m.hint}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <ShareCardButton sanskrit={data.sanskrit} reference={reference} referenceSanskrit={data.scriptureTitleSanskrit} meaning={data.inOneLineEn} translation={translation} translationIsAi={translationIsAi} url={pageUrl} />
      </div>

      <div role="tabpanel" id="mode-panel" aria-labelledby={`mode-${mode}`} className="mt-4 space-y-4" key={mode}>
        {mode === 'quick' && (
          <>
            {extras && <Verse30 data={extras.thirtySeconds} />}
            <ExplainCard kind="oneLine" title="In one line" titleHi="एक पंक्ति में" label="simple">
              <p className="text-lg font-medium">{data.inOneLineEn}</p>
              <p lang="hi" className="font-devanagari text-dharma-muted">{data.inOneLineHi}</p>
            </ExplainCard>
            {extras && (
              <>
                <ExplainCard kind="example" title="A relatable situation" titleHi="एक परिचित स्थिति" label="modern">
                  <Bilingual en={extras.quick.situation} hi={extras.quick.situationHi} />
                </ExplainCard>
                <ExplainCard kind="try" title="Try this today" titleHi="आज आज़माएँ" label="practical">
                  <Bilingual en={extras.quick.action} hi={extras.quick.actionHi} />
                </ExplainCard>
              </>
            )}
            <PauseAndThink
              refKey={refKey}
              reference={reference}
              question={extras?.quick.question ?? data.reflectionQuestion.en}
              questionHi={extras?.quick.questionHi ?? data.reflectionQuestion.hi}
            />
          </>
        )}

        {mode === 'simple' && (
          <>
            {extras?.contextTimeline && (
              <ContextTimeline
                steps={extras.contextTimeline.steps}
                previousHref={previousHref}
                passageHref={extras.contextTimeline.passageHref}
                nextHref={nextHref}
              />
            )}
            <ExplainCard kind="oneLine" title="In one line" titleHi="एक पंक्ति में" label="simple">
              <p className="text-lg font-medium">{data.inOneLineEn}</p>
              <p lang="hi" className="font-devanagari text-dharma-muted">{data.inOneLineHi}</p>
            </ExplainCard>
            <ExplainCard kind="simple" title="Simple meaning" titleHi="सरल अर्थ" label="simple">
              <p>{data.simpleMeaningEn}</p>
              <p lang="hi" className="font-devanagari text-dharma-muted">{data.simpleMeaningHi}</p>
            </ExplainCard>
            {data.keyWords.length > 0 && <WordExplorer words={data.keyWords} />}
            {extras?.teachingFlow && <TeachingFlow steps={extras.teachingFlow} />}
            {data.whyItMattersToday.length > 0 && (
              <ExplainCard kind="why" title="Why it matters today" titleHi="आज इसका महत्त्व" label="modern">
                <ul className="space-y-3">
                  {data.whyItMattersToday.slice(0, 3).map((w) => (
                    <li key={w.title}>
                      <p className="font-semibold">{w.title}</p>
                      <p className="text-dharma-muted">{w.text}</p>
                    </li>
                  ))}
                </ul>
              </ExplainCard>
            )}
            {extras?.examples && extras.examples.length > 0 ? (
              <ExampleTabs examples={extras.examples} />
            ) : (
              <ExplainCard kind="example" title="Modern example" titleHi="आधुनिक उदाहरण" label="modern">
                <p className="font-semibold">{data.modernExample.context}</p>
                <p>{data.modernExample.scenarioEn}</p>
              </ExplainCard>
            )}
            {extras?.beforeAfter && <BeforeAfter {...extras.beforeAfter} />}
            {extras?.misunderstanding && <Misunderstanding {...extras.misunderstanding} />}
            <ExplainCard kind="notMean" title="What it does not mean" titleHi="यह क्या नहीं कहता" label="editorial">
              <ul className="space-y-2">
                {data.whatItDoesNotMean.map((n) => (
                  <li key={n.title}>
                    <p className="font-semibold">{n.title.replace(/^It does NOT mean:\s*/i, 'Not: ')}</p>
                    <p className="text-dharma-muted">{n.text}</p>
                  </li>
                ))}
              </ul>
            </ExplainCard>
            <ExplainCard kind="try" title="Try this today" titleHi="आज आज़माएँ" label="practical">
              <p className="font-semibold">{data.tryThisToday.title} <span className="font-normal text-dharma-muted">· {data.tryThisToday.duration}</span></p>
              <Bilingual en={data.tryThisToday.instructionEn} hi={data.tryThisToday.instructionHi} />
            </ExplainCard>
            <PauseAndThink refKey={refKey} reference={reference} question={data.reflectionQuestion.en} questionHi={data.reflectionQuestion.hi} />
          </>
        )}

        {mode === 'deep' && (
          <>
            <ExplanationFeedback refKey={refKey} reference={reference} />
            {extras?.contextTimeline && (
              <ContextTimeline
                steps={extras.contextTimeline.steps}
                previousHref={previousHref}
                passageHref={extras.contextTimeline.passageHref}
                nextHref={nextHref}
              />
            )}
            <ExplainCard kind="simple" title="Word by word" titleHi="शब्दार्थ" label="simple">
              <ul className="divide-y divide-dharma-border">
                {data.keyWords.map((w) => (
                  <li key={w.iast} className="py-2.5">
                    <p>
                      <span lang="sa" className="font-devanagari text-lg">{w.pada.split(' (')[0]}</span>{' '}
                      <span className="text-sm italic text-dharma-muted">{w.iast}</span>
                    </p>
                    <p lang="hi" className="font-devanagari text-sm text-dharma-muted">{w.root}</p>
                    <p>{w.functionalMeaning}</p>
                    <p lang="hi" className="font-devanagari text-dharma-muted">{w.functionalMeaningHi}</p>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-dharma-muted">
                Sandhi separation and a full grammar table are not yet prepared for this verse. The verse above is the verified text.
              </p>
            </ExplainCard>
            {commentators.map((x) => (
              <ExplainCard key={x.author} kind="commentary" title={x.author} label="traditional">
                <p className="text-sm text-dharma-muted">{x.tradition} · <span className="italic">{x.work}</span></p>
                <Bilingual en={x.summaryEn} hi={x.summaryHi} />
              </ExplainCard>
            ))}
            <ExplainCard kind="commentary" title="Sources and edition" titleHi="स्रोत" label="traditional">
              <dl className="grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[9rem_1fr]">
                {([
                  ['Scripture', s.scripture],
                  ['Reference', s.reference],
                  ['Context', s.epicContext],
                  ['Meter', s.meter],
                  ['Sanskrit edition', s.sanskritEdition],
                  ['Authority', s.epistemicTier],
                ] as const).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-semibold text-dharma-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-sm italic text-dharma-muted">{s.editorialNote}</p>
            </ExplainCard>
          </>
        )}
      </div>
    </section>
  );
}
