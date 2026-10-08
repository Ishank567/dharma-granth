/**
 * Verifies chapter orientations: the chapter exists in the library, each
 * important verse exists in that chapter, the sequence has five steps, and
 * every prerequisite concept is a non-empty name.
 * Run: npm run check:orientation
 */
import fs from 'node:fs';
import path from 'node:path';
import { chapterOrientations } from '../data/chapter-orientation';

let bad = 0;
const fail = (m: string) => { bad++; console.error(`FAIL ${m}`); };
for (const o of chapterOrientations) {
  const file = path.join('public', 'data', 'scriptures-full', o.scriptureId, `ch-${o.chapter}.json`);
  let numbers = new Set<string>();
  try {
    numbers = new Set(JSON.parse(fs.readFileSync(file, 'utf8')).chapter.verses.map((v: { number: number | string }) => String(v.number)));
  } catch { fail(`${o.scriptureId} ${o.chapter}: chapter file missing`); continue; }
  for (const v of o.importantVerses) if (!numbers.has(String(v.verse))) fail(`${o.scriptureId} ${o.chapter}.${v.verse}: verse not in the library`);
  if (o.sequence.length !== 5) fail(`${o.scriptureId} ${o.chapter}: sequence must have five steps`);
  if (o.prerequisiteConcepts.some((c) => !c.trim())) fail(`${o.scriptureId} ${o.chapter}: empty prerequisite`);
  if (o.importantVerses.length === 0) fail(`${o.scriptureId} ${o.chapter}: no important verses`);
}
console.log(bad === 0 ? `All ${chapterOrientations.length} orientations check out.` : `${bad} problem(s).`);
process.exit(bad === 0 ? 0 : 1);
