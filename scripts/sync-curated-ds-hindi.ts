import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { FullScripture } from './lib/scripture-schema';

const ROOT = resolve(__dirname, '..');
const PUB_PATH = resolve(ROOT, 'public/data/scriptures-full/durgasaptashati.json');
const TS_PATH = resolve(ROOT, 'data/scriptures/durgasaptashati.ts');

const full = JSON.parse(readFileSync(PUB_PATH, 'utf8')) as FullScripture;
const fullMap = new Map<string, string>();
for (const ch of full.chapters) {
  for (const v of ch.verses) {
    const vNum = parseInt(String(v.number).split('.').pop() || '', 10);
    if (v.hindi) fullMap.set(`${ch.number}:${vNum}`, v.hindi);
  }
}

let tsContent = readFileSync(TS_PATH, 'utf8');

// Match each verse block in the TS file:
// {
//   id: 1001,
//   sanskrit: '...',
//   ...
// }
// We can parse or replace per verse
import { durgasaptashati } from '../data/scriptures/durgasaptashati';

for (const ch of durgasaptashati.chapters) {
  for (const v of ch.verses) {
    if (v.hindi && v.hindi.trim()) continue;
    const vNum = v.id > 1000 ? v.id - (ch.id * 1000) : v.id;
    const h = fullMap.get(`${ch.id}:${vNum}`);
    if (h) {
      v.hindi = h;
    }
  }
}

// Write back cleanly formatted TS file
const code = `import { Scripture } from '../types';

export const durgasaptashati: Scripture = ${JSON.stringify(durgasaptashati, null, 2)};
`;

writeFileSync(TS_PATH, code, 'utf8');
console.log('✓ Successfully synchronized Durga Saptashati Hindi to data/scriptures/durgasaptashati.ts');
