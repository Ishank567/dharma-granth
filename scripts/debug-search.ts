import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const db = new Database(DB_PATH);

console.log('Debugging search for धर्म\n');

// Check if धर्म exists in verse_words
const exact = (db.prepare("SELECT COUNT(*) as c FROM verse_words WHERE word = 'धर्म'").get() as { c: number }).c;
console.log('Exact match धर्म:', exact);

// Check LIKE pattern
const like = (db.prepare("SELECT COUNT(*) as c FROM verse_words WHERE word LIKE '%धर्म%'").get() as { c: number }).c;
console.log('LIKE %धर्म%:', like);

// Check word_lower
const lower = (db.prepare("SELECT COUNT(*) as c FROM verse_words WHERE word_lower LIKE '%धर्म%'").get() as { c: number }).c;
console.log('word_lower LIKE %धर्म%:', lower);

// Find some words that contain धर्म
const sample = db.prepare("SELECT word, word_lower FROM verse_words WHERE word LIKE '%धर्म%' LIMIT 5").all() as Array<{ word: string; word_lower: string }>;
console.log('\nSample words with धर्म:');
sample.forEach(w => console.log(`  word: ${w.word} | lower: ${w.word_lower}`));

// Check if धर्म appears in verses directly
const verses = (db.prepare("SELECT COUNT(*) as c FROM verses WHERE original_text LIKE '%धर्म%'").get() as { c: number }).c;
console.log('\nVerses with धर्म in original_text:', verses);

// Test search function in the app
console.log('\nTesting app search function:');
const searchResult = db.prepare(`
  SELECT DISTINCT v.id, v.original_text, b.title as book_title
  FROM verse_words vw
  JOIN verses v ON vw.verse_id = v.id
  JOIN books b ON v.book_id = b.id
  WHERE vw.word LIKE '%' || ? || '%'
  LIMIT 3
`).all('धर्म') as Array<{ id: number; original_text: string; book_title: string }>;

console.log(`Found ${searchResult.length} results with parameter binding`);
searchResult.forEach((r, i) => {
  console.log(`  ${i + 1}. [${r.book_title}] ${r.original_text.substring(0, 50)}...`);
});

db.close();
