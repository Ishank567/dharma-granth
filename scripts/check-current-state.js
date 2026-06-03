const fs = require('fs');
const path = require('path');

const fullDir = 'c:\\Users\\ishan\\Music\\dharma\\dharma-granth\\public\\data\\scriptures-full';

const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.json'));

let totalVerses = 0;
let totalChapters = 0;
let sparse = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(fullDir, file), 'utf8'));
  const verses = data.chapters?.reduce((sum, c) => sum + (c.verses?.length || 0), 0) || 0;
  const chapters = data.chapters?.length || 0;
  totalVerses += verses;
  totalChapters += chapters;
  
  if (verses < 100) {
    sparse.push({ id: file.replace('.json', ''), verses, chapters });
  }
}

console.log(`Total JSON files: ${files.length}`);
console.log(`Total verses: ${totalVerses}`);
console.log(`Total chapters: ${totalChapters}`);
console.log(`\nSparse files (< 100 verses):`);
for (const s of sparse.sort((a, b) => a.verses - b.verses)) {
  console.log(`  ${s.id}: ${s.verses} verses, ${s.chapters} chapters`);
}
