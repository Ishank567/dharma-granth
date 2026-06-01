const fs = require('fs');
const path = require('path');

const scripturesDir = path.join(__dirname, 'data', 'scriptures');
const files = fs.readdirSync(scripturesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

console.log('Scripture Completeness Report:\n');
console.log('=====================================\n');

let totalDeclared = 0;
let totalActual = 0;
let incompleteScriptures = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(scripturesDir, file), 'utf8');
  const totalVersesMatch = content.match(/totalVerses:\s*(\d+)/);
  
  if (totalVersesMatch) {
    const declaredTotal = parseInt(totalVersesMatch[1]);
    
    // Count actual verses in the file (only verse IDs, not chapter IDs)
    // Count id: patterns that are followed by sanskrit: (indicating they're verse objects)
    const verseObjectPattern = /{\s*id:\s*\d+[\s\S]*?sanskrit:/g;
    const verseMatches = content.match(verseObjectPattern);
    const actualVerses = verseMatches ? verseMatches.length : 0;
    
    // Count chapters
    const chapterMatches = content.match(/id:\s*\d+,?\s*\n\s*title:/g);
    const actualChapters = chapterMatches ? chapterMatches.length : 0;
    
    const completeness = ((actualVerses / declaredTotal) * 100).toFixed(1);
    
    totalDeclared += declaredTotal;
    totalActual += actualVerses;
    
    if (actualVerses < declaredTotal) {
      incompleteScriptures.push({
        name: file.replace('.ts', ''),
        actual: actualVerses,
        declared: declaredTotal,
        completeness: completeness,
        chapters: actualChapters
      });
    }
    
    console.log(`${file.replace('.ts', '')}: ${actualVerses}/${declaredTotal} verses (${completeness}%) - ${actualChapters} chapters`);
  }
});

console.log('\n=====================================');
console.log(`\nTotal: ${totalActual}/${totalDeclared} verses (${((totalActual/totalDeclared)*100).toFixed(1)}%)`);
console.log(`Incomplete scriptures: ${incompleteScriptures.length}`);

if (incompleteScriptures.length > 0) {
  console.log('\nIncomplete Scriptures:');
  console.log('---------------------');
  incompleteScriptures.forEach(s => {
    console.log(`- ${s.name}: ${s.actual}/${s.declared} (${s.completeness}%)`);
  });
}
