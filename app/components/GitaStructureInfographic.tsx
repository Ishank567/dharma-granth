import type { BookSnapshot } from '@/app/lib/content';
import Link from 'next/link';

type Shatka = {
  key: 'karma' | 'bhakti' | 'jnana';
  labelHindi: string;
  labelEnglish: string;
  tatTvamAsi: string;
  summary: string;
  range: [number, number];
  tone: {
    bg: string;
    border: string;
    accent: string;
    dot: string;
  };
};

const SHATKAS: Shatka[] = [
  {
    key: 'karma',
    labelHindi: 'कर्मषट्क',
    labelEnglish: 'Karma Ṣaṭka',
    tatTvamAsi: 'त्वम् — जीव',
    summary: 'साधक कौन है — निष्काम कर्म द्वारा आत्मशुद्धि।',
    range: [1, 6],
    tone: {
      bg: 'from-emerald-50/80 to-emerald-100/40 dark:from-emerald-950/30 dark:to-emerald-900/10',
      border: 'border-emerald-500/40',
      accent: 'text-emerald-800 dark:text-emerald-200',
      dot: 'bg-emerald-500',
    },
  },
  {
    key: 'bhakti',
    labelHindi: 'भक्तिषट्क',
    labelEnglish: 'Bhakti Ṣaṭka',
    tatTvamAsi: 'तत् — ईश्वर',
    summary: 'साध्य कौन है — भगवान का स्वरूप, विभूति एवं विश्वरूप।',
    range: [7, 12],
    tone: {
      bg: 'from-amber-50/80 to-amber-100/40 dark:from-amber-950/30 dark:to-amber-900/10',
      border: 'border-amber-500/40',
      accent: 'text-amber-900 dark:text-amber-200',
      dot: 'bg-amber-500',
    },
  },
  {
    key: 'jnana',
    labelHindi: 'ज्ञानषट्क',
    labelEnglish: 'Jñāna Ṣaṭka',
    tatTvamAsi: 'असि — एकत्व',
    summary: 'जीव-ईश्वर का संबंध — प्रकृति, पुरुष और मोक्ष।',
    range: [13, 18],
    tone: {
      bg: 'from-sky-50/80 to-sky-100/40 dark:from-sky-950/30 dark:to-sky-900/10',
      border: 'border-sky-500/40',
      accent: 'text-sky-900 dark:text-sky-200',
      dot: 'bg-sky-500',
    },
  },
];

export default function GitaStructureInfographic({
  book,
  categorySlug,
}: {
  book: BookSnapshot;
  categorySlug: string;
}) {
  const chaptersByNumber = new Map(book.chapters.map((c) => [c.chapter_number, c]));
  const firstInterpretedVerseByChapterId = new Map<number, number>();
  for (const v of book.verses) {
    if (v.chapter_id == null) continue;
    if (firstInterpretedVerseByChapterId.has(v.chapter_id)) continue;
    if (book.interpretations[v.id]) {
      firstInterpretedVerseByChapterId.set(v.chapter_id, v.id);
    }
  }

  return (
    <section
      aria-label="गीता की संरचना"
      className="mb-10 rounded-3xl border border-accent/20 bg-gradient-to-br from-[var(--verse-bg)] via-[var(--card)] to-[var(--accent-bg)] p-6 md:p-8"
    >
      <header className="mb-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">इन्फोग्राफिक</p>
        <h2 className="font-serif-deva text-2xl md:text-3xl font-bold text-primary mt-1">
          गीता की त्रिविध संरचना
        </h2>
        <p className="mt-2 text-sm text-muted max-w-2xl mx-auto leading-relaxed">
          १८ अध्याय · ७०० श्लोक — पारम्परिक रूप से तीन <strong className="font-serif-deva text-primary">षट्क</strong> में विभक्त।
          प्रत्येक षट्क महावाक्य <em className="font-serif-deva">&ldquo;तत् त्वम् असि&rdquo;</em> के एक पद को प्रकट करता है।
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {SHATKAS.map((sh) => (
          <article
            key={sh.key}
            className={`rounded-2xl border bg-gradient-to-br ${sh.tone.bg} ${sh.tone.border} p-5 flex flex-col`}
          >
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${sh.tone.dot}`} aria-hidden="true" />
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                  अध्याय {toDev(sh.range[0])}–{toDev(sh.range[1])}
                </p>
              </div>
              <h3 className={`font-serif-deva text-xl font-bold mt-1 ${sh.tone.accent}`}>
                {sh.labelHindi}
              </h3>
              <p className="text-xs text-muted italic">{sh.labelEnglish}</p>
              <p className={`mt-2 text-xs font-semibold ${sh.tone.accent} font-serif-deva`}>
                {sh.tatTvamAsi}
              </p>
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{sh.summary}</p>
            </div>

            <ul className="mt-auto space-y-1.5 border-t border-[var(--border)]/60 pt-3">
              {range(sh.range[0], sh.range[1]).map((n) => {
                const ch = chaptersByNumber.get(n);
                if (!ch) return null;
                const firstVerseId = firstInterpretedVerseByChapterId.get(ch.id);
                const label = (
                  <span className="flex items-baseline gap-2">
                    <span className="font-serif-deva text-xs text-muted tabular-nums w-5 text-right">{toDev(n)}.</span>
                    <span className="font-serif-deva text-sm text-foreground/90 truncate">{ch.title_hindi}</span>
                  </span>
                );
                return (
                  <li key={ch.id}>
                    {firstVerseId ? (
                      <Link
                        href={`/categories/${categorySlug}/${book.slug}/${firstVerseId}`}
                        className="block rounded-md px-1.5 py-0.5 hover:bg-[var(--card-hover)] transition-colors"
                      >
                        {label}
                      </Link>
                    ) : (
                      <div className="px-1.5 py-0.5 opacity-70">{label}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      <footer className="mt-5 text-center text-[11px] text-muted">
        <span className="font-serif-deva">
          अध्याय २ का सारांश · अध्याय ११ का विश्वरूप · अध्याय १५ पुरुषोत्तमयोग — गीता के तीन शिखर।
        </span>
      </footer>
    </section>
  );
}

function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

function toDev(n: number): string {
  const map = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(n)
    .split('')
    .map((d) => map[Number(d)] ?? d)
    .join('');
}
