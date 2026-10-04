import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const commDir = resolve('public/data/hi-commentary');
const files = readdirSync(commDir).filter((f) => f.endsWith('.json'));

let totalCommentaries = 0;
const report = [];

for (const file of files) {
  const scriptureId = file.replace('.json', '');
  const data = JSON.parse(readFileSync(resolve(commDir, file), 'utf-8'));
  const count = Array.isArray(data) ? data.length : Object.keys(data).length;
  totalCommentaries += count;
  report.push({ scriptureId, count });
}

console.log(`Found ${files.length} commentary files with ${totalCommentaries} total detailed commentary entries:`);
for (const r of report.sort((a,b) => b.count - a.count).slice(0, 15)) {
  console.log(`- ${r.scriptureId}: ${r.count} detailed commentaries`);
}
