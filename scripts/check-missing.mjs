import Database from 'better-sqlite3';
const db = new Database('db/dharma.db');

const totalVerses = db.prepare('SELECT COUNT(*) as c FROM verses').get();
const totalInterps = db.prepare('SELECT COUNT(*) as c FROM interpretations').get();
const aiInterps = db.prepare("SELECT COUNT(*) as c FROM interpretations WHERE source = 'ai'").get();
const offlineInterps = db.prepare("SELECT COUNT(*) as c FROM interpretations WHERE source = 'offline'").get();

console.log('=== INTERPRETATION STATUS ===');
console.log(`Total verses: ${totalVerses.c}`);
console.log(`Total interpretations: ${totalInterps.c}`);
console.log(`  AI: ${aiInterps.c}`);
console.log(`  Offline: ${offlineInterps.c}`);
console.log(`Missing: ${totalVerses.c - totalInterps.c}`);

// Per-book breakdown of missing interpretations
const missing = db.prepare(`
  SELECT b.slug, b.title_hindi, c.slug as cat_slug,
         COUNT(v.id) as total_verses,
         SUM(CASE WHEN i.id IS NOT NULL THEN 1 ELSE 0 END) as has_interp,
         SUM(CASE WHEN i.id IS NULL THEN 1 ELSE 0 END) as missing_interp
  FROM verses v
  JOIN books b ON b.id = v.book_id
  JOIN categories c ON c.id = b.category_id
  LEFT JOIN interpretations i ON i.verse_id = v.id
  GROUP BY b.id
  HAVING missing_interp > 0
  ORDER BY missing_interp DESC
`).all();

console.log('\n=== BOOKS WITH MISSING INTERPRETATIONS ===');
let totalMissing = 0;
missing.forEach(m => {
  console.log(`${m.slug} (${m.cat_slug}): ${m.missing_interp}/${m.total_verses} missing [${m.title_hindi}]`);
  totalMissing += m.missing_interp;
});
console.log(`\nTotal missing across all books: ${totalMissing}`);

// Check failed verse IDs from checkpoint
import fs from 'fs';
try {
  const checkpoint = JSON.parse(fs.readFileSync('db/batch-interpret-checkpoint.json', 'utf-8'));
  const failedIds = checkpoint.failedVerseIds || [];
  console.log(`\nCheckpoint completed: ${(checkpoint.completedVerseIds || []).length}`);
  console.log(`Checkpoint failed: ${failedIds.length}`);
  if (failedIds.length > 0 && failedIds.length <= 20) {
    console.log(`Failed IDs: ${failedIds.join(', ')}`);
  }
} catch (e) {
  console.log('Could not read checkpoint file');
}

// Check SA batch checkpoint too
try {
  const saCheckpoint = JSON.parse(fs.readFileSync('db/sa-batch-checkpoint.json', 'utf-8'));
  const saFailed = saCheckpoint.failedVerseIds || [];
  console.log(`\nSA Checkpoint completed: ${(saCheckpoint.completedVerseIds || []).length}`);
  console.log(`SA Checkpoint failed: ${saFailed.length}`);
} catch (e) {
  console.log('Could not read SA checkpoint file');
}

db.close();
