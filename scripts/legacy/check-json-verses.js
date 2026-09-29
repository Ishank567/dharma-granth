const fs = require('fs');
const path = require('path');

const scripturesDir = path.join(__dirname, 'public', 'data', 'scriptures-full');
const files = fs.readdirSync(scripturesDir).filter(f => f.endsWith('.json'));

console.log('Full Scripture JSON Completeness Report:\n');
console.log('=====================================\n');

let totalVerses = 0;
let totalChapters = 0;
let emptyFiles = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(scripturesDir, file), 'utf8');
  const data = JSON.parse(content);
  
  const verseCount = data.chapters ? data.chapters.reduce((sum, ch) => sum + (ch.verses ? ch.verses.length : 0), 0) : 0;
  const chapterCount = data.chapters ? data.chapters.length : 0;
  
  totalVerses += verseCount;
  totalChapters += chapterCount;
  
  if (verseCount === 0) {
    emptyFiles.push(file.replace('.json', ''));
  }
  
  console.log(`${file.replace('.json', '')}: ${verseCount} verses · ${chapterCount} chapters`);
});

console.log('\n=====================================');
console.log(`\nTotal: ${totalVerses} verses · ${totalChapters} chapters`);
console.log(`Empty files (no verses): ${emptyFiles.length}`);

if (emptyFiles.length > 0) {
  console.log('\nEmpty Files (no data available):');
  console.log('----------------------------------');
  emptyFiles.forEach(f => {
    console.log(`- ${f}`);
  });
}
