/**
 * Verifies every visual verse demonstration: its source verses exist in the
 * library and contain the expected Sanskrit fragment, it has a title, summary
 * and text alternative, every item appears in the text alternative (so the
 * words always carry the whole diagram), and ids are unique.
 * Run: npm run check:diagrams
 */
import fs from 'node:fs';
import path from 'node:path';
import { VERSE_DIAGRAMS } from '../data/verse-diagrams';

const strip = (s: string) => s.replace(/[\s|।॥0-9०-९.‌‍]+/g, '');
const norm = (s: string) => s.toLowerCase().replace(/[’']/g, '');
let bad = 0;
const fail = (m: string) => { bad++; console.error(`FAIL ${m}`); };
const ids = new Set<string>();

for (const d of VERSE_DIAGRAMS) {
  if (ids.has(d.id)) fail(`${d.id}: duplicate id`);
  ids.add(d.id);
  if (!d.title.trim() || !d.summary.trim() || !d.textAlternative.trim()) fail(`${d.id}: missing title, summary or text alternative`);
  if (d.groups.length === 0 || d.groups.some((g) => g.items.length === 0)) fail(`${d.id}: empty group`);
  if (d.sourceVerses.length === 0) fail(`${d.id}: no source verse`);
  const alt = norm(d.textAlternative);
  for (const g of d.groups) for (const item of g.items) {
    // Items are short labels; each one's key words must appear in the text alternative.
    const words = norm(item).split(/\s+/).filter((w) => w.length > 3);
    if (words.length && !words.every((w) => alt.includes(w.slice(0, Math.max(4, w.length - 2))))) fail(`${d.id}: "${item}" is not covered by the text alternative`);
  }
  for (const s of d.sourceVerses) {
    const file = path.join('public', 'data', 'scriptures-full', d.scriptureId, `ch-${s.chapter}.json`);
    let text = '';
    try {
      const j = JSON.parse(fs.readFileSync(file, 'utf8'));
      text = j.chapter.verses.find((v: { number: number | string }) => String(v.number) === String(s.verse))?.sanskrit ?? '';
    } catch { /* reported below */ }
    if (!strip(text).includes(strip(s.expect))) fail(`${d.id}: ${d.scriptureId} ${s.chapter}.${s.verse} does not contain "${s.expect}"`);
  }
  for (const v of d.appearsOn) if (!d.sourceVerses.some((s) => s.chapter === d.chapter && s.verse === v)) fail(`${d.id}: shown on verse ${v} but not a source verse`);
}
console.log(bad === 0 ? `All ${VERSE_DIAGRAMS.length} diagrams check out.` : `${bad} problem(s).`);
process.exit(bad === 0 ? 0 : 1);
