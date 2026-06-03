const fs = require('fs');
const path = require('path');

// Read scripture metadata to get expected verse counts
const indexPath = 'c:\\Users\\ishan\\Music\\dharma\\dharma-granth\\data\\scriptures\\index.ts';
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Extract totalVerses from the TypeScript files
const scriptureDir = 'c:\\Users\\ishan\\Music\\dharma\\dharma-granth\\data\\scriptures';
const files = fs.readdirSync(scriptureDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

const results = [];
for (const file of files) {
  const content = fs.readFileSync(path.join(scriptureDir, file), 'utf8');
  const idMatch = content.match(/id:\s*["']([^"']+)["']/);
  const totalMatch = content.match(/totalVerses:\s*(\d+)/);
  const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  
  if (idMatch && totalMatch) {
    const id = idMatch[1];
    const expected = parseInt(totalMatch[1]);
    const title = titleMatch ? titleMatch[1] : id;
    
    // Check JSON
    const jsonPath = path.join('c:\\Users\\ishan\\Music\\dharma\\dharma-granth\\public\\data\\scriptures-full', `${id}.json`);
    let actual = 0;
    let chapters = 0;
    if (fs.existsSync(jsonPath)) {
      const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      actual = json.chapters?.reduce((sum, c) => sum + (c.verses?.length || 0), 0) || 0;
      chapters = json.chapters?.length || 0;
    }
    
    const pct = expected > 0 ? (actual / expected * 100).toFixed(1) : 'N/A';
    results.push({ id, title, expected, actual, chapters, pct });
  }
}

// Sort by percentage ascending
results.sort((a, b) => parseFloat(a.pct) - parseFloat(b.pct));

console.log('Remaining gaps (sorted by fill rate):');
console.log('='.repeat(80));
let sparseCount = 0;
for (const r of results) {
  if (parseFloat(r.pct) < 100) {
    const status = parseFloat(r.pct) < 1 ? 'SPARSE' : 'LOW';
    if (parseFloat(r.pct) < 1) sparseCount++;
    console.log(`${status} | ${r.id.padEnd(25)} | expected: ${r.expected.toString().padStart(6)} | actual: ${r.actual.toString().padStart(6)} | ${r.pct.padStart(6)}% | ${r.chapters} ch`);
  }
}
console.log('='.repeat(80));
console.log(`Sparse (<1%): ${sparseCount}`);
console.log(`Total incomplete: ${results.filter(r => parseFloat(r.pct) < 100).length}`);
