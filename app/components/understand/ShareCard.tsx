'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ImageDown, Share2 } from 'lucide-react';
import { ReaderDialog } from '@/app/components/reader/ReaderDialog';

/**
 * Shareable verse card (spec §16): a short Sanskrit excerpt, the reference,
 * a one-line meaning and attribution, drawn on a canvas so the PNG is real
 * Devanagari at 1080×1350 (phone-friendly 4:5). The excerpt and the meaning are
 * visually separate, and the meaning is labelled as explanation.
 */

type ThemeId = 'paper' | 'saffron' | 'midnight' | 'minimal';

interface CardTheme {
  label: string;
  bg: string;
  frame: string;
  verse: string;
  meaning: string;
  accent: string;
  muted: string;
}

// Text colours are chosen for ≥ 7:1 against their background.
const THEMES: Record<ThemeId, CardTheme> = {
  paper: { label: 'Paper', bg: '#f6eddc', frame: '#b08a4a', verse: '#2b1d10', meaning: '#3d2d1c', accent: '#8a4b12', muted: '#5a4630' },
  saffron: { label: 'Saffron', bg: '#9a3f08', frame: '#f7c47a', verse: '#fff7ea', meaning: '#ffeed4', accent: '#ffd9a0', muted: '#ffe5c0' },
  midnight: { label: 'Midnight', bg: '#0f1226', frame: '#6f78c8', verse: '#f4f1ea', meaning: '#dcd9e8', accent: '#f5c46b', muted: '#b9b7cf' },
  minimal: { label: 'Minimal', bg: '#ffffff', frame: '#d6d3cd', verse: '#111111', meaning: '#2a2a2a', accent: '#8a4b12', muted: '#4d4a45' },
};

const W = 1080;
const H = 1350;
const PAD = 96;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = word;
      } else line = test;
    }
    if (line) out.push(line);
  }
  return out;
}

/** The first two lines of the verse, enough to recognise it without a wall of text. */
function excerpt(sanskrit: string): string {
  const lines = sanskrit.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.slice(0, 2).join('\n');
}

export function ShareCardButton({
  sanskrit,
  reference,
  referenceSanskrit,
  meaning,
  url,
}: {
  sanskrit: string;
  reference: string;
  referenceSanskrit?: string;
  meaning: string;
  url: string;
}) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>('paper');
  const [note, setNote] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const name = useId();

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const t = THEMES[theme];
    const devanagari = getComputedStyle(document.body).getPropertyValue('--font-noto-devanagari').trim() || 'Noto Sans Devanagari';
    const dev = `${devanagari}, "Noto Sans Devanagari", sans-serif`;
    try {
      await Promise.all([document.fonts.load(`600 56px ${dev}`), document.fonts.load(`400 40px ${dev}`)]);
    } catch {
      // Draw with the fallback font rather than not at all.
    }

    canvas.width = W;
    canvas.height = H;
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = t.frame;
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const cx = W / 2;
    const maxW = W - PAD * 2;

    // Reference
    ctx.fillStyle = t.accent;
    ctx.font = `600 38px ${dev}`;
    ctx.fillText(referenceSanskrit ? `${referenceSanskrit}` : reference, cx, 190);
    ctx.font = '600 30px Inter, system-ui, sans-serif';
    ctx.fillStyle = t.muted;
    ctx.fillText(reference, cx, 240);

    // Verse excerpt, shrunk until it fits in at most 4 lines.
    let size = 76;
    let lines: string[] = [];
    do {
      ctx.font = `600 ${size}px ${dev}`;
      lines = wrap(ctx, excerpt(sanskrit), maxW);
      size -= 4;
    } while (lines.length > 4 && size > 40);
    const lh = Math.round((size + 4) * 1.6);
    let y = 420;
    ctx.fillStyle = t.verse;
    for (const l of lines) {
      ctx.fillText(l, cx, y);
      y += lh;
    }

    // Divider, then the meaning, labelled as explanation rather than scripture.
    y += 20;
    ctx.fillStyle = t.frame;
    ctx.fillRect(cx - 60, y, 120, 3);
    y += 90;
    ctx.fillStyle = t.muted;
    ctx.font = '600 26px Inter, system-ui, sans-serif';
    ctx.fillText('IN ONE LINE · EXPLANATION, NOT SCRIPTURE', cx, y);
    y += 62;
    ctx.fillStyle = t.meaning;
    ctx.font = '400 44px Georgia, "Times New Roman", serif';
    for (const l of wrap(ctx, meaning, maxW).slice(0, 4)) {
      ctx.fillText(l, cx, y);
      y += 64;
    }

    // Attribution
    ctx.fillStyle = t.muted;
    ctx.font = '600 30px Inter, system-ui, sans-serif';
    ctx.fillText('Dharma Granth', cx, H - 130);
    ctx.font = '400 26px Inter, system-ui, sans-serif';
    ctx.fillText(url.replace(/^https?:\/\//, '').replace(/\/$/, ''), cx, H - 86);
  }, [theme, sanskrit, reference, referenceSanskrit, meaning, url]);

  useEffect(() => {
    if (open) {
      // The dialog mounts the canvas on the next frame.
      const id = requestAnimationFrame(() => void draw());
      return () => cancelAnimationFrame(id);
    }
  }, [open, draw]);

  const toBlob = () =>
    new Promise<Blob | null>((resolve) => canvasRef.current?.toBlob((b) => resolve(b), 'image/png') ?? resolve(null));

  const download = async () => {
    const blob = await toBlob();
    if (!blob) return setNote('Could not create the image in this browser.');
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `${reference.replace(/\s+/g, '-').toLowerCase()}-${theme}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 10_000);
    setNote('Image saved to your device.');
  };

  const share = async () => {
    const blob = await toBlob();
    if (!blob) return setNote('Could not create the image in this browser.');
    const file = new File([blob], `${reference}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `${reference} · Dharma Granth`, url });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    await download();
  };

  const btn = 'focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition';

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={`${btn} border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400`}>
        <ImageDown className="h-4 w-4" aria-hidden="true" /> Create share card
      </button>
      <ReaderDialog open={open} onClose={() => setOpen(false)} title="Share card" titleHi="साझा कार्ड" variant="modal">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Share card for ${reference}. Sanskrit excerpt: ${excerpt(sanskrit).replace(/\n/g, ' ')}. Meaning: ${meaning}`}
          className="mx-auto mb-4 aspect-[4/5] w-full max-w-[280px] rounded-lg border border-dharma-border"
        />
        <fieldset className="mb-4">
          <legend className="mb-2 text-sm font-semibold text-dharma-text">Theme</legend>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(THEMES) as ThemeId[]).map((id) => (
              <label key={id} className="relative cursor-pointer">
                <input type="radio" name={name} checked={theme === id} onChange={() => setTheme(id)} className="peer sr-only" />
                <span className="flex min-h-[44px] items-center justify-center rounded-xl border border-dharma-border bg-dharma-bg text-xs font-semibold text-dharma-text peer-checked:border-saffron-700 peer-checked:bg-saffron-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-saffron-500">
                  {THEMES[id].label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={download} className={`${btn} border-saffron-700 bg-saffron-700 text-white hover:bg-saffron-800`}>
            <ImageDown className="h-4 w-4" aria-hidden="true" /> Save image
          </button>
          <button type="button" onClick={share} className={`${btn} border-dharma-border bg-dharma-card text-dharma-text`}>
            <Share2 className="h-4 w-4" aria-hidden="true" /> Share
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-sm text-dharma-muted">{note}</p>
      </ReaderDialog>
    </>
  );
}
