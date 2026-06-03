'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { CheckCircle2, Languages, PenLine, Sparkles, Share2 } from 'lucide-react';

type Language = 'hi' | 'en';

interface ChapterPreparationClientProps {
  scriptureTitle: string;
  chapterTitle: string;
  chapterTitleSanskrit?: string;
  summary?: string;
}

const copy = {
  hi: {
    label: 'मार्गदर्शित तैयारी',
    status: 'श्लोक-दर-श्लोक अध्ययन तैयारी में है',
    message:
      'इस अध्याय के श्लोक अभी जोड़े जा रहे हैं। तब तक आप अध्याय के भाव, संदर्भ और मुख्य सीख पर मनन कर सकते हैं।',
    summary: 'अध्याय का भाव',
    reflection: 'मनन',
    prompt: 'इस अध्याय के शीर्षक और सार से कौन सी एक बात समझ में आती है?',
    placeholder: 'अपना छोटा मनन लिखें...',
    complete: 'मनन पूर्ण करें',
    completed: 'पूर्ण',
    focusTitle: 'केंद्रित करें',
    focusOptions: ['जीवन दर्शन', 'कर्तव्य भाव', 'आध्यात्मिक संदेश'],
    stepOne: 'सार पढ़ें',
    stepTwo: 'मुख्य सीख चुनें',
    stepThree: 'मनन लिखें',
    savedNotice: 'आपका मनन स्वचालित रूप से सहेजा जाता है।',
  },
  en: {
    label: 'Guided Preparation',
    status: 'Verse-by-verse study is being prepared',
    message:
      'The verses for this chapter are still being added. You can still reflect on the chapter context, theme, and central lesson.',
    summary: 'Chapter Theme',
    reflection: 'Reflection',
    prompt: 'What is one lesson you can infer from this chapter title and summary?',
    placeholder: 'Write a short reflection...',
    complete: 'Complete Reflection',
    completed: 'Completed',
    focusTitle: 'Focus on',
    focusOptions: ['Life values', 'Duty and purpose', 'Spiritual insight'],
    stepOne: 'Read the summary',
    stepTwo: 'Pick a theme',
    stepThree: 'Write your thought',
    savedNotice: 'Your reflection is saved automatically.',
  },
};

export function ChapterPreparationClient({
  scriptureTitle,
  chapterTitle,
  chapterTitleSanskrit,
  summary,
}: ChapterPreparationClientProps) {
  const [language, setLanguage] = useState<Language>('hi');
  const [reflection, setReflection] = useState('');
  const [completed, setCompleted] = useState(false);
  const [activeFocus, setActiveFocus] = useState(copy['hi'].focusOptions[0]);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copy' | 'shared' | 'error'>('idle');
  const flashcardRef = useRef<HTMLDivElement>(null);
  const labels = copy[language];

  async function shareFlashCard() {
    if (!flashcardRef.current) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(flashcardRef.current, { cacheBust: true, quality: 0.95, pixelRatio: 2 });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `chapter-summary.png`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${scriptureTitle} — ${chapterTitle} (Flash Card)`,
          files: [file],
        });
        setShareStatus('shared');
      } else {
        const link = document.createElement('a');
        link.download = `chapter-summary.png`;
        link.href = dataUrl;
        link.click();
        setShareStatus('copy');
      }
    } catch {
      setShareStatus('error');
    }
  }

  const storageKey = useMemo(() => {
    const normalized = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-');
    return `dharma.chapterPreparation.${normalized(scriptureTitle)}.${normalized(chapterTitle)}`;
  }, [scriptureTitle, chapterTitle]);

  const reflectionGoal = 160;
  const reflectionProgress = Math.min((reflection.trim().length / reflectionGoal) * 100, 100);
  const reflectionIsEmpty = reflection.trim().length === 0;
  const completeButtonDisabled = reflectionIsEmpty && !completed;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { reflection?: string; completed?: boolean; activeFocus?: string };
        if (typeof parsed.reflection === 'string') setReflection(parsed.reflection);
        if (typeof parsed.completed === 'boolean') setCompleted(parsed.completed);
        if (typeof parsed.activeFocus === 'string') setActiveFocus(parsed.activeFocus);
      }
    } catch {
      // ignore localStorage failures
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ reflection, completed, activeFocus }));
    } catch {
      // ignore localStorage write failures
    }
  }, [storageKey, reflection, completed, activeFocus]);

  return (
    <section className="rounded-lg border border-dharma-border bg-dharma-card shadow-sm">
      <div className="border-b border-dharma-border p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700">{labels.label}</p>
            <h2 className="mt-1 text-2xl font-serif font-bold text-dharma-text">{chapterTitle}</h2>
            {chapterTitleSanskrit && <p className="font-devanagari text-sm text-dharma-muted">{chapterTitleSanskrit}</p>}
            <p className="mt-1 text-sm text-dharma-muted">{scriptureTitle}</p>
          </div>
          <div className="inline-flex items-center gap-1 rounded-lg border border-dharma-border bg-dharma-bg p-1">
            <Languages className="ml-2 h-4 w-4 text-dharma-muted" />
            {(['hi', 'en'] as const).map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setLanguage(option)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                  language === option ? 'bg-dharma-bg text-saffron-800 shadow-sm' : 'text-dharma-muted hover:text-dharma-text'
                }`}
              >
                {option === 'hi' ? 'हिन्दी' : 'English'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-3xl border border-dharma-border bg-saffron-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-dharma-bg text-saffron-700 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700">{labels.label}</p>
                <h3 className="mt-2 text-xl font-semibold text-dharma-text">{labels.status}</h3>
              </div>
            </div>
            <p className={`leading-relaxed text-dharma-text ${language === 'hi' ? 'font-devanagari text-base' : 'text-sm'}`}>
              {labels.message}
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {[labels.stepOne, labels.stepTwo, labels.stepThree].map((text, index) => (
                <div key={text} className="rounded-2xl bg-dharma-bg p-3 text-sm font-medium text-dharma-text shadow-sm">
                  <span className="text-saffron-700">{index + 1}</span>. {text}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-dharma-border bg-dharma-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-dharma-muted">{labels.focusTitle}</p>
                <h3 className="mt-2 text-lg font-semibold text-dharma-text">{activeFocus}</h3>
              </div>
              <div className="rounded-2xl bg-saffron-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-saffron-700">
                Visual Cue
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {labels.focusOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setActiveFocus(option)}
                  className={`rounded-full border px-3 py-2 text-sm transition ${
                    activeFocus === option
                      ? 'border-saffron-600 bg-saffron-600 text-white shadow-sm'
                      : 'border-dharma-border bg-dharma-bg text-dharma-text hover:bg-saffron-500/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-dharma-muted">{labels.savedNotice}</p>
          </div>
        </div>

        {summary && (
          <section className="space-y-4">
            <div ref={flashcardRef} className="relative overflow-hidden rounded-3xl border border-saffron-200 bg-saffron-50 p-6 shadow-sm">
              <div className="mb-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700">{scriptureTitle}</p>
                <h3 className="mt-1 text-xl font-serif font-bold text-dharma-text">{chapterTitle}</h3>
                {chapterTitleSanskrit && <p className="font-devanagari text-sm text-saffron-800">{chapterTitleSanskrit}</p>}
              </div>
              <div className="rounded-3xl bg-dharma-card p-6 shadow-sm min-h-[160px] flex flex-col justify-center">
                <div className="text-center">
                  <h4 className="text-xs uppercase tracking-wider text-dharma-muted mb-4">{labels.summary}</h4>
                  <p className={`text-base leading-relaxed text-dharma-text ${language === 'hi' ? 'font-devanagari text-lg' : ''}`}>
                    {summary}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-center items-center">
                <div className="flex items-center gap-2 text-saffron-700 opacity-70">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-wider">dharma-granth</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 px-2">
              <button
                type="button"
                onClick={shareFlashCard}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition bg-saffron-600 hover:bg-saffron-700"
              >
                <Share2 className="h-4 w-4" />
                {language === 'hi' ? 'साझा करें' : 'Share / Download'}
              </button>
            </div>
            {shareStatus !== 'idle' && (
              <p className="mt-3 px-2 text-sm text-dharma-muted">
                {shareStatus === 'shared' && (language === 'hi' ? 'कार्ड साझा किया गया।' : 'Card shared successfully.')}
                {shareStatus === 'copy' && (language === 'hi' ? 'कार्ड डाउनलोड हो गया।' : 'Card image downloaded.')}
                {shareStatus === 'error' && (language === 'hi' ? 'साझा करने में त्रुटि।' : 'Unable to share the card.')}
              </p>
            )}
          </section>
        )}

        <section className="rounded-3xl border border-dharma-border bg-dharma-bg p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-dharma-muted">{labels.reflection}</h3>
              <p className={`mt-2 text-sm leading-relaxed text-dharma-text ${language === 'hi' ? 'font-devanagari text-base' : 'text-sm'}`}>
                {labels.prompt}
              </p>
            </div>
            <div className="rounded-2xl bg-dharma-card px-4 py-2 text-xs font-semibold uppercase tracking-wider text-saffron-700 shadow-sm">
              {Math.round(reflectionProgress)}% ready
            </div>
          </div>

          <textarea
            value={reflection}
            onChange={event => setReflection(event.target.value)}
            placeholder={labels.placeholder}
            className="min-h-28 w-full resize-y rounded-3xl border border-dharma-border bg-dharma-card p-4 text-sm leading-relaxed text-dharma-text outline-none transition focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100/20"
          />

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <div className="h-2 overflow-hidden rounded-full bg-saffron-100">
                <div className="h-2 rounded-full bg-saffron-600 transition-all" style={{ width: `${reflectionProgress}%` }} />
              </div>
              <p className="text-xs text-dharma-muted">{language === 'hi' ? '160 वर्ण तक लिखें और अपनी मानसिकता स्पष्ट करें।' : 'Write up to 160 characters to sharpen your focus.'}</p>
            </div>
            <div className="rounded-3xl border border-dharma-border bg-dharma-card p-4 text-sm text-dharma-text shadow-sm">
              <p className="font-semibold text-dharma-text">{labels.focusTitle}</p>
              <p className="mt-2 text-sm text-dharma-muted">{activeFocus}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {labels.focusOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setActiveFocus(option);
                  if (reflectionIsEmpty) setReflection(option + ' ');
                }}
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  activeFocus === option
                    ? 'border-saffron-600 bg-saffron-600 text-white shadow-sm'
                    : 'border-dharma-border bg-dharma-bg text-dharma-text hover:bg-saffron-500/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-dharma-muted">{labels.savedNotice}</p>
        </section>

        {completed && (
          <section className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            <p className="font-semibold">{language === 'hi' ? 'मनन पूरा हुआ' : 'Reflection complete'}</p>
            <p>{language === 'hi' ? 'आपकी तैयारी सहेज ली गई है और आप इसे बाद में भी देख सकते हैं।' : 'Your preparation is saved and ready for future review.'}</p>
          </section>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setCompleted(!completed)}
            disabled={completeButtonDisabled}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              completeButtonDisabled
                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                : completed
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-saffron-600 text-white hover:bg-saffron-700'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {completed ? labels.completed : labels.complete}
          </button>

          {reflection.trim().length > 0 && (
            <button
              type="button"
              onClick={() => {
                setReflection('');
                setCompleted(false);
                try {
                  localStorage.removeItem(storageKey);
                } catch {
                  // ignore
                }
              }}
              className="inline-flex items-center justify-center rounded-lg border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-semibold text-dharma-text transition hover:bg-saffron-500/10"
            >
              {language === 'hi' ? 'रीसेट करें' : 'Reset Reflection'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
