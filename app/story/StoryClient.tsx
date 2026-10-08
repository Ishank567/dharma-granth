'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { characters, type Character } from '@/data/characters';
import { timelines } from '@/data/timelines';

type Narrative = 'mahabharata' | 'ramayana';
type View = 'characters' | 'relations' | 'events' | 'dialogue' | 'decisions' | 'teaching';

/** What kind of visual or text each block is. Never shown as historical fact. */
type Kind = 'scriptural' | 'traditional' | 'editorial' | 'illustration';
const KIND: Record<Kind, { label: string; cls: string }> = {
  scriptural: { label: 'Scriptural description', cls: 'border-amber-700/40 bg-amber-100 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100' },
  traditional: { label: 'Traditional representation', cls: 'border-stone-500/40 bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-100' },
  editorial: { label: 'Editorial reconstruction', cls: 'border-sky-600/40 bg-sky-100 text-sky-950 dark:bg-sky-900/40 dark:text-sky-100' },
  illustration: { label: 'Generated illustration', cls: 'border-violet-500/40 bg-violet-100 text-violet-950 dark:bg-violet-900/40 dark:text-violet-100' },
};

const VIEWS: Array<{ id: View; label: string }> = [
  { id: 'characters', label: 'Characters' },
  { id: 'relations', label: 'Relationships' },
  { id: 'events', label: 'Events' },
  { id: 'dialogue', label: 'Dialogue' },
  { id: 'decisions', label: 'Decision points' },
  { id: 'teaching', label: 'Teachings and sources' },
];

function Chip({ kind }: { kind: Kind }) {
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-sm font-semibold ${KIND[kind].cls}`}>{KIND[kind].label}</span>;
}

function Block({ kind, title, children }: { kind: Kind; title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2"><h2 className="font-serif text-lg font-bold text-dharma-text">{title}</h2><Chip kind={kind} /></div>
      {children}
    </section>
  );
}

/** Relationship diagram: the chosen character in the middle, relations around. The list beside it is the full text alternative. */
function RelationMap({ c }: { c: Character }) {
  const rel = c.relations.slice(0, 12);
  const r = 150;
  return (
    <svg viewBox="-220 -190 440 380" role="img" aria-label={`Relationship diagram for ${c.name}. The same relationships are listed in text below.`} className="mx-auto hidden h-auto w-full max-w-md md:block">
      {rel.map((x, i) => {
        const a = (i / rel.length) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * (r * 0.85);
        return (
          <g key={i}>
            <line x1={0} y1={0} x2={px} y2={py} stroke="currentColor" strokeOpacity={0.3} />
            <text x={px} y={py} textAnchor="middle" fontSize="11" fill="currentColor" className="text-dharma-text">{x.name}</text>
            <text x={px} y={py + 12} textAnchor="middle" fontSize="9" fill="currentColor" className="text-dharma-muted">{x.relation.length > 26 ? `${x.relation.slice(0, 24)}…` : x.relation}</text>
          </g>
        );
      })}
      <circle r="32" fill="none" stroke="currentColor" strokeWidth="2" className="text-saffron-700" />
      <text textAnchor="middle" y="4" fontSize="13" fontWeight="700" fill="currentColor" className="text-dharma-text">{c.name}</text>
    </svg>
  );
}

export function StoryClient() {
  const [narrative, setNarrative] = useState<Narrative>('mahabharata');
  const [view, setView] = useState<View>('characters');
  const cast = useMemo(() => characters.filter((c) => c.category === narrative), [narrative]);
  const [selectedId, setSelectedId] = useState<string>('');
  const selected = cast.find((c) => c.id === selectedId) ?? cast[0];
  const timeline = timelines.find((t) => t.id === `${narrative}-narrative`);

  const tab = (on: boolean) => `focus-ring min-h-[44px] shrink-0 rounded-xl border px-4 text-sm font-semibold ${on ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text'}`;

  return (
    <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-dharma-text">Visual Story Mode</h1>
      <p lang="hi" className="font-devanagari text-lg text-dharma-muted">कथा-दर्शन</p>
      <p className="mt-2 text-sm text-dharma-muted">
        Every block says what it is. Events follow the order of the telling, not calendar dates, and nothing here is offered as history. Emoji icons are decoration only.
      </p>

      <div className="mt-4 flex gap-2" role="group" aria-label="Choose a narrative">
        {(['mahabharata', 'ramayana'] as const).map((n) => (
          <button key={n} type="button" aria-pressed={narrative === n} onClick={() => { setNarrative(n); setSelectedId(''); }} className={tab(narrative === n)}>
            {n === 'mahabharata' ? 'Mahābhārata' : 'Rāmāyaṇa'}
          </button>
        ))}
      </div>

      <div role="tablist" aria-label="Story views" className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {VIEWS.map((v) => (
          <button key={v.id} type="button" role="tab" aria-selected={view === v.id} onClick={() => setView(v.id)} className={tab(view === v.id)}>{v.label}</button>
        ))}
      </div>

      {view !== 'events' && selected && (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose a character">
          {cast.map((c) => (
            <button key={c.id} type="button" aria-pressed={selected.id === c.id} onClick={() => setSelectedId(c.id)} className={tab(selected.id === c.id)}>
              <span aria-hidden="true">{c.icon} </span>{c.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-4" role="tabpanel">
        {view === 'characters' && selected && (
          <Block kind="traditional" title={`${selected.name} · ${selected.sanskrit}`}>
            <p className="text-sm text-dharma-text">{selected.shortDesc}</p>
            <p className="mt-2 text-sm text-dharma-muted">{selected.biography}</p>
            <Link href={`/characters/${selected.id}`} className="mt-2 inline-block text-sm font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">Full character page</Link>
          </Block>
        )}

        {view === 'relations' && selected && (
          <Block kind="editorial" title={`Relationships of ${selected.name}`}>
            <RelationMap c={selected} />
            <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
              {selected.relations.map((r, i) => <li key={i}><span className="font-semibold text-dharma-text">{r.name}</span> <span className="text-dharma-muted">· {r.relation}</span></li>)}
            </ul>
            <p className="mt-2 text-sm text-dharma-muted">The diagram is an editorial arrangement of the relationships listed in tradition, not a family tree from a text.</p>
          </Block>
        )}

        {view === 'events' && (
          <Block kind="traditional" title={timeline?.title ?? 'Events'}>
            {timeline ? (
              <ol className="space-y-3 border-l-2 border-dharma-border pl-4">
                {timeline.events.map((e) => (
                  <li key={e.id}>
                    <p className="font-semibold text-dharma-text">{e.title}</p>
                    <p lang="hi" className="font-devanagari text-sm text-dharma-muted">{e.description}</p>
                    <p lang="hi" className="font-devanagari text-sm text-dharma-muted">{e.significance}</p>
                  </li>
                ))}
              </ol>
            ) : <p className="text-sm text-dharma-muted">No event sequence is available for this narrative.</p>}
          </Block>
        )}

        {view === 'dialogue' && selected && (
          <Block kind="editorial" title={`Dialogue: ${selected.name}`}>
            {selected.dialogues.length === 0 ? <p className="text-sm text-dharma-muted">No dialogue has been recorded for this character.</p> : (
              <ol className="space-y-3 text-sm">
                {selected.dialogues.map((d, i) => (
                  <li key={i} className="rounded-xl border border-dharma-border p-3">
                    <p className="font-semibold text-dharma-text">{d.speaker} <span className="font-normal text-dharma-muted">· {d.context}</span></p>
                    <p className="mt-1">{d.text}</p>
                    <p className="mt-1 text-sm text-dharma-muted">Paraphrase for study, not a quotation. Reference: {d.reference}</p>
                  </li>
                ))}
              </ol>
            )}
          </Block>
        )}

        {view === 'decisions' && selected && (
          <Block kind="traditional" title={`Decision points: ${selected.name}`}>
            {selected.dilemmas.length === 0 ? <p className="text-sm text-dharma-muted">No decision points have been recorded for this character.</p> : (
              <ul className="space-y-3 text-sm">
                {selected.dilemmas.map((d, i) => (
                  <li key={i} className="rounded-xl border border-dharma-border p-3">
                    <p className="font-semibold text-dharma-text">{d.title}</p>
                    <p className="text-dharma-muted">{d.description}</p>
                    <p className="mt-1"><span className="font-semibold">How the telling resolves it:</span> {d.resolution}</p>
                  </li>
                ))}
              </ul>
            )}
          </Block>
        )}

        {view === 'teaching' && selected && (
          <>
            <Block kind="scriptural" title={`Related verses: ${selected.name}`}>
              {selected.verses.length === 0 ? <p className="text-sm text-dharma-muted">No verses are linked to this character yet.</p> : (
                <ul className="space-y-3 text-sm">
                  {selected.verses.map((v, i) => (
                    <li key={i} className="rounded-xl border-2 border-amber-700/30 bg-amber-50/60 p-3 dark:bg-amber-950/20">
                      <p lang="sa" className="font-devanagari text-lg">{v.sanskrit}</p>
                      {v.transliteration && <p className="italic text-dharma-muted">{v.transliteration}</p>}
                      <p className="mt-1">{v.translation}</p>
                      <p className="mt-1 text-sm text-dharma-muted">Source: {v.reference}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Block>
            <Block kind="traditional" title="Ways traditions read this character">
              <ul className="space-y-2 text-sm">
                {selected.interpretations.map((x, i) => <li key={i}><span className="font-semibold text-dharma-text">{x.tradition}:</span> <span className="text-dharma-muted">{x.view}</span></li>)}
              </ul>
              <p className="mt-2 text-sm text-dharma-muted">These are readings within traditions; none is presented as the correct one.</p>
            </Block>
          </>
        )}
      </div>

      <section aria-labelledby="legend-h" className="mt-8 rounded-xl border border-dharma-border bg-dharma-card/60 p-4 text-sm">
        <h2 id="legend-h" className="font-semibold text-dharma-text">How to read the labels</h2>
        <ul className="mt-2 space-y-1 text-dharma-muted">
          {(Object.keys(KIND) as Kind[]).map((k) => <li key={k}><Chip kind={k} /> {k === 'scriptural' ? 'A verse or description taken from a text, with its reference.' : k === 'traditional' ? 'How tradition tells or depicts it.' : k === 'editorial' ? 'Arranged or paraphrased by the editors for study; not a historical record.' : 'An image made by AI. None is used on this page yet.'}</li>)}
        </ul>
        <p className="mt-2 text-dharma-muted">Maps of places are on the <Link href="/locations" className="underline underline-offset-2">Locations page</Link>.</p>
      </section>
    </main>
  );
}
