import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const fullDir = resolve('public/data/scriptures-full');
const files = readdirSync(fullDir).filter((f) => f.endsWith('.json') && !f.includes('/'));

console.log(`Found ${files.length} full-scripture JSON files.`);

let totalVerses = 0;
let totalSanskrit = 0;
let totalHindi = 0;
let totalEnglish = 0;

const summary = [];

for (const file of files.sort()) {
  const scriptureId = file.replace('.json', '');
  const data = JSON.parse(readFileSync(resolve(fullDir, file), 'utf-8'));
  
  let count = 0;
  let saCount = 0;
  let hiCount = 0;
  let enCount = 0;

  if (Array.isArray(data.chapters)) {
    for (const ch of data.chapters) {
      if (Array.isArray(ch.verses)) {
        for (const v of ch.verses) {
          count++;
          if (v.sanskrit && v.sanskrit.trim()) saCount++;
          if (v.hindi && v.hindi.trim()) hiCount++;
          if (v.translation && v.translation.trim()) enCount++;
        }
      }
    }
  }

  totalVerses += count;
  totalSanskrit += saCount;
  totalHindi += hiCount;
  totalEnglish += enCount;

  summary.push({
    id: scriptureId,
    title: data.title || scriptureId,
    verses: count,
    sanskrit: saCount,
    hindi: hiCount,
    english: enCount,
    hindiPct: count > 0 ? Math.round((hiCount / count) * 100) : 0,
    englishPct: count > 0 ? Math.round((enCount / count) * 100) : 0,
  });
}

console.log('--- AUDIT COMPLETE ---');
console.log(`Total Scriptures: ${files.length}`);
console.log(`Total Verses: ${totalVerses}`);
console.log(`Total Sanskrit: ${totalSanskrit} (${Math.round((totalSanskrit/totalVerses)*100)}%)`);
console.log(`Total Hindi: ${totalHindi} (${Math.round((totalHindi/totalVerses)*100)}%)`);
console.log(`Total English: ${totalEnglish} (${Math.round((totalEnglish/totalVerses)*100)}%)`);

// Check which scriptures have low Hindi or English coverage
const lowHindi = summary.filter((s) => s.hindiPct < 50);
console.log(`\nScriptures with < 50% Hindi: ${lowHindi.length}`);
for (const s of lowHindi) {
  console.log(`- ${s.id} (${s.title}): ${s.hindi}/${s.verses} (${s.hindiPct}%)`);
}

const completeHindi = summary.filter((s) => s.hindiPct >= 95);
console.log(`\nScriptures with >= 95% Hindi: ${completeHindi.length}`);

// Print category groups
console.log(JSON.stringify({ totalVerses, totalSanskrit, totalHindi, totalEnglish, lowHindiCount: lowHindi.length, completeHindiCount: completeHindi.length }, null, 2));
