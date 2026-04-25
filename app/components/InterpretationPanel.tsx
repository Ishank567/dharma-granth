'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { Interpretation } from '../lib/types';
import type {
  InterpretationApiResponse,
  InterpretationFallbackReason,
} from '@/app/lib/interpretationUtils';
import Link from 'next/link';
import MindMap from '@/app/components/MindMap';

interface VerseRecallData {
  verseNumber: number;
  originalText: string;
  translationHindi?: string;
}

interface Props {
  verseId: number;
  initialInterpretation?: Interpretation | null;
  nextVerseHref?: string | null;
  categorySlug?: string;
  bookSlug?: string;
  verseRecall?: VerseRecallData;
}

type RequestState = 'idle' | 'generating' | 'upgrading';
type DebugMode = 'force-offline' | 'force-ai-upgrade';

type ResponseMeta = Pick<InterpretationApiResponse, 'status' | 'fallbackReason'>;

const isDevelopment = false; // Hide by default even in dev for cleaner UI

const fallbackReasonCopy: Record<InterpretationFallbackReason, string> = {
  missing_api_key: 'एआई सेवा अभी कॉन्फ़िगर नहीं है, इसलिए स्थानीय अध्ययन व्याख्या दिखाई जा रही है।',
  rate_limited: 'एआई सेवा इस समय व्यस्त है, इसलिए अस्थायी रूप से स्थानीय अध्ययन व्याख्या दिखाई जा रही है।',
  ai_error: 'एआई व्याख्या इस बार तैयार नहीं हो सकी, इसलिए स्थानीय अध्ययन व्याख्या सुरक्षित रूप से दिखाई जा रही है।',
  invalid_ai_output: 'एआई उत्तर भरोसेमंद प्रारूप में नहीं था, इसलिए स्थानीय अध्ययन व्याख्या रखी गई है।',
};

function getInitialResponseMeta(
  interpretation: Interpretation | null | undefined
): ResponseMeta | null {
  if (!interpretation) {
    return null;
  }

  if (interpretation.source === 'offline') {
    return { status: 'fallback' };
  }

  return { status: 'cached' };
}

/** Render shabdarth text with **bold** markers as styled spans */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={i} className="inline-block rounded-md bg-accent/10 px-1.5 py-0.5 font-bold text-accent border border-accent/20">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/** Section card with icon, gradient border, and visual hierarchy */
function SectionCard({
  icon,
  title,
  color,
  children,
  stepNumber,
}: {
  icon: string;
  title: string;
  color: 'amber' | 'emerald' | 'sky' | 'violet' | 'rose' | 'orange' | 'teal';
  children: React.ReactNode;
  stepNumber?: number;
}) {
  const colorClasses = {
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-300/40 dark:border-amber-600/30',
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-300/40 dark:border-emerald-600/30',
    sky: 'from-sky-500/10 to-sky-500/5 border-sky-300/40 dark:border-sky-600/30',
    violet: 'from-violet-500/10 to-violet-500/5 border-violet-300/40 dark:border-violet-600/30',
    rose: 'from-rose-500/10 to-rose-500/5 border-rose-300/40 dark:border-rose-600/30',
    orange: 'from-orange-500/10 to-orange-500/5 border-orange-300/40 dark:border-orange-600/30',
    teal: 'from-teal-500/10 to-teal-500/5 border-teal-300/40 dark:border-teal-600/30',
  };

  const iconBgClasses = {
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    sky: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
    violet: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  };

  return (
    <section className={`relative rounded-2xl border bg-gradient-to-br ${colorClasses[color]} p-5 transition-all hover:shadow-md`}>
      {stepNumber && (
        <div className="absolute -top-3 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-md">
          {stepNumber}
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${iconBgClasses[color]}`}>
          {icon}
        </div>
        <h3 className="font-serif-deva text-lg font-bold text-foreground">{title}</h3>
      </div>
      <div className="text-foreground/85 leading-relaxed">{children}</div>
    </section>
  );
}

export default function InterpretationPanel({ verseId, initialInterpretation, nextVerseHref, bookSlug, verseRecall }: Props) {
  const [interpretation, setInterpretation] = useState<Interpretation | null>(
    initialInterpretation || null
  );
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [responseMeta, setResponseMeta] = useState<ResponseMeta | null>(
    getInitialResponseMeta(initialInterpretation)
  );
  const [error, setError] = useState('');
  const [showRecall, setShowRecall] = useState(false);
  const autoUpgradeAttemptedRef = useRef(false);

  const hasVerseRecall = !!verseRecall;
  useEffect(() => {
    if (!hasVerseRecall) return;
    const target = document.getElementById('main-verse-display');
    if (!target || typeof IntersectionObserver === 'undefined') {
      setShowRecall(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowRecall(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasVerseRecall, verseId]);

  useEffect(() => {
    setInterpretation(initialInterpretation || null);
    setResponseMeta(getInitialResponseMeta(initialInterpretation));
    setRequestState('idle');
    setError('');
    autoUpgradeAttemptedRef.current = false;
  }, [initialInterpretation, verseId]);

  const requestInterpretation = async (
    mode: RequestState,
    options?: { debugMode?: DebugMode }
  ) => {
    setRequestState(mode);
    setError('');

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId, bookSlug, debugMode: options?.debugMode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'व्याख्या प्राप्त करने में त्रुटि');
      }

      const response = data as InterpretationApiResponse;
      setInterpretation(response.interpretation);
      setResponseMeta({
        status: response.status,
        fallbackReason: response.fallbackReason,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'कुछ गलत हो गया');
    } finally {
      setRequestState('idle');
    }
  };

  const diagnosticsPanel = isDevelopment ? (
    <details className="group rounded-2xl border border-dashed border-border bg-background/60">
      <summary className="cursor-pointer select-none list-none px-4 py-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-light hover:text-foreground transition-colors">
        <span className="inline-block size-2 rounded-full bg-amber-400 group-open:bg-emerald-400 transition-colors" />
        Dev Diagnostics
        <span className="ml-auto text-[10px] font-normal normal-case opacity-60">
          {interpretation ? `${interpretation.source} / ${responseMeta?.status ?? 'idle'}` : 'no data'}
        </span>
      </summary>

      <div className="px-4 pb-4 space-y-4">
        <fieldset className="rounded-xl border border-border p-3 space-y-2">
          <legend className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-light">
            Current State
          </legend>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-light">Verse</p>
              <p className="text-sm font-mono font-medium text-foreground">{verseId}</p>
            </div>
            <div className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-light">Source</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <span className={`inline-block size-1.5 rounded-full ${interpretation?.source === 'ai' ? 'bg-emerald-500'
                    : interpretation?.source === 'manual' ? 'bg-sky-500'
                      : interpretation?.source === 'offline' ? 'bg-amber-500'
                        : 'bg-zinc-300'
                  }`} />
                {interpretation?.source ?? 'none'}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-light">Status</p>
              <p className="text-sm font-medium text-foreground">{responseMeta?.status ?? 'idle'}</p>
            </div>
            <div className="rounded-lg border border-border bg-card px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-light">Fallback</p>
              <p className="text-sm font-medium text-foreground">{responseMeta?.fallbackReason ?? 'none'}</p>
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-xl border border-border p-3 space-y-2">
          <legend className="px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-light">
            Simulate
          </legend>
          <div className="flex flex-wrap gap-2">
            <button
              disabled={requestState !== 'idle'}
              onClick={() => {
                autoUpgradeAttemptedRef.current = false;
                void requestInterpretation('generating', { debugMode: 'force-offline' });
              }}
              className="inline-flex items-center justify-center rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↓ Offline fallback seed
            </button>
            <button
              disabled={requestState !== 'idle' || interpretation?.source !== 'offline'}
              onClick={() => {
                void requestInterpretation('upgrading', { debugMode: 'force-ai-upgrade' });
              }}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↑ Simulate AI upgrade
            </button>
          </div>
        </fieldset>
      </div>
    </details>
  ) : null;

  const autoUpgradeOfflineInterpretation = useEffectEvent(() => {
    if (autoUpgradeAttemptedRef.current) {
      return;
    }

    autoUpgradeAttemptedRef.current = true;
    void requestInterpretation('upgrading');
  });

  useEffect(() => {
    if (interpretation?.source !== 'offline' || requestState !== 'idle') {
      return;
    }

    autoUpgradeOfflineInterpretation();
  }, [interpretation?.source, requestState, verseId]);

  const loading = requestState !== 'idle';

  const sourceToneClass = interpretation?.source === 'ai'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
    : interpretation?.source === 'manual'
      ? 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200'
      : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200';

  const statusBadge = interpretation?.source === 'ai'
    ? responseMeta?.status === 'upgraded'
      ? 'अभी एआई से उन्नत'
      : responseMeta?.status === 'generated'
        ? 'नई एआई व्याख्या'
        : 'एआई व्याख्या'
    : interpretation?.source === 'manual'
      ? 'पाठ्यक्रम-आधारित व्याख्या'
      : requestState === 'upgrading'
        ? 'एआई में उन्नत की जा रही है'
        : 'ऑफलाइन अध्ययन व्याख्या';

  const statusDescription = !interpretation
    ? ''
    : interpretation.source === 'ai'
      ? responseMeta?.status === 'upgraded'
        ? 'पहले दिखाई जा रही स्थानीय व्याख्या अब समृद्ध एआई व्याख्या से बदल दी गई है।'
        : responseMeta?.status === 'generated'
          ? 'यह व्याख्या अभी तैयार की गई है।'
          : 'यह व्याख्या एआई एवं मानव की सहायता से तैयार की गई है।'
      : interpretation.source === 'manual'
        ? 'यह व्याख्या पाठ्यक्रम-संदर्भ से तैयार की गई है।'
        : requestState === 'upgrading'
          ? 'एआई से बेहतर व्याख्या लाई जा रही है...'
          : responseMeta?.fallbackReason
            ? fallbackReasonCopy[responseMeta.fallbackReason]
            : 'स्थानीय अध्ययन व्याख्या। एआई उपलब्ध होने पर उन्नत होगी।';

  if (!interpretation && !loading) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-accent/30 bg-gradient-to-br from-accent-bg/50 to-card p-8 text-center">
        <div className="text-5xl mb-4">📖</div>
        <p className="text-lg font-serif-deva font-bold text-foreground mb-2">
          इस श्लोक की गहन व्याख्या अभी तैयार नहीं हुई है
        </p>
        <p className="text-sm text-muted mb-6 max-w-md mx-auto">
          हर संस्कृत शब्द का अर्थ, उदाहरणों सहित भावार्थ, और जीवन में उपयोग — सब एक क्लिक में!
        </p>
        <button
          onClick={() => {
            void requestInterpretation('generating');
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-accent/90 hover:shadow-xl transition-all active:scale-95"
        >
          ✨ गहन व्याख्या तैयार करें
        </button>
        {diagnosticsPanel && <div className="mt-6 text-left">{diagnosticsPanel}</div>}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (!interpretation && loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
        <div className="flex items-center gap-3 text-accent">
          <div className="h-5 w-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="text-sm font-semibold">
            {requestState === 'upgrading' ? 'एआई से उन्नत व्याख्या लाई जा रही है...' : 'गहन व्याख्या तैयार हो रही है...'}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {['शब्दार्थ', 'भावार्थ', 'उदाहरण', 'मार्गदर्शन'].map((label) => (
            <div key={label} className="rounded-xl border border-border p-4 space-y-2">
              <div className="h-3 w-20 shimmer rounded" />
              <div className="h-3 shimmer rounded" />
              <div className="h-3 shimmer rounded w-4/5" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentInterpretation = interpretation as Interpretation;

  const guidedLearningText = currentInterpretation.guided_learning?.trim() || [
    '1. पहले मूल पाठ को एकाग्र होकर दो या तीन बार पढ़ें।',
    '2. फिर शब्दार्थ और भावार्थ को मिलाकर मुख्य बिन्दु पहचानें।',
    '3. अपने जीवन से जुड़ा एक प्रश्न उठाएँ।',
    '4. अंत में एक छोटा व्यवहारिक अभ्यास चुनें।',
  ].join('\n');

  const scientificTemperamentText = currentInterpretation.scientific_temperament?.trim() ||
    'इस श्लोक को तर्क, आत्मनिरीक्षण, व्यवहार और अनुभव की कसौटी पर पढ़ें।';

  const simpleExampleText = currentInterpretation.simple_example?.trim() || '';
  const nextCuriosityText = currentInterpretation.next_curiosity?.trim() || '';

  // Parse guided learning into steps
  const guidedSteps = guidedLearningText
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);

  const hasMindMap = !!currentInterpretation.concept_map;
  const hasExample = !!simpleExampleText;
  const hasNextCta = !!(nextCuriosityText || nextVerseHref);

  const roadmap: { key: string; label: string }[] = [
    { key: 'shabdarth', label: 'शब्दार्थ' },
    { key: 'bhavarth', label: 'भावार्थ' },
  ];
  if (hasMindMap) roadmap.push({ key: 'mindmap', label: 'मानचित्र' });
  if (hasExample) roadmap.push({ key: 'example', label: 'उदाहरण' });
  roadmap.push(
    { key: 'guided', label: 'अध्ययन क्रम' },
    { key: 'scientific', label: 'वैज्ञानिक दृष्टि' },
    { key: 'practice', label: 'जीवन-साधना' }
  );
  if (hasNextCta) roadmap.push({ key: 'next', label: 'आगे' });

  const stepNumbers = Object.fromEntries(
    roadmap.map((step, idx) => [step.key, idx + 1])
  ) as Record<string, number>;
  const stepMindMap = stepNumbers.mindmap ?? null;
  const stepExample = stepNumbers.example ?? null;
  const stepGuided = stepNumbers.guided;
  const stepScientific = stepNumbers.scientific;
  const stepPractice = stepNumbers.practice;
  const stepNext = stepNumbers.next ?? null;

  const verseRecallCard = verseRecall && showRecall ? (
    <div className="sticky top-2 z-20 -mb-2 rounded-xl border border-accent/30 bg-white/92 dark:bg-card/95 backdrop-blur px-4 py-2.5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start gap-3">
        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent uppercase tracking-wide">
          श्लोक {verseRecall.verseNumber}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-scripture text-sm leading-snug text-foreground line-clamp-2 whitespace-pre-wrap">
            {verseRecall.originalText}
          </p>
          {verseRecall.translationHindi && (
            <p className="text-[11px] text-muted mt-0.5 line-clamp-1 hidden sm:block">
              {verseRecall.translationHindi}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowRecall(false)}
          aria-label="छिपाएँ"
          className="shrink-0 -mr-1 -mt-1 flex h-6 w-6 items-center justify-center rounded-full text-muted hover:bg-accent/10 hover:text-accent transition-colors"
        >
          <span className="text-sm leading-none">×</span>
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      {verseRecallCard}
      {/* Source badge */}
      <div className={`rounded-xl border p-3 ${sourceToneClass}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <div className="flex items-center gap-2">
            <span className={`inline-block size-2 rounded-full ${currentInterpretation.source === 'ai' ? 'bg-emerald-500' : currentInterpretation.source === 'manual' ? 'bg-sky-500' : 'bg-amber-500'
              }`} />
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
              {statusBadge}
            </p>
          </div>
          <p className="text-xs opacity-70 flex-1 min-w-[12rem]">{statusDescription}</p>
          {currentInterpretation.source === 'offline' && requestState === 'idle' && (
            <button
              onClick={() => { void requestInterpretation('upgrading'); }}
              className="ml-auto inline-flex items-center justify-center rounded-lg border border-current/20 bg-white/60 dark:bg-white/10 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white dark:hover:bg-white/20"
            >
              एआई उन्नयन
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
      </div>

      {diagnosticsPanel}

      {/* ── Study Flow Roadmap ── */}
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-r from-accent-bg/60 to-card p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🗺️</span>
          <h3 className="font-serif-deva text-base font-bold text-primary">अध्ययन मार्ग</h3>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs text-muted">
          {roadmap.map((step, i) => (
            <span key={step.key} className="flex items-center gap-1">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">{i + 1}</span>
              <span>{step.label}</span>
              {i < roadmap.length - 1 && <span className="text-accent/40 mx-0.5">→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── 1. शब्दार्थ (Word-by-Word) ── */}
      <SectionCard icon="📝" title="शब्दार्थ — पद-विभाग" color="amber" stepNumber={1}>
        <div className="whitespace-pre-wrap text-base leading-[2]">
          <RichText text={currentInterpretation.shabdarth} />
        </div>
      </SectionCard>

      {/* ── 2. भावार्थ ── */}
      <SectionCard icon="🪷" title="गहन भावार्थ" color="emerald" stepNumber={2}>
        <p className="whitespace-pre-wrap text-base leading-relaxed">{currentInterpretation.bhavarth}</p>
      </SectionCard>


      {/* ── Concept map / mind-map infographic ── */}
      {currentInterpretation.concept_map ? (
        <div className="relative">
          {stepMindMap !== null && (
            <div className="absolute -top-3 right-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-md ring-2 ring-card">
              {stepMindMap}
            </div>
          )}
          <MindMap raw={currentInterpretation.concept_map} />
        </div>
      ) : currentInterpretation.source === 'ai' ? (
        <div className="rounded-2xl border border-dashed border-indigo-300/60 dark:border-indigo-700/40 bg-indigo-50/30 dark:bg-indigo-950/10 p-4 flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {requestState === 'upgrading' ? 'मानचित्र तैयार हो रहा है...' : 'अवधारणा मानचित्र उपलब्ध नहीं'}
            </p>
            <p className="text-xs text-muted">
              {requestState === 'upgrading'
                ? 'कुछ ही क्षण प्रतीक्षा करें — एआई नया मानचित्र बना रहा है।'
                : 'यह व्याख्या पुराने प्रारूप में है। एक नए मानचित्र के लिए पुनर्निर्माण करें।'}
            </p>
          </div>
          {requestState === 'upgrading' ? (
            <div className="shrink-0 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <span className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <button
              disabled={requestState !== 'idle'}
              onClick={() => { void requestInterpretation('upgrading', { debugMode: 'force-ai-upgrade' }); }}
              className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              मानचित्र बनाएँ
            </button>
          )}
        </div>
      ) : null}

      {/* ── सरल दृश्य (उदाहरण) ── */}
      {simpleExampleText && stepExample !== null && (
        <SectionCard icon="💡" title="समझें एक सरल उदाहरण से" color="sky" stepNumber={stepExample}>
          <div className="rounded-xl bg-white/50 dark:bg-white/5 border border-sky-200/50 dark:border-sky-700/30 p-4">
            <p className="whitespace-pre-wrap text-base leading-relaxed italic">{simpleExampleText}</p>
          </div>
        </SectionCard>
      )}

      {/* ── मार्गदर्शित अध्ययन (Step-by-Step) ── */}
      <SectionCard icon="🧭" title="मार्गदर्शित अध्ययन" color="violet" stepNumber={stepGuided}>
        <div className="space-y-2">
          {guidedSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-white/40 dark:bg-white/5 p-3 border border-violet-200/30 dark:border-violet-700/20">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-700 dark:text-violet-300 mt-0.5">
                {i + 1}
              </span>
              <p className="text-base leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── वैज्ञानिक दृष्टि ── */}
      <SectionCard icon="🔬" title="वैज्ञानिक दृष्टि और तर्कशीलता" color="teal" stepNumber={stepScientific}>
        <p className="whitespace-pre-wrap text-base leading-relaxed">{scientificTemperamentText}</p>
      </SectionCard>

      {/* ── जीवन-साधना ── */}
      <SectionCard icon="🌱" title="जीवन-साधना — आज का अभ्यास" color="orange" stepNumber={stepPractice}>
        <div className="rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-700/30 p-4">
          <p className="whitespace-pre-wrap text-base leading-relaxed">{currentInterpretation.modern_relevance}</p>
        </div>
      </SectionCard>

      {/* ── Next Curiosity / Motivation to continue ── */}
      {hasNextCta && (
        <div className="relative rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 via-card to-accent-bg/30 p-6 text-center">
          {stepNext !== null && (
            <div className="absolute -top-3 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white shadow-md ring-2 ring-card">
              {stepNext}
            </div>
          )}
          <div className="text-3xl mb-3">🚀</div>
          {nextCuriosityText && (
            <p className="text-base text-foreground/90 leading-relaxed mb-4 max-w-lg mx-auto font-serif-deva">
              {nextCuriosityText}
            </p>
          )}
          {nextVerseHref && (
            <Link
              href={nextVerseHref}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-accent/90 hover:shadow-xl transition-all active:scale-95 group"
            >
              अगला श्लोक पढ़ें
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-muted-light text-center pt-2 border-t border-border">
        {currentInterpretation.source === 'ai'
          ? 'यह व्याख्या एआई की सहायता से तैयार की गई है। गंभीर अध्ययन के लिए मूल ग्रंथ और भाष्य भी साथ रखें।'
          : currentInterpretation.source === 'offline'
            ? 'यह व्याख्या ऑफलाइन अध्ययन मोड में तैयार की गई है।'
            : 'यह व्याख्या पाठ्यक्रम-संदर्भ से तैयार की गई है।'}
      </p>
    </div>
  );
}
