import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const db = new Database(DB_PATH);

console.log('=== DATABASE ANALYSIS ===\n');

// 1. Book and verse counts
const books = (db.prepare('SELECT COUNT(*) as c FROM books').get() as { c: number }).c;
const verses = (db.prepare('SELECT COUNT(*) as c FROM verses').get() as { c: number }).c;
const interp = (db.prepare('SELECT COUNT(*) as c FROM interpretations').get() as { c: number }).c;
const categories = (db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number }).c;

console.log('Counts:');
console.log('  Categories:', categories);
console.log('  Books:', books);
console.log('  Verses:', verses.toLocaleString());
console.log('  Interpretations:', interp.toLocaleString());
console.log('  Coverage:', ((interp / verses) * 100).toFixed(1) + '%');

// 2. Check for books with low verse counts
const lowVerseBooks = db.prepare(`
  SELECT b.id, b.title, COUNT(v.id) as verse_count
  FROM books b
  LEFT JOIN verses v ON b.id = v.book_id
  GROUP BY b.id
  HAVING verse_count < 5
  ORDER BY verse_count
`).all() as Array<{ id: number; title: string; verse_count: number }>;

if (lowVerseBooks.length > 0) {
  console.log('\n⚠️  Books with <5 verses (possible issues):');
  for (const b of lowVerseBooks.slice(0, 10)) {
    console.log(`  [${b.id}] ${b.title}: ${b.verse_count} verses`);
  }
}

// 3. Check interpretation source
const sources = db.prepare('SELECT source, COUNT(*) as c FROM interpretations GROUP BY source').all() as Array<{ source: string; c: number }>;
console.log('\nInterpretation sources:');
for (const s of sources) {
  console.log(`  ${s.source}: ${s.c.toLocaleString()}`);
}

// 4. Check for empty content
const emptyVerses = (db.prepare("SELECT COUNT(*) as c FROM verses WHERE original_text IS NULL OR original_text = ''").get() as { c: number }).c;
if (emptyVerses > 0) console.log('\n⚠️  Empty verses:', emptyVerses);

// 5. Books without interpretations
const booksNoInterp = db.prepare(`
  SELECT b.id, b.title
  FROM books b
  WHERE b.id NOT IN (SELECT DISTINCT v.book_id FROM verses v JOIN interpretations i ON v.id = i.verse_id)
`).all() as Array<{ id: number; title: string }>;

if (booksNoInterp.length > 0) {
  console.log('\n⚠️  Books without interpretations:', booksNoInterp.length);
  for (const b of booksNoInterp) console.log(`  - ${b.title}`);
}

// 6. Check chapters distribution
const chapterStats = db.prepare('SELECT COUNT(*) as books_with_chapters FROM (SELECT book_id FROM chapters GROUP BY book_id)').get() as { books_with_chapters: number };
console.log('\nChapter stats:');
console.log(`  Books with chapters: ${chapterStats.books_with_chapters}/${books}`);

// 7. Check verses without interpretations
const versesNoInterp = (db.prepare(`
  SELECT COUNT(*) as c FROM verses v 
  WHERE v.id NOT IN (SELECT verse_id FROM interpretations)
`).get() as { c: number }).c;

if (versesNoInterp > 0) {
  console.log(`\n⚠️  Verses without interpretations: ${versesNoInterp}`);
}

db.close();
console.log('\n=== END ANALYSIS ===');
