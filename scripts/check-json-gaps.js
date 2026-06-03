const fs = require('fs');
const path = require('path');

const fullDir = 'c:\\Users\\ishan\\Music\\dharma\\dharma-granth\\public\\data\\scriptures-full';
const tsDir = 'c:\\Users\\ishan\\Music\\dharma\\dharma-granth\\data\\scriptures';

const files = fs.readdirSync(fullDir).filter(f => f.endsWith('.json'));

let results = [];

for (const file of files) {
  const id = file.replace('.json', '');
  
  // Read JSON
  const jsonPath = path.join(fullDir, file);
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const jsonVerses = jsonData.chapters?.reduce((sum, c) => sum + (c.verses?.length || 0), 0) || 0;
  const jsonChapters = jsonData.chapters?.length || 0;
  
  // Read TS for expected total
  const tsPath = path.join(tsDir, id + '.ts');
  let expectedVerses = 0;
  if (fs.existsSync(tsPath)) {
    const tsContent = fs.readFileSync(tsPath, 'utf8');
    const match = tsContent.match(/totalVerses:\s*(\d+)/);
    if (match) expectedVerses = parseInt(match[1]);
  }
  
  results.push({
    id,
    file,
    expectedVerses,
    jsonVerses,
    jsonChapters,
    jsonSize: fs.statSync(jsonPath).size,
    ratio: expectedVerses > 0 ? (jsonVerses / expectedVerses * 100).toFixed(2) : '0',
    isEmpty: jsonVerses === 0
  });
}

results.sort((a, b) => parseFloat(a.ratio) - parseFloat(b.ratio));

console.log('ID                       | EXPECTED | JSON   | CHAPS | SIZE     | %      | STATUS');
console.log('-------------------------|----------|--------|-------|----------|--------|-------');
for (const r of results) {
  const status = r.isEmpty ? 'EMPTY' : (parseFloat(r.ratio) < 1 ? 'SPARSE' : 'OK');
  const line = [
    r.id.padEnd(24),
    String(r.expectedVerses).padStart(8),
    String(r.jsonVerses).padStart(6),
    String(r.jsonChapters).padStart(5),
    String(r.jsonSize).padStart(8),
    r.ratio.padStart(6) + '%',
    status
  ].join(' | ');
  console.log(line);
}

console.log('\n--- SUMMARY ---');
const totalExpected = results.reduce((s, r) => s + r.expectedVerses, 0);
const totalJson = results.reduce((s, r) => s + r.jsonVerses, 0);
const emptyCount = results.filter(r => r.isEmpty).length;
const sparseCount = results.filter(r => !r.isEmpty && parseFloat(r.ratio) < 1).length;
console.log('Total expected verses:', totalExpected);
console.log('Total JSON verses:', totalJson);
console.log('JSON fill rate:', (totalJson / totalExpected * 100).toFixed(3) + '%');
console.log('Empty JSON files:', emptyCount);
console.log('Sparse JSON files (<1%):', sparseCount);
