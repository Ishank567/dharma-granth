import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const PDF_DIR = path.resolve(__dirname, '..', '..');

// Map of book IDs to correct PDF filenames
const CORRECTIONS: Record<number, string> = {
  // Book 90: Rigveda -> rigved.pdf (174.5 MB high quality version)
  90: 'rigved.pdf',
  // Book 91: Atharvaveda -> atharva-ved.pdf
  91: 'atharva-ved.pdf',
};

function main() {
  console.log('🔧 Fixing PDF filename mappings...\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Database not found at:', DB_PATH);
    return;
  }

  const db = new Database(DB_PATH);

  // Get current status of problematic books
  interface BookInfo {
    id: number;
    title: string;
    pdf_filename: string;
    total_pages: number;
    category: string;
  }
  const problematicBooks = db.prepare(`
    SELECT b.id, b.title, b.pdf_filename, b.total_pages, c.name as category
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.pdf_filename = 'verified-dataset.json'
  `).all() as BookInfo[];

  console.log('Found books with incorrect PDF filenames:');
  for (const book of problematicBooks) {
    console.log(`  [${book.id}] ${book.title}: ${book.pdf_filename}`);
  }
  console.log('');

  // Fix books that have existing PDF files
  const updateStmt = db.prepare('UPDATE books SET pdf_filename = ? WHERE id = ?');

  for (const [bookIdStr, correctPdf] of Object.entries(CORRECTIONS)) {
    const bookId = parseInt(bookIdStr);
    const pdfPath = path.join(PDF_DIR, correctPdf);

    if (!fs.existsSync(pdfPath)) {
      console.log(`⚠️  PDF not found for book ${bookId}: ${correctPdf}`);
      continue;
    }

    const book = db.prepare('SELECT title FROM books WHERE id = ?').get(bookId) as { title: string };
    if (!book) {
      console.log(`⚠️  Book ${bookId} not found in database`);
      continue;
    }

    console.log(`✅ Fixing book ${bookId} (${book.title}): ${correctPdf}`);
    updateStmt.run(correctPdf, bookId);
  }

  // Check which books still need PDFs
  const stillMissing = db.prepare(`
    SELECT b.id, b.title, b.pdf_filename, c.name as category
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.pdf_filename = 'verified-dataset.json'
  `).all() as BookInfo[];

  console.log('\n📋 Books still needing PDF files:');
  if (stillMissing.length === 0) {
    console.log('  None - all books have correct PDF mappings!');
  } else {
    for (const book of stillMissing) {
      console.log(`  [${book.id}] ${book.title} (${book.category})`);
    }
  }

  db.close();
  console.log('\n✅ Done!');
}

main();
