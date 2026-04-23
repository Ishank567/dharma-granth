import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const PDF_DIR = path.resolve(__dirname, '..', '..');

interface BookStatus {
  id: number;
  title: string;
  pdf_filename: string;
  verse_count: number;
  total_pages: number;
  category: string;
  file_exists: boolean;
}

function main() {
  console.log('📚 Checking book extraction status...\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Database not found at:', DB_PATH);
    return;
  }

  const db = new Database(DB_PATH);

  // Get all books with verse counts
  const books = db.prepare(`
    SELECT 
      b.id, 
      b.title, 
      b.pdf_filename, 
      b.total_pages,
      c.name as category,
      COUNT(v.id) as verse_count 
    FROM books b 
    LEFT JOIN verses v ON b.id = v.book_id 
    LEFT JOIN categories c ON b.category_id = c.id
    GROUP BY b.id 
    ORDER BY verse_count ASC, b.id ASC
  `).all() as BookStatus[];

  // Add file existence check
  for (const book of books) {
    book.file_exists = fs.existsSync(path.join(PDF_DIR, book.pdf_filename));
  }

  // Categorize books
  const missingVerses: BookStatus[] = [];
  const lowVerses: BookStatus[] = [];
  const goodVerses: BookStatus[] = [];
  const missingFiles: BookStatus[] = [];

  for (const book of books) {
    if (!book.file_exists) {
      missingFiles.push(book);
    } else if (book.verse_count === 0) {
      missingVerses.push(book);
    } else if (book.verse_count < 10) {
      lowVerses.push(book);
    } else {
      goodVerses.push(book);
    }
  }

  // Print results
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔴 BOOKS WITH MISSING FILES (PDF not found):');
  console.log('═══════════════════════════════════════════════════════════════');
  if (missingFiles.length === 0) {
    console.log('  None\n');
  } else {
    for (const book of missingFiles) {
      console.log(`  [${book.id}] ${book.title}`);
      console.log(`      PDF: ${book.pdf_filename}`);
      console.log(`      Verses: ${book.verse_count} | Category: ${book.category}\n`);
    }
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('❌ BOOKS WITH ZERO VERSES (Needs extraction):');
  console.log('═══════════════════════════════════════════════════════════════');
  if (missingVerses.length === 0) {
    console.log('  None\n');
  } else {
    for (const book of missingVerses) {
      console.log(`  [${book.id}] ${book.title}`);
      console.log(`      PDF: ${book.pdf_filename}`);
      console.log(`      Pages: ${book.total_pages} | Category: ${book.category}\n`);
    }
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('⚠️  BOOKS WITH LOW VERSE COUNT (< 10 verses - may be incomplete):');
  console.log('═══════════════════════════════════════════════════════════════');
  if (lowVerses.length === 0) {
    console.log('  None\n');
  } else {
    for (const book of lowVerses) {
      console.log(`  [${book.id}] ${book.title}`);
      console.log(`      PDF: ${book.pdf_filename}`);
      console.log(`      Verses: ${book.verse_count} | Pages: ${book.total_pages} | Category: ${book.category}\n`);
    }
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ BOOKS WITH GOOD VERSE COUNTS:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Total: ${goodVerses.length} books with adequate verse extraction\n`);

  // Summary
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 SUMMARY:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  Total books in DB: ${books.length}`);
  console.log(`  Missing PDF files: ${missingFiles.length}`);
  console.log(`  Books needing extraction: ${missingVerses.length}`);
  console.log(`  Books with suspiciously low verses: ${lowVerses.length}`);
  console.log(`  Books properly extracted: ${goodVerses.length}`);

  // List PDFs in directory not in database
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📁 PDF FILES NOT IN DATABASE (potential new books):');
  console.log('═══════════════════════════════════════════════════════════════');

  const dbPdfs = new Set(books.map(b => b.pdf_filename.toLowerCase()));
  const pdfFiles = fs.readdirSync(PDF_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  const newPdfs = pdfFiles.filter(f => !dbPdfs.has(f.toLowerCase()));

  if (newPdfs.length === 0) {
    console.log('  None - all PDFs are in database\n');
  } else {
    for (const pdf of newPdfs) {
      const stats = fs.statSync(path.join(PDF_DIR, pdf));
      const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
      console.log(`  📄 ${pdf} (${sizeMB} MB)`);
    }
  }

  db.close();
}

main();
