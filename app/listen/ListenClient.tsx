'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import {
  reciteVerse,
  speechSupported,
  splitVerseLines,
  stopRecitation,
  subscribeRecitation,
} from '@/lib/verse-recite';
import { cleanVerseField } from '@/lib/verse-format';

interface Verse {
  number: number | string;
  sanskrit?: string;
  translation?: string;
  hindi?: string;
}

type Narration = 'none' | 'hindi' | 'english';
const SPEEDS = [0.7, 0.85, 1, 1.2] as const;
const SLEEP = [0, 10, 20, 30] as const;
const REPEATS = [1, 2, 3, 5] as const;

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function ListenClient() {
  const params = useSearchParams();
  const rawS = params.get('s') ?? 'bhagavadgita';
  const rawC = Number(params.get('c') ?? '2');
  const scriptureId = /^[a-z0-9-]+$/.test(rawS) ? rawS : 'bhagavadgita';
  const chapterId = Number.isInteger(rawC) && rawC > 0 ? rawC : 2;

  const [title, setTitle] = useState('');
  const [verses, setVerses] = useState<Verse[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(0.85);
  const [narration, setNarration] = useState<Narration>('none');
  const [repeat, setRepeat] = useState<number>(1);
  const [sleepMin, setSleepMin] = useState<number>(0);
  const [activeLine, setActiveLine] = useState<number | 'meaning' | null>(null);
  const [activeWord, setActiveWord] = useState<number | null>(null);
  const [supported, setSupported] = useState(true);

  // Live values for the playback chain, so changing a setting does not restart it.
  const live = useRef({ index: 0, playing: false, speed: 0.85, narration: 'none' as Narration, repeat: 1, verses: [] as Verse[], round: 0 });
  live.current.index = index;
  live.current.playing = playing;
  live.current.speed = speed;
  live.current.narration = narration;
  live.current.repeat = repeat;
  live.current.verses = verses;

  useEffect(() => {
    setSupported(speechSupported());
    return subscribeRecitation((s) => setActiveLine(s.isSpeaking ? s.lineIndex ?? null : null));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    stopRecitation();
    setPlaying(false);
    setIndex(0);
    fetch(`${BASE}/data/scriptures-full/${scriptureId}/ch-${chapterId}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        if (cancelled) return;
        const list: Verse[] = d?.chapter?.verses ?? [];
        if (!list.length) throw new Error('empty');
        setVerses(list);
        setTitle(`${d.chapter.title ?? ''}`);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => {
      cancelled = true;
      stopRecitation();
    };
  }, [scriptureId, chapterId]);

  const stop = useCallback(() => {
    live.current.playing = false;
    setPlaying(false);
    setActiveWord(null);
    stopRecitation();
  }, []);

  const speakVerse = useCallback((i: number) => {
    const v = live.current.verses[i];
    if (!v) { stop(); return; }
    const n = live.current.narration;
    reciteVerse(
      { sanskrit: v.sanskrit, hindi: n === 'hindi' ? v.hindi : undefined, translation: n === 'english' ? v.translation : undefined },
      (natural) => {
        if (!natural || !live.current.playing) return;
        live.current.round += 1;
        if (live.current.round < live.current.repeat) { speakVerse(i); return; }
        live.current.round = 0;
        if (i + 1 < live.current.verses.length) { setIndex(i + 1); speakVerse(i + 1); } else stop();
      },
      { speed: live.current.speed, onlySanskrit: n === 'none', loop: false },
    );
  }, [stop]);

  const play = (i = index) => {
    live.current.playing = true;
    live.current.round = 0;
    setPlaying(true);
    setIndex(i);
    speakVerse(i);
  };

  const jump = (i: number) => {
    const next = Math.min(Math.max(i, 0), verses.length - 1);
    if (playing) play(next); else { stopRecitation(); setIndex(next); }
  };

  // Sleep timer.
  useEffect(() => {
    if (!playing || sleepMin === 0) return;
    const t = setTimeout(stop, sleepMin * 60_000);
    return () => clearTimeout(t);
  }, [playing, sleepMin, stop]);

  // Word by word: each word spoken slowly on its own, with the word marked.
  const wordByWord = () => {
    const v = verses[index];
    if (!v?.sanskrit) return;
    stop();
    const words = splitVerseLines(v.sanskrit).join(' ').split(/\s+/).filter((w) => /[ऀ-ॿ]/.test(w));
    live.current.playing = true;
    setPlaying(true);
    const next = (k: number) => {
      if (!live.current.playing || k >= words.length) { stop(); return; }
      setActiveWord(k);
      reciteVerse({ sanskrit: words[k] }, (natural) => { if (natural) next(k + 1); else setActiveWord(null); }, { speed: 0.6, onlySanskrit: true, loop: false });
    };
    next(0);
  };

  const verse = verses[index];
  const lines = verse?.sanskrit ? splitVerseLines(verse.sanskrit) : [];
  const btn = 'focus-ring inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 text-sm font-semibold text-dharma-text hover:border-saffron-400 disabled:opacity-50';
  const chip = (on: boolean) => `focus-ring min-h-[44px] rounded-xl border px-3 text-sm font-semibold ${on ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text'}`;

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href={`/scripture/${scriptureId}/chapter/${chapterId}`} className="text-sm text-dharma-muted underline underline-offset-2">Back to the chapter</Link>
      <h1 className="mt-2 font-serif text-2xl font-bold text-dharma-text">Listen · <span lang="hi" className="font-devanagari">सुनें</span></h1>
      <p className="text-sm text-dharma-muted">{scriptureId} chapter {chapterId}{title ? `: ${title}` : ''}</p>

      {status === 'loading' && <p role="status" className="mt-6 text-sm text-dharma-muted">Loading the chapter…</p>}
      {status === 'error' && (
        <div role="alert" className="mt-6 rounded-xl border border-amber-500/40 bg-amber-50/70 p-4 text-sm dark:bg-amber-950/20">
          <p className="font-semibold">This chapter could not be loaded for listening.</p>
          <p className="mt-1 text-dharma-muted">Check your connection, or open the chapter to read it.</p>
          <Link href={`/scripture/${scriptureId}/chapter/${chapterId}`} className="mt-2 inline-block font-semibold underline underline-offset-2">Open the chapter</Link>
        </div>
      )}

      {status === 'ready' && verse && (
        <>
          {!supported && (
            <p role="alert" className="mt-4 rounded-xl border border-amber-500/40 bg-amber-50/70 p-3 text-sm dark:bg-amber-950/20">
              Audio unavailable: this browser has no speech voice. The text below can still be read.
            </p>
          )}

          <section aria-label="Current verse" className="mt-4 rounded-2xl border-2 border-amber-700/35 bg-amber-50/70 p-5 dark:border-amber-500/30 dark:bg-amber-950/25">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">Original scripture · verse {String(verse.number)} of {verses.length}</p>
            <p lang="sa" className="mt-2 text-center font-devanagari text-2xl font-semibold leading-[2.05] text-dharma-text">
              {lines.map((line, k) => (
                <span key={k} aria-current={activeLine === k ? 'true' : undefined} className={`block rounded px-2 ${activeLine === k ? 'bg-amber-200/80 dark:bg-amber-800/50' : ''}`}>{line}</span>
              ))}
            </p>
            {activeWord !== null && <p role="status" className="mt-1 text-center text-xs text-dharma-muted">Word {activeWord + 1}</p>}
            {narration !== 'none' && (
              <p lang={narration === 'hindi' ? 'hi' : 'en'} aria-current={activeLine === 'meaning' ? 'true' : undefined} className={`mt-3 rounded border-t border-amber-700/20 px-2 pt-2 ${narration === 'hindi' ? 'font-devanagari' : 'font-serif'} ${activeLine === 'meaning' ? 'bg-amber-100 dark:bg-amber-900/40' : ''}`}>
                {cleanVerseField(narration === 'hindi' ? verse.hindi : verse.translation)}
              </p>
            )}
          </section>

          {/* Controls stay in the page flow so verse navigation is never covered. */}
          <section aria-label="Playback controls" className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => jump(index - 1)} disabled={index === 0} className={btn} aria-label="Previous verse"><SkipBack className="h-4 w-4" aria-hidden="true" /> Previous</button>
              <button type="button" onClick={() => (playing ? stop() : play())} disabled={!supported} className={`${btn} !border-saffron-700 !bg-saffron-700 !text-white`}>
                {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                {playing ? 'Stop' : 'Play'}
              </button>
              <button type="button" onClick={() => jump(index + 1)} disabled={index >= verses.length - 1} className={btn} aria-label="Next verse">Next <SkipForward className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" onClick={wordByWord} disabled={!supported} className={btn}>Word by word</button>
              <label className="ml-auto text-xs font-semibold text-dharma-muted">
                Verse
                <select value={index} onChange={(e) => jump(Number(e.target.value))} className="ml-2 min-h-[44px] rounded-xl border border-dharma-border bg-dharma-bg px-2 text-sm text-dharma-text">
                  {verses.map((v, i) => <option key={i} value={i}>{String(v.number)}</option>)}
                </select>
              </label>
            </div>

            <fieldset><legend className="text-xs font-semibold text-dharma-muted">Speed (0.7 is slow pronunciation)</legend>
              <div className="mt-1 flex flex-wrap gap-2">{SPEEDS.map((s) => <button key={s} type="button" aria-pressed={speed === s} onClick={() => setSpeed(s)} className={chip(speed === s)}>{s}×</button>)}</div></fieldset>
            <fieldset><legend className="text-xs font-semibold text-dharma-muted">Also read the meaning</legend>
              <div className="mt-1 flex flex-wrap gap-2">
                {(['none', 'hindi', 'english'] as const).map((n) => <button key={n} type="button" aria-pressed={narration === n} onClick={() => setNarration(n)} className={chip(narration === n)}>{n === 'none' ? 'Sanskrit only' : n === 'hindi' ? 'Hindi translation' : 'English translation'}</button>)}
              </div></fieldset>
            <div className="flex flex-wrap gap-6">
              <fieldset><legend className="text-xs font-semibold text-dharma-muted">Repeat each verse</legend>
                <div className="mt-1 flex gap-2">{REPEATS.map((r) => <button key={r} type="button" aria-pressed={repeat === r} onClick={() => setRepeat(r)} className={chip(repeat === r)}>{r}×</button>)}</div></fieldset>
              <fieldset><legend className="text-xs font-semibold text-dharma-muted">Sleep timer</legend>
                <div className="mt-1 flex gap-2">{SLEEP.map((m) => <button key={m} type="button" aria-pressed={sleepMin === m} onClick={() => setSleepMin(m)} className={chip(sleepMin === m)}>{m === 0 ? 'Off' : `${m} min`}</button>)}</div></fieldset>
            </div>
            <p role="status" className="text-xs text-dharma-muted">{playing ? `Playing verse ${String(verse.number)}.` : 'Stopped.'}{sleepMin > 0 && playing ? ` Stops after ${sleepMin} minutes.` : ''}</p>
          </section>

          <section aria-labelledby="queue-h" className="mt-6">
            <h2 id="queue-h" className="font-serif text-lg font-bold text-dharma-text">Listening queue</h2>
            <ol className="mt-2 space-y-1 text-sm">
              {verses.slice(index + 1, index + 6).map((v, k) => (
                <li key={k}>
                  <button type="button" onClick={() => jump(index + 1 + k)} className="focus-ring flex min-h-[44px] w-full items-center gap-3 rounded-lg border border-dharma-border bg-dharma-card px-3 text-left hover:border-saffron-400">
                    <span className="font-semibold">{String(v.number)}</span>
                    <span lang="sa" className="truncate font-devanagari text-dharma-muted">{splitVerseLines(v.sanskrit)[0]}</span>
                  </button>
                </li>
              ))}
              {index >= verses.length - 1 && <li className="text-dharma-muted">This is the last verse of the chapter.</li>}
            </ol>
          </section>

          <section aria-labelledby="src-h" className="mt-6 rounded-xl border border-dharma-border bg-dharma-card/60 p-4 text-sm text-dharma-muted">
            <h2 id="src-h" className="font-semibold text-dharma-text">About this audio</h2>
            <p className="mt-1">
              Sound comes from your device’s built-in speech voice, not from a recorded reciter, so there is no reciter to credit and Sanskrit pronunciation depends on the voice installed.
              On some phones, speech pauses when the screen locks. The text above is the transcript of what is spoken.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
