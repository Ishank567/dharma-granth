'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { answerQuestion, COPILOT_EXAMPLES, wisdomSlugFromPath, type CopilotAnswer } from '@/lib/copilot';
import { getWisdomTopic } from '@/data/wisdom-for-life';

export function CopilotPanel({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const pageSlug = wisdomSlugFromPath(pathname);
  const pageTopic = pageSlug ? getWisdomTopic(pageSlug) : undefined;
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<CopilotAnswer | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const ask = (text: string) => {
    const next = text.trim();
    if (!next) return;
    setQuery(next);
    setAnswer(answerQuestion(next));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:p-4 print:hidden">
      <button type="button" className="absolute inset-0 bg-stone-950/40" aria-label="सहायक बंद करें" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(40rem,100dvh)] w-full flex-col overflow-hidden rounded-t-2xl border border-dharma-border bg-dharma-card text-dharma-text shadow-2xl sm:max-w-md sm:rounded-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-dharma-border px-4 py-3">
          <div>
            <h2 id={titleId} className="text-lg font-bold" lang="hi">धर्म सहायक</h2>
            <p className="text-sm text-dharma-text-secondary" lang="hi">पुस्तकालय में दर्ज श्लोक और विषय। नई टीका नहीं लिखी जाती।</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/ask/" className="inline-flex min-h-11 items-center font-semibold text-dharma-maroon underline underline-offset-4">
              पूरा पृष्ठ
            </Link>
            <button type="button" onClick={onClose} className="min-h-11 min-w-11 rounded-full border border-dharma-border px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon">
              बंद
            </button>
          </div>
        </header>

        <form
          className="grid gap-2 border-b border-dharma-border px-4 py-3"
          onSubmit={(event) => {
            event.preventDefault();
            ask(query);
          }}
        >
          <label htmlFor="dharma-copilot-q" className="text-sm font-semibold" lang="hi">प्रश्न</label>
          <textarea
            id="dharma-copilot-q"
            ref={inputRef}
            rows={2}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="उदाहरण: क्रोध कैसे संभालें?"
            lang="hi"
            className="w-full resize-none rounded-xl border border-dharma-border bg-dharma-bg px-3 py-2 text-base text-dharma-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
          />
          <button type="submit" className="min-h-11 rounded-full bg-dharma-maroon px-4 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon">
            पुस्तकालय में देखें
          </button>
        </form>

        <div className="grid gap-4 overflow-y-auto px-4 py-4">
          {pageTopic && (
            <button
              type="button"
              className="min-h-11 rounded-xl border border-dharma-border px-3 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
              onClick={() => ask(pageTopic.titleHi)}
            >
              <span lang="hi">इस पृष्ठ से: {pageTopic.titleHi}</span>
            </button>
          )}

          {!answer && (
            <div className="grid gap-2">
              <p className="text-sm font-semibold" lang="hi">इनमें से पूछें</p>
              {COPILOT_EXAMPLES.map((example) => (
                <button
                  key={example.en}
                  type="button"
                  className="min-h-11 rounded-xl border border-dharma-border px-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dharma-maroon"
                  onClick={() => ask(example.hi)}
                >
                  <span className="block font-medium" lang="hi">{example.hi}</span>
                  <span className="block text-sm text-dharma-text-secondary">{example.en}</span>
                </button>
              ))}
            </div>
          )}

          {answer && <AnswerView answer={answer} />}
        </div>
      </div>
    </div>
  );
}

function AnswerView({ answer }: { answer: CopilotAnswer }) {
  return (
    <article className="grid gap-4" lang="hi">
      <header>
        <h3 className="text-xl font-bold">{answer.titleHi}</h3>
        {answer.titleEn !== answer.titleHi && <p className="text-sm text-dharma-text-secondary">{answer.titleEn}</p>}
      </header>

      {answer.verses.length > 0 && (
        <section className="grid gap-3">
          <h4 className="font-bold">संबंधित श्लोक</h4>
          {answer.verses.map((verse) => (
            <div key={verse.href + verse.refEn} className="grid gap-2 rounded-xl border border-dharma-border p-3">
              <p className="text-sm font-semibold">{verse.refHi}</p>
              <p lang="sa" className="whitespace-pre-line text-lg leading-relaxed">{verse.sanskrit}</p>
              <p>{verse.hindi}</p>
              <p className="text-sm text-dharma-text-secondary" lang="en">{verse.english}</p>
              {verse.noteHi && <p className="text-sm">{verse.noteHi}</p>}
              <Link href={verse.href} className="inline-flex min-h-11 items-center font-semibold text-dharma-maroon underline underline-offset-4">
                श्लोक पृष्ठ खोलें
              </Link>
            </div>
          ))}
        </section>
      )}

      {answer.simpleHi && (
        <section>
          <h4 className="font-bold">सरल अर्थ</h4>
          <p className="mt-1">{answer.simpleHi}</p>
        </section>
      )}

      {answer.contextHi && (
        <section>
          <h4 className="font-bold">पुस्तकालय में दर्ज संदर्भ</h4>
          <p className="mt-1">{answer.contextHi}</p>
        </section>
      )}

      {answer.applicationHi && (
        <section>
          <h4 className="font-bold">आज के जीवन में</h4>
          <p className="mt-1">{answer.applicationHi}</p>
        </section>
      )}

      {answer.dailyHi && (
        <section>
          <h4 className="font-bold">आज का एक कदम</h4>
          <p className="mt-1">{answer.dailyHi}</p>
        </section>
      )}

      {answer.related.length > 0 && (
        <section>
          <h4 className="font-bold">आगे पढ़ें</h4>
          <ul className="mt-1 grid gap-1">
            {answer.related.map((link) => (
              <li key={link.href + link.labelEn}>
                <Link href={link.href} className="inline-flex min-h-11 items-center font-semibold text-dharma-maroon underline underline-offset-4">
                  {link.labelHi}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {answer.disclaimerHi && <p className="text-sm text-dharma-text-secondary">{answer.disclaimerHi}</p>}
    </article>
  );
}
