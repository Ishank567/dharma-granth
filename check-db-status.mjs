import Database from 'better-sqlite3';

const db = new Database('db/dharma.db');

console.log('=== VERSES TABLE SCHEMA ===');
const cols = db.prepare('PRAGMA table_info(verses)').all();
cols.forEach(c => console.log(`  ${c.name}: ${c.type}`));

console.log('\n=== CHAPTERS TABLE SCHEMA ===');
const chapCols = db.prepare('PRAGMA table_info(chapters)').all();
chapCols.forEach(c => console.log(`  ${c.name}: ${c.type}`));

console.log('\n=== INTERPRETATIONS TABLE SCHEMA ===');
const interpCols = db.prepare('PRAGMA table_info(interpretations)').all();
interpCols.forEach(c => console.log(`  ${c.name}: ${c.type}`));

console.log('\n=== CHECKPOINT STATUS ===');
const result = db.prepare('SELECT COUNT(*) as total FROM verses WHERE id IN (SELECT verse_id FROM interpretations)').get();
const totalResult = db.prepare('SELECT COUNT(*) as total FROM verses').get();
console.log(`Interpretations completed: ${result.total} / ${totalResult.total}`);

console.log('\n=== FAILED VERSES ===');
import('fs').then(fs => {
  const failedVerses = JSON.parse(fs.readFileSync('db/batch-interpret-checkpoint.json', 'utf-8')).failedVerseIds || [];
  console.log(`Failed verses from checkpoint: ${failedVerses.length}`);
  if (failedVerses.length > 0 && failedVerses.length <= 10) {
    console.log(`  ${failedVerses.join(', ')}`);
  }
}).catch(() => console.log('Could not read checkpoint'));

db.close();
