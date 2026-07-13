'use client';

import { useRef, useState } from 'react';
import { Loader2, Share2 } from 'lucide-react';

interface Props {
  scriptureTitle: string;
  chapterTitle: string;
  verseLabel: string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
  compact?: boolean;
}

/** Poll until `get` returns a value (the card commits to the DOM). */
function waitFor<T>(get: () => T | null): Promise<T> {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const tick = () => {
      const value = get();
      if (value) return resolve(value);
      if (++tries > 40) return reject(new Error('share card never mounted'));
      setTimeout(tick, 25);
    };
    tick();
  });
}

/**
 * Shares the verse as a rendered image card — via the native share sheet on
 * devices that support sharing files, otherwise as a PNG download. Falls back
 * to sharing/copying plain text if image capture fails. The card is mounted
 * off-screen only during capture, so it's safe on pages with many verses.
 */
export function ShareVerseButton(props: Props) {
  const {
    scriptureTitle,
    chapterTitle,
    verseLabel,
    sanskrit,
    transliteration,
    hindi,
    translation,
    compact = false,
  } = props;
  const [busy, setBusy] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const plainText = [
    `${scriptureTitle} · ${chapterTitle} · श्लोक ${verseLabel}`,
    sanskrit?.trim(),
    transliteration?.trim(),
    hindi?.trim(),
    translation?.trim(),
  ]
    .filter(Boolean)
    .join('\n\n');

  async function shareAsText() {
    try {
      if (navigator.share) {
        await navigator.share({ text: `${plainText}\n\n— dharmagranth.in` });
      } else {
        await navigator.clipboard.writeText(`${plainText}\n\n— dharmagranth.in`);
      }
    } catch {
      // User dismissed the sheet or clipboard unavailable — nothing to do.
    }
  }

  async function share() {
    if (busy) return;
    setBusy(true);
    setCapturing(true);
    try {
      const node = await waitFor(() => cardRef.current);
      await document.fonts?.ready;
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `verse-${verseLabel}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${scriptureTitle} · श्लोक ${verseLabel}`,
        });
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = file.name;
        a.click();
      }
    } catch (err) {
      // AbortError means the user closed the share sheet — not a failure.
      if ((err as Error).name !== 'AbortError') await shareAsText();
    } finally {
      setCapturing(false);
      setBusy(false);
    }
  }

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={share}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-full border border-dharma-border/60 bg-dharma-bg px-2.5 py-0.5 text-[10px] font-medium text-dharma-muted transition hover:border-saffron-300 hover:text-saffron-700 disabled:opacity-60"
          aria-label="Share this verse as an image"
          title="Share as image (साझा करें)"
        >
          {busy ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Share2 className="h-3 w-3" />
          )}
          Share
        </button>
      ) : (
        <button
          type="button"
          onClick={share}
          disabled={busy}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-dharma-border bg-dharma-card/80 text-dharma-muted transition hover:border-saffron-300 hover:text-saffron-700 disabled:opacity-60"
          aria-label="Share this verse as an image"
          title="Share as image (साझा करें)"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
        </button>
      )}

      {/* Off-screen Pinterest-style pin (2:3 portrait) that html-to-image
          snapshots — mounted only while capturing. Inline styles keep the
          capture viewport-independent. */}
      {capturing ? (
        <div aria-hidden style={{ position: 'fixed', left: -9999, top: 0, pointerEvents: 'none' }}>
          <div
            ref={cardRef}
            style={{
              width: 420,
              minHeight: 630,
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              padding: 26,
              background:
                'radial-gradient(circle at 18% 8%, rgba(217,119,6,0.16) 0%, transparent 42%), ' +
                'radial-gradient(circle at 85% 92%, rgba(190,24,93,0.12) 0%, transparent 45%), ' +
                'linear-gradient(160deg, #fffdf7 0%, #fdf3d7 60%, #f8e3b8 100%)',
              fontFamily: "'Noto Sans Devanagari', 'Merriweather', 'Inter', serif",
              color: '#3b2415',
            }}
          >
            {/* Inner frame */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1.5px solid rgba(180,83,9,0.35)',
                borderRadius: 18,
                padding: '28px 24px 20px',
                boxShadow: 'inset 0 0 0 5px rgba(255,253,247,0.6), inset 0 0 0 6px rgba(180,83,9,0.14)',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  color: '#b45309',
                  background: 'rgba(255,253,247,0.9)',
                  border: '1.5px solid rgba(180,83,9,0.4)',
                  boxShadow: '0 4px 14px rgba(180,83,9,0.18)',
                }}
              >
                ॐ
              </div>

              <div
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 3.5,
                  textTransform: 'uppercase',
                  color: '#b45309',
                }}
              >
                Dharma Granth
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#92400e',
                  opacity: 0.85,
                }}
              >
                {scriptureTitle} · {chapterTitle} · श्लोक {verseLabel}
              </div>

              <div style={{ margin: '18px 0 0', fontSize: 13, color: '#c2691a', letterSpacing: 6 }}>
                ✦ ❁ ✦
              </div>

              {/* Verse — the visual centrepiece */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {sanskrit ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 24,
                      lineHeight: '42px',
                      fontWeight: 700,
                      whiteSpace: 'pre-line',
                      color: '#7c2d12',
                      textShadow: '0 1px 0 rgba(255,255,255,0.6)',
                    }}
                  >
                    {sanskrit.trim()}
                  </p>
                ) : null}
                {transliteration ? (
                  <p
                    style={{
                      margin: '14px 0 0',
                      fontSize: 12,
                      lineHeight: '19px',
                      fontStyle: 'italic',
                      whiteSpace: 'pre-line',
                      color: '#8a7360',
                    }}
                  >
                    {transliteration.trim()}
                  </p>
                ) : null}
                {hindi || translation ? (
                  <>
                    <div
                      style={{
                        margin: '20px 0',
                        width: 140,
                        height: 1,
                        background:
                          'linear-gradient(90deg, transparent, rgba(180,83,9,0.55), transparent)',
                      }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        lineHeight: '26px',
                        color: '#57402a',
                      }}
                    >
                      {(hindi ?? translation ?? '').trim()}
                    </p>
                  </>
                ) : null}
              </div>

              <div style={{ marginTop: 18, fontSize: 13, color: '#c2691a', letterSpacing: 6 }}>
                ✦ ❁ ✦
              </div>
            </div>

            {/* Brand strip */}
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                color: '#92400e',
              }}
            >
              <span>dharmagranth.in</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ fontWeight: 500, color: '#a8834f' }}>
                Sanskrit scriptures, verse by verse
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
