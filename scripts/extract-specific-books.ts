/**
 * Incremental Extraction for Specific Books
 * ===========================================
 * Extracts verses from specific PDFs without dropping the database
 *
 * Usage: npx tsx scripts/extract-specific-books.ts [book_id1] [book_id2] ...
 *        npx tsx scripts/extract-specific-books.ts --all-new
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { PDFParse } from 'pdf-parse';

const PDF_DIR = path.resolve(__dirname, '..', '..');
const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');

const args = process.argv.slice(2);
const extractAllNew = args.includes('--all-new');
const targetBookIds = extractAllNew ? [] : args.map(id => parseInt(id)).filter(id => !isNaN(id));

interface Book {
  id: number;
  title: string;
  pdf_filename: string;
  total_pages: number;
}

function splitIntoVerses(text: string): string[] {
  text = text.replace(/\r\n/g, '\n').replace(/\f/g, '\n\n');

  // Try Sanskrit verse markers
  const sanskritVerses = text.split(/॥[^॥]*?॥|।।[^।]*?।।|\|\|[^|]*?\|\|/);
  if (sanskritVerses.length > 5) {
    return sanskritVerses.map((value) => value.trim()).filter((value) => value.length > 10);
  }

  // Try numbered sections
  const numberedParts = text.split(/\n\s*(?:\d+[\.\)]\s|\d+\s*[-–—]\s)/);
  if (numberedParts.length > 5) {
    return numberedParts.map((value) => value.trim()).filter((value) => value.length > 10);
  }

  // Paragraph-based splitting
  const paragraphs = text.split(/\n\s*\n/);
  if (paragraphs.length > 3) {
    const verses: string[] = [];
    let current = '';

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed || trimmed.length < 5) continue;

      if (current.length + trimmed.length > 800 && current.length > 20) {
        verses.push(current.trim());
        current = trimmed;
      } else {
        current += (current ? '\n\n' : '') + trimmed;
      }
    }

    if (current.trim().length > 10) {
      verses.push(current.trim());
    }

    if (verses.length > 2) return verses;
  }

  // Fallback: chunk by lines
  const chunks: string[] = [];
  const lines = text.split('\n').filter((line) => line.trim().length > 0);
  let current = '';

  for (const line of lines) {
    if (current.length + line.length > 500 && current.length > 20) {
      chunks.push(current.trim());
      current = line;
    } else {
      current += (current ? '\n' : '') + line;
    }
  }

  if (current.trim().length > 10) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [text.trim()];
}

async function extractBookVerses(book: Book, db: Database.Database): Promise<number> {
  const pdfPath = path.join(PDF_DIR, book.pdf_filename);

  if (!fs.existsSync(pdfPath)) {
    console.log(`  ❌ PDF not found: ${book.pdf_filename}`);
    return 0;
  }

  // Check if already has verses
  const existingCount = db.prepare('SELECT COUNT(*) as count FROM verses WHERE book_id = ?').get(book.id) as { count: number };
  if (existingCount.count > 0) {
    console.log(`  ⏭️  Already has ${existingCount.count} verses, skipping`);
    return 0;
  }

  console.log(`  📖 Extracting from: ${book.pdf_filename}`);

  // Use pdf-parse to extract text
  const parser = new PDFParse({ url: pdfPath.replace(/\\/g, '/') });
  const textResult = await parser.getText();
  const fullText = textResult.text || '';

  if (!fullText || fullText.length < 50) {
    console.log(`  ⚠️  Extracted very little text (${fullText?.length || 0} chars), may need OCR`);
    return 0;
  }

  // Split into verses
  const verses = splitIntoVerses(fullText);
  console.log(`  ✂️  Split into ${verses.length} verses (${fullText.length} chars)`);

  if (verses.length === 0) {
    console.log(`  ⚠️  No verses extracted`);
    return 0;
  }

  // Insert verses
  const insertVerse = db.prepare(
    'INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration, translation_hindi, translation_english, page_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const deleteExisting = db.prepare('DELETE FROM verses WHERE book_id = ?');
  deleteExisting.run(book.id);

  const insertMany = db.transaction((verseList: string[]) => {
    for (let i = 0; i < verseList.length; i++) {
      const pageNum = Math.max(1, Math.floor((i / Math.max(verseList.length, 1)) * book.total_pages) + 1);
      insertVerse.run(book.id, null, i + 1, verseList[i], '', '', '', pageNum);
    }
  });

  insertMany(verses);
  console.log(`  ✅ Inserted ${verses.length} verses`);

  // Update FTS index
  db.exec(`
    INSERT INTO verses_fts(rowid, original_text, transliteration, translation_hindi, translation_english)
    SELECT id, original_text, transliteration, translation_hindi, translation_english
    FROM verses WHERE book_id = ${book.id}
  `);

  return verses.length;
}

async function main() {
  console.log('📚 Incremental Book Extraction\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Database not found:', DB_PATH);
    process.exit(1);
  }

  const db = new Database(DB_PATH);

  // Get books to process
  let booksToProcess: Book[] = [];

  if (extractAllNew) {
    // Find all books with PDFs but no verses
    booksToProcess = db.prepare(`
      SELECT b.id, b.title, b.pdf_filename, b.total_pages
      FROM books b
      LEFT JOIN verses v ON b.id = v.book_id
      GROUP BY b.id
      HAVING COUNT(v.id) = 0
    `).all() as Book[];
    console.log(`Found ${booksToProcess.length} books without verses\n`);
  } else if (targetBookIds.length > 0) {
    // Process specific books
    for (const id of targetBookIds) {
      const book = db.prepare('SELECT id, title, pdf_filename, total_pages FROM books WHERE id = ?').get(id) as Book | undefined;
      if (book) {
        booksToProcess.push(book);
      } else {
        console.log(`⚠️  Book ID ${id} not found`);
      }
    }
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/extract-specific-books.ts 88 89 90 91');
    console.log('  npx tsx scripts/extract-specific-books.ts --all-new');
    db.close();
    return;
  }

  console.log(`Processing ${booksToProcess.length} books:\n`);

  let totalVerses = 0;
  for (const book of booksToProcess) {
    console.log(`[${book.id}] ${book.title}`);
    const verses = await extractBookVerses(book, db);
    totalVerses += verses;
    console.log('');
  }

  console.log('═══════════════════════════════════════');
  console.log(`✅ Done! Extracted ${totalVerses} total verses`);
  console.log('═══════════════════════════════════════');

  db.close();
}

main().catch(console.error);
