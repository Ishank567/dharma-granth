const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\ishan\\Music\\dharma\\dharma-granth\\data\\scriptures';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && !f.includes('index'));

let results = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  const totalMatch = content.match(/totalVerses:\s*(\d+)/);
  const totalVerses = totalMatch ? parseInt(totalMatch[1]) : 0;
  
  const verseMatches = content.match(/\{[\s\S]*?sanskrit:/g);
  const actualVerses = verseMatches ? verseMatches.length : 0;
  
  const emptyArrayMatches = content.match(/verses:\s*\[\s*\]/g);
  const emptyChapters = emptyArrayMatches ? emptyArrayMatches.length : 0;
  
  const chapterMatches = content.match(/verses:/g);
  const totalChapters = chapterMatches ? chapterMatches.length : 0;
  
  results.push({
    file,
    totalVerses,
    actualVerses,
    emptyChapters,
    totalChapters,
    ratio: totalVerses > 0 ? (actualVerses / totalVerses * 100).toFixed(1) : '0'
  });
}

results.sort((a, b) => parseFloat(a.ratio) - parseFloat(b.ratio));

console.log('FILE                         | TOTAL  | ACTUAL | EMPTY  | CHAPS  | %');
console.log('-----------------------------|--------|--------|--------|--------|------');
for (const r of results) {
  const line = [
    r.file.padEnd(28),
    String(r.totalVerses).padStart(6),
    String(r.actualVerses).padStart(6),
    String(r.emptyChapters).padStart(6),
    String(r.totalChapters).padStart(6),
    r.ratio.padStart(5) + '%'
  ].join(' | ');
  console.log(line);
}

console.log('\n--- SUMMARY ---');
const totalAll = results.reduce((s, r) => s + r.totalVerses, 0);
const actualAll = results.reduce((s, r) => s + r.actualVerses, 0);
console.log('Total verses expected:', totalAll);
console.log('Total verses actual:', actualAll);
console.log('Overall fill rate:', (actualAll / totalAll * 100).toFixed(2) + '%');
