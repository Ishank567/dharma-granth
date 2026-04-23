import type { ChapterPosition } from '@/app/lib/gitaContext';

export default function ChapterContextStrip({ position }: { position: ChapterPosition }) {
  const chapterPct = Math.round((position.verseInChapter / position.totalInChapter) * 100);
  const overallPct = Math.round((position.overallIndex / position.overallTotal) * 100);

  return (
    <section
      aria-label="अध्याय संदर्भ"
      className="mb-6 rounded-2xl border border-verse-border bg-gradient-to-br from-[var(--verse-bg)] to-[var(--accent-bg)] p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            अध्याय {toDevanagariNum(position.chapterNumber)} / १८
          </p>
          <h2 className="font-serif-deva text-lg font-bold text-primary leading-tight">
            {position.chapterTitleHindi}
          </h2>
          <p className="text-xs text-muted italic">{position.chapterTitleEnglish}</p>
        </div>
        {position.markerReference && (
          <span className="font-serif-deva rounded-full border border-accent/30 bg-card px-3 py-1 text-xs text-primary">
            ।।{position.markerReference}।।
          </span>
        )}
      </div>

      <div className="space-y-2">
        <ProgressRow
          label={`श्लोक ${toDevanagariNum(position.verseInChapter)} / ${toDevanagariNum(position.totalInChapter)} (इस अध्याय में)`}
          pct={chapterPct}
          tone="accent"
        />
        <ProgressRow
          label={`गीता-यात्रा: ${toDevanagariNum(position.overallIndex)} / ${toDevanagariNum(position.overallTotal)}`}
          pct={overallPct}
          tone="primary"
        />
      </div>

      <ChapterDots current={position.chapterNumber} />
    </section>
  );
}

function ProgressRow({ label, pct, tone }: { label: string; pct: number; tone: 'accent' | 'primary' }) {
  const fill = tone === 'accent' ? 'bg-accent' : 'bg-[var(--primary)]';
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-muted mb-1">
        <span>{label}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div className={`h-full ${fill} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/**
 * 18 tiny dots, colored by traditional षट्क (6-chapter) grouping:
 * कर्मषट्क (1-6, त्वम्), भक्तिषट्क (7-12, तत्), ज्ञानषट्क (13-18, असि).
 * The current chapter is enlarged.
 */
function ChapterDots({ current }: { current: number }) {
  const tone = (n: number) =>
    n <= 6 ? 'bg-emerald-500/70' : n <= 12 ? 'bg-amber-500/80' : 'bg-sky-500/70';
  return (
    <div className="mt-4 flex items-center justify-between gap-1">
      {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => {
        const isCurrent = n === current;
        return (
          <span
            key={n}
            title={`अध्याय ${toDevanagariNum(n)}`}
            aria-hidden="true"
            className={`inline-block rounded-full transition-all ${tone(n)} ${
              isCurrent ? 'h-3 w-3 ring-2 ring-accent ring-offset-1 ring-offset-[var(--verse-bg)]' : 'h-1.5 w-1.5 opacity-70'
            }`}
          />
        );
      })}
    </div>
  );
}

function toDevanagariNum(n: number): string {
  const map = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(n)
    .split('')
    .map((d) => map[Number(d)] ?? d)
    .join('');
}
