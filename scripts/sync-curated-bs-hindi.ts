import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { FullScripture } from './lib/scripture-schema';
import { brahmasutra } from '../data/scriptures/brahmasutra';

const ROOT = resolve(__dirname, '..');
const PUB_PATH = resolve(ROOT, 'public/data/scriptures-full/brahmasutra.json');
const TS_PATH = resolve(ROOT, 'data/scriptures/brahmasutra.ts');

const full = JSON.parse(readFileSync(PUB_PATH, 'utf8')) as FullScripture;
const fullMap = new Map<string, string>();
for (const ch of full.chapters) {
  for (const v of ch.verses) {
    if (v.hindi) {
      fullMap.set(`${ch.number}:${v.number}`, v.hindi);
      // Also map simple verse number
      const parts = String(v.number).split('.');
      const last = parts[parts.length - 1];
      fullMap.set(`${ch.number}:${last}`, v.hindi);
    }
  }
}

let updated = 0;
for (const ch of brahmasutra.chapters) {
  for (const v of ch.verses) {
    if (!v.hindi || !v.hindi.trim()) {
      const h = fullMap.get(`${ch.id}:${v.id}`);
      if (h) {
        v.hindi = h;
        updated++;
      }
    }
  }
}

const code = `import { Scripture } from '../types';

export const brahmasutra: Scripture = ${JSON.stringify(brahmasutra, null, 2)};
`;

writeFileSync(TS_PATH, code, 'utf8');
console.log(`✓ Synchronized ${updated} missing Hindi translations to data/scriptures/brahmasutra.ts`);
