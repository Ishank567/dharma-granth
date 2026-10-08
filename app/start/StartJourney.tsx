'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PATHS, JOURNEY_KEY, recommend, type JourneyAnswers, type JourneyPath } from '@/data/journeys';
import { useReaderSettings } from '@/lib/useReaderSettings';

interface Option { value: string; en: string; hi: string }
interface Question { key: keyof JourneyAnswers; en: string; hi: string; options: Option[] }

const QUESTIONS: Question[] = [
  {
    key: 'interest', en: 'What would you like to explore?', hi: 'आप क्या जानना चाहेंगे?',
    options: [
      { value: 'gita', en: 'Bhagavad Gita', hi: 'भगवद्गीता' },
      { value: 'upanishads', en: 'Upanishads', hi: 'उपनिषद्' },
      { value: 'bhakti', en: 'Bhakti', hi: 'भक्ति' },
      { value: 'daily', en: 'Daily wisdom', hi: 'दैनिक चिंतन' },
      { value: 'sanskrit', en: 'Sanskrit', hi: 'संस्कृत' },
      { value: 'life', en: 'A life situation', hi: 'जीवन की कोई स्थिति' },
      { value: 'unsure', en: 'I am not sure', hi: 'अभी तय नहीं' },
    ],
  },
  {
    key: 'familiarity', en: 'How familiar are you with Hindu scriptures?', hi: 'शास्त्रों से आपका परिचय कितना है?',
    options: [
      { value: 'new', en: 'New reader', hi: 'नया पाठक' },
      { value: 'some', en: 'Some familiarity', hi: 'थोड़ा परिचय' },
      { value: 'regular', en: 'Regular reader', hi: 'नियमित पाठक' },
      { value: 'serious', en: 'Serious student', hi: 'गंभीर अध्येता' },
    ],
  },
  {
    key: 'language', en: 'Which language experience do you prefer?', hi: 'आप किस भाषा में पढ़ना चाहेंगे?',
    options: [
      { value: 'hindi', en: 'Hindi', hi: 'हिन्दी' },
      { value: 'english', en: 'English', hi: 'अंग्रेज़ी' },
      { value: 'both', en: 'Hindi and English', hi: 'हिन्दी और अंग्रेज़ी' },
      { value: 'sanskrit', en: 'Sanskrit with translations', hi: 'संस्कृत, अनुवाद सहित' },
    ],
  },
  {
    key: 'time', en: 'How much time would you like to spend?', hi: 'कितना समय देना चाहेंगे?',
    options: [
      { value: '5', en: '5 minutes', hi: '५ मिनट' },
      { value: '10', en: '10 minutes', hi: '१० मिनट' },
      { value: '20', en: '20 minutes', hi: '२० मिनट' },
      { value: 'deep', en: 'Deep study', hi: 'गहन अध्ययन' },
    ],
  },
  {
    key: 'format', en: 'Which format do you prefer?', hi: 'कौन-सा रूप पसंद है?',
    options: [
      { value: 'reading', en: 'Reading', hi: 'पढ़ना' },
      { value: 'audio', en: 'Audio', hi: 'सुनना' },
      { value: 'visual', en: 'Visual explanations', hi: 'चित्र सहित' },
      { value: 'mixed', en: 'Mixed', hi: 'मिश्रित' },
    ],
  },
];

type Draft = Partial<Record<keyof JourneyAnswers, string>>;

export function StartJourney() {
  const { update } = useReaderSettings();
  const [draft, setDraft] = useState<Draft>({});
  const [saved, setSaved] = useState<JourneyAnswers | null>(null);
  const [storageOk, setStorageOk] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(JOURNEY_KEY);
      if (raw) setSaved(JSON.parse(raw) as JourneyAnswers);
    } catch {
      setStorageOk(false);
    }
    setLoaded(true);
  }, []);

  const complete = QUESTIONS.every((q) => draft[q.key]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete) return;
    const answers = draft as unknown as JourneyAnswers;
    try {
      localStorage.setItem(JOURNEY_KEY, JSON.stringify(answers));
    } catch {
      setStorageOk(false);
    }
    // Reader preferences the answers imply. These are visible and changeable in Reader settings.
    update('preferredLanguage', answers.language === 'hindi' ? 'hindi' : answers.language === 'english' ? 'english' : 'all');
    update('showHindi', answers.language !== 'english');
    update('showEnglish', answers.language !== 'hindi');
    update('readerMode', answers.time === '5' ? 'quick' : answers.time === 'deep' || answers.familiarity === 'serious' ? 'deep' : 'simple');
    setSaved(answers);
  }

  function reset() {
    try {
      localStorage.removeItem(JOURNEY_KEY);
    } catch {
      // nothing stored to remove
    }
    setSaved(null);
    setDraft({});
  }

  const paths: JourneyPath[] = saved ? recommend(saved) : [];

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-dharma-text">Start My Journey</h1>
      <p lang="hi" className="font-devanagari text-lg text-dharma-muted">अपनी अध्ययन यात्रा शुरू करें</p>
      <p className="mt-3 text-sm text-dharma-muted">
        Five short questions, all optional to skip. No sign-in. You will get up to three suggested paths from the library.
      </p>

      <aside aria-label="What is stored" className="mt-4 rounded-xl border border-dharma-border bg-dharma-card p-4 text-sm text-dharma-muted">
        <strong className="text-dharma-text">What is stored.</strong> Your five answers, and the matching reader settings (language and
        explanation depth), are kept in this browser only. Nothing is sent anywhere. We do not guess your beliefs or identity from them.
        You can change or delete them at any time.
      </aside>

      {!loaded ? (
        <p className="mt-8 text-sm text-dharma-muted" role="status">Loading…</p>
      ) : saved ? (
        <section aria-labelledby="rec-h" className="mt-8">
          <h2 id="rec-h" className="font-serif text-2xl font-bold text-dharma-text">Suggested for you</h2>
          <ul className="mt-4 space-y-4">
            {paths.map((p, i) => (
              <li key={p.id} className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
                <h3 className="font-serif text-lg font-bold text-dharma-text">
                  {p.title} <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted">· {p.titleHi}</span>
                </h3>
                <p className="mt-1 text-sm text-dharma-muted">{p.summary}</p>
                <p className="mt-1 text-xs text-dharma-muted">
                  Why: {i === 0 ? 'it matches what you want to explore.' : 'it fits your time and experience.'} · {p.minutes}
                </p>
                {p.note && <p className="mt-1 text-xs text-dharma-muted">{p.note}</p>}
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
                  {p.steps.map((s) => (
                    <li key={s.href + s.label}>
                      <Link href={s.href} className="text-saffron-800 underline underline-offset-2 hover:text-saffron-900 dark:text-saffron-300">{s.label}</Link>
                    </li>
                  ))}
                </ol>
                <Link href={p.href} className="focus-ring mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800">
                  Begin
                </Link>
              </li>
            ))}
          </ul>
          {saved.format === 'audio' && (
            <p className="mt-4 text-xs text-dharma-muted">Audio today means your device’s speech voice on each verse (Listen and Slow). Recorded recitation is not available yet.</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setSaved(null)} className="focus-ring min-h-[44px] rounded-xl border border-dharma-border px-5 text-sm font-semibold text-dharma-text hover:border-saffron-400">
              Change my answers
            </button>
            <button type="button" onClick={reset} className="focus-ring min-h-[44px] rounded-xl border border-dharma-border px-5 text-sm font-semibold text-dharma-text hover:border-rose-400">
              Delete my answers
            </button>
          </div>
        </section>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-6">
          {QUESTIONS.map((q, i) => (
            <fieldset key={q.key} className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
              <legend className="px-1 text-base font-semibold text-dharma-text">
                {i + 1}. {q.en} <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted">· {q.hi}</span>
              </legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {q.options.map((o) => (
                  <label key={o.value} className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-3 text-sm focus-within:ring-2 focus-within:ring-saffron-500 ${draft[q.key] === o.value ? 'border-saffron-700 bg-saffron-50 dark:bg-saffron-950/30' : 'border-dharma-border'}`}>
                    <input type="radio" name={q.key} value={o.value} checked={draft[q.key] === o.value} onChange={() => setDraft({ ...draft, [q.key]: o.value })} className="h-4 w-4 accent-saffron-700" />
                    <span>{o.en} <span lang="hi" className="font-devanagari text-dharma-muted">· {o.hi}</span></span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={!complete} className="focus-ring min-h-[48px] rounded-xl bg-saffron-700 px-6 text-sm font-semibold text-white hover:bg-saffron-800 disabled:cursor-not-allowed disabled:opacity-50">
              Show my suggested path
            </button>
            <Link href="/scriptures" className="focus-ring inline-flex min-h-[48px] items-center rounded-xl px-4 text-sm font-semibold text-dharma-muted underline underline-offset-2">
              Skip and browse the library
            </Link>
          </div>
          {!complete && <p className="text-xs text-dharma-muted">Answer all five to see a path, or skip.</p>}
        </form>
      )}

      {!storageOk && (
        <p role="status" className="mt-6 text-xs text-dharma-muted">Your browser is blocking storage, so answers will not be remembered after you leave.</p>
      )}
      <p className="mt-8 text-xs text-dharma-muted">
        Suggested paths use only the library’s existing courses and pages ({Object.keys(PATHS).length} curated paths). Reader settings you can adjust at any time in the reader.
      </p>
    </main>
  );
}
