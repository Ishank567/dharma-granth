/**
 * Audits the scripture registry against the seeded text. Reports (does not
 * change) duplicate ids and titles, alias collisions, aliases that point
 * nowhere, and chapter or verse counts that differ from the seeded files.
 * Exit code 1 on structural problems; count mismatches are listed as warnings.
 * Run: npm run check:registry
 */
import fs from 'node:fs';
import path from 'node:path';
import { getScriptureRegistry, SCRIPTURE_ALIASES } from '../lib/scripture-registry';

const FULL = path.join(process.cwd(), 'public', 'data', 'scriptures-full');
const reg = getScriptureRegistry();
const errors: string[] = [];
const warnings: string[] = [];

const seenIds = new Set<string>();
const seenTitles = new Map<string, string>();
for (const r of reg) {
  if (seenIds.has(r.scriptureId)) errors.push(`duplicate id: ${r.scriptureId}`);
  seenIds.add(r.scriptureId);
  const t = r.englishName.trim().toLowerCase();
  if (seenTitles.has(t)) warnings.push(`same title for ${seenTitles.get(t)} and ${r.scriptureId}: "${r.englishName}"`);
  seenTitles.set(t, r.scriptureId);
}
for (const [alias, id] of Object.entries(SCRIPTURE_ALIASES)) {
  if (seenIds.has(alias)) errors.push(`alias "${alias}" is also a canonical id`);
  if (!seenIds.has(id)) errors.push(`alias "${alias}" points at unknown id "${id}"`);
}

let compared = 0;
const partial: string[] = [];
for (const r of reg) {
  const dir = path.join(FULL, r.scriptureId);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) continue;
  let chapters = 0;
  let verses = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!/^ch-\d+\.json$/.test(f)) continue;
    chapters++;
    try {
      verses += JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).chapter?.verses?.length ?? 0;
    } catch {
      errors.push(`${r.scriptureId}/${f}: unreadable`);
    }
  }
  if (chapters === 0) continue;
  compared++;
  // The registry's library counts come from chapters.json; they must match the seeded files.
  if (chapters !== r.libraryChapterCount) warnings.push(`${r.scriptureId}: chapters.json lists ${r.libraryChapterCount} chapters, seeded files have ${chapters}`);
  if (verses !== r.libraryVerseCount) warnings.push(`${r.scriptureId}: chapters.json lists ${r.libraryVerseCount} verses, seeded files have ${verses}`);
  // Coverage against the traditional total is information, not an error.
  if (verses < r.canonicalVerseCount * 0.9) partial.push(`${r.scriptureId}: library ${verses} of ${r.canonicalVerseCount} traditional verses`);
  if (verses > r.canonicalVerseCount * 1.1) warnings.push(`${r.scriptureId}: library has ${verses} verses but the catalogue says ${r.canonicalVerseCount}; check numbering or the catalogue figure`);
}

console.log(`Registry: ${reg.length} scriptures, ${compared} compared with seeded text.`);
warnings.slice(0, 40).forEach((w) => console.log(`  warn  ${w}`));
if (warnings.length > 40) console.log(`  …and ${warnings.length - 40} more warnings`);
console.log(`Partial coverage (information): ${partial.length} texts hold under 90% of their traditional verse count.`);
partial.slice(0, 12).forEach((p) => console.log(`  partial ${p}`));
errors.forEach((e) => console.error(`  ERROR ${e}`));
console.log(errors.length ? `${errors.length} error(s).` : `No structural errors. ${warnings.length} warning(s).`);
process.exit(errors.length ? 1 : 0);
