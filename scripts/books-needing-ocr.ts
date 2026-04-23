/**
 * Books Needing OCR Processing
 * ==============================
 * Lists all books with low verse counts that likely need OCR extraction
 */

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');

interface Book {
  id: number;
  title: string;
  pdf_filename: string;
  verse_count: number;
  total_pages: number;
  category: string;
}

function main() {
  console.log('📚 Books Needing OCR Processing\n');

  const db = new Database(DB_PATH);

  const lowVerseBooks = db.prepare(`
    SELECT b.id, b.title, b.pdf_filename, COUNT(v.id) as verse_count,
           b.total_pages, c.name as category
    FROM books b
    LEFT JOIN verses v ON b.id = v.book_id
    LEFT JOIN categories c ON b.category_id = c.id
    GROUP BY b.id
    HAVING verse_count < 10 AND verse_count > 0
    ORDER BY verse_count ASC, b.id ASC
  `).all() as Book[];

  console.log(`Found ${lowVerseBooks.length} books with suspiciously low verse counts:\n`);

  let currentCategory = '';
  for (const book of lowVerseBooks) {
    if (book.category !== currentCategory) {
      currentCategory = book.category;
      console.log(`\n${currentCategory}:`);
    }
    console.log(`  [${book.id}] ${book.title}`);
    console.log(`      Verses: ${book.verse_count} | Pages: ${book.total_pages} | PDF: ${book.pdf_filename}`);
  }

  // Books with ZERO verses (critical priority)
  const zeroVerseBooks = db.prepare(`
    SELECT b.id, b.title, b.pdf_filename, b.total_pages, c.name as category
    FROM books b
    LEFT JOIN verses v ON b.id = v.book_id
    LEFT JOIN categories c ON b.category_id = c.id
    GROUP BY b.id
    HAVING COUNT(v.id) = 0
    ORDER BY b.id ASC
  `).all() as Book[];

  if (zeroVerseBooks.length > 0) {
    console.log(`\n\n❌ CRITICAL: ${zeroVerseBooks.length} books with ZERO verses:`);
    for (const book of zeroVerseBooks) {
      console.log(`  [${book.id}] ${book.title} (${book.category}) - ${book.pdf_filename}`);
    }
  }

  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('To process these books with OCR:');
  console.log('  npx tsx scripts/ocr-extract.ts');
  console.log('\nNote: Requires Google Cloud Vision API with billing enabled.');
  console.log('═══════════════════════════════════════════════════════════');

  db.close();
}

main();
