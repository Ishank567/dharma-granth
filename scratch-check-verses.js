const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'dharma.db');
const db = new Database(dbPath);

const books = db.prepare('SELECT id, slug, title FROM books WHERE slug = ?').all('arthved');

for (const book of books) {
  const verses = db.prepare('SELECT verse_number, id FROM verses WHERE book_id = ? ORDER BY verse_number').all(book.id);
  console.log(`Book: ${book.title} (slug: ${book.slug}), Total Verses: ${verses.length}`);
  
  if (verses.length > 0) {
    let missingCount = 0;
    const missingRanges = [];
    let expected = verses[0].verse_number; // Might not start at 1? Usually 1.
    if (expected > 1) {
      missingRanges.push(`1 to ${expected - 1}`);
      missingCount += expected - 1;
    }
    
    for (let i = 0; i < verses.length; i++) {
      if (verses[i].verse_number > expected) {
        if (verses[i].verse_number - 1 === expected) {
            missingRanges.push(`${expected}`);
        } else {
            missingRanges.push(`${expected} to ${verses[i].verse_number - 1}`);
        }
        missingCount += (verses[i].verse_number - expected);
        expected = verses[i].verse_number;
      }
      expected++;
    }
    
    if (missingRanges.length > 0) {
      console.log(`Missing verse numbers: ${missingRanges.join(', ')}`);
      console.log(`Total missing: ${missingCount}`);
    } else {
      console.log('No missing verses within the sequence.');
    }
  }
}

// Check how many books have missing interpretations
const missingInterps = db.prepare(`
  SELECT b.title, b.slug, COUNT(v.id) as total_verses,
         SUM(CASE WHEN i.id IS NULL THEN 1 ELSE 0 END) as missing_interps
  FROM books b
  JOIN verses v ON v.book_id = b.id
  LEFT JOIN interpretations i ON i.verse_id = v.id
  GROUP BY b.id
  HAVING missing_interps > 0
`).all();

console.log('\nBooks with missing interpretations:', missingInterps);
