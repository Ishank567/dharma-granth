// Re-sort verses into numeric order where the source stored them in text
// order (73.1, 73.10, 73.11, 73.2 …). Only touches chapters whose verse
// numbers all share one dotted shape ("a.b", or "a.b.c"): mixed schemes
// (curated selections like "1.2 3 4 1.6") may be in a deliberate order and
// are reported, not changed. Preserves the JSON file's exact formatting.
//
//   node scripts/fix-verse-order.mjs          # dry run
//   node scripts/fix-verse-order.mjs --write
import fs from 'node:fs';

const BASE = 'public/data/scriptures-full';
const WRITE = process.argv.includes('--write');

// Chapters that mix a few odd numbers ('3', '23.6.23.10') into dotted text-order
// numbering; inspected by hand, they are plain text-sorted and safe to fix. The
// cross-section check below still applies.
const FORCE_MIXED = new Set(['atharvaveda.json:20', 'shivpurana.json:9', 'shivpurana.json:10']);

const parts = (n) => String(n).split('.');
const shape = (n) => {
  const p = parts(n);
  // "1.1-2" (a joined pair) counts as the shape of "1.1".
  return p.every((x, i) => (i === p.length - 1 ? /^\d+(-\d+)?$/ : /^\d+$/).test(x)) ? p.length : -1;
};
const key = (n) => parts(n).map((x) => Number.parseInt(x, 10));
function cmp(a, b) {
  const x = key(a.number);
  const y = key(b.number);
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i];
  // Same leading numbers: a joined pair ("1.1-2") after the single ("1.1").
  return String(a.number).length - String(b.number).length;
}

let changed = 0;
const skipped = [];
for (const file of fs.readdirSync(BASE).filter((f) => f.endsWith('.json'))) {
  const path = `${BASE}/${file}`;
  const raw = fs.readFileSync(path, 'utf8');
  const crlf = raw.includes('\r\n');
  const eol = crlf ? '\r\n' : '\n';
  const trailing = raw.endsWith(eol) ? eol : '';
  const serialize = (obj) => {
    const s = JSON.stringify(obj, null, 2);
    return (crlf ? s.replace(/\n/g, '\r\n') : s) + trailing;
  };
  const book = JSON.parse(raw);
  if (serialize(book) !== raw) {
    skipped.push(`${file}: formatting would change on rewrite — skipped`);
    continue;
  }
  let touched = false;
  for (const chapter of book.chapters ?? []) {
    const verses = chapter.verses ?? [];
    const sorted = [...verses].sort(cmp);
    const moved = verses.filter((v, i) => v !== sorted[i]).length;
    if (moved === 0) continue;
    const shapes = new Set(verses.map((v) => shape(v.number)));
    if ((shapes.size !== 1 || shapes.has(-1)) && !FORCE_MIXED.has(`${file}:${chapter.number}`)) {
      skipped.push(`${file} ch${chapter.number}: mixed numbering (${[...shapes].join('/')}), ${moved} out of order — left as is`);
      continue;
    }
    // The text-sort signature: every backward step stays inside one section
    // (73.11 → 73.2). A step back across sections (2.10 → 1.14) means a
    // hand-ordered selection, so leave it.
    const crossSection = verses.some(
      (v, i) => i > 0 && cmp(v, verses[i - 1]) < 0 && key(v.number)[0] !== key(verses[i - 1].number)[0],
    );
    if (crossSection) {
      skipped.push(`${file} ch${chapter.number}: steps back across sections, ${moved} out of order — left as is`);
      continue;
    }
    console.log(`${file} ch${chapter.number}: ${moved}/${verses.length} verses re-ordered`);
    chapter.verses = sorted;
    touched = true;
    changed++;
  }
  if (touched && WRITE) fs.writeFileSync(path, serialize(book));
}
console.log(`\n${changed} chapter(s) ${WRITE ? 're-ordered' : 'would be re-ordered (dry run; pass --write)'}.`);
if (skipped.length) console.log(`Skipped:\n  ${skipped.join('\n  ')}`);
