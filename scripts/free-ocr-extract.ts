/**
 * Free OCR Extraction using Tesseract.js
 * =======================================
 * Extracts verses from scanned PDFs using local OCR (no API costs)
 *
 * Usage: npx tsx scripts/free-ocr-extract.ts [book_id]
 *        npx tsx scripts/free-ocr-extract.ts --all-low
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { createWorker, Worker } from 'tesseract.js';
import { PDFParse } from 'pdf-parse';

// MuPDF loaded dynamically to avoid CJS issues
let mupdfModule: typeof import('mupdf') | null = null;
async function getMupdf() {
  if (!mupdfModule) {
    mupdfModule = await import('mupdf');
  }
  return mupdfModule;
}

const PDF_DIR = path.resolve(__dirname, '..', '..');
const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const TEMP_DIR = path.join(__dirname, '..', 'temp', 'ocr');

interface Book {
  id: number;
  title: string;
  pdf_filename: string;
  total_pages: number;
  verse_count: number;
}

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function log(msg: string) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${msg}`);
}

async function renderPdfPageToImage(pdfPath: string, pageNum: number): Promise<Buffer | null> {
  try {
    const mupdf = await getMupdf();
    const buf = fs.readFileSync(pdfPath);
    const doc = mupdf.Document.openDocument(buf, 'application/pdf');
    const pageCount = doc.countPages();

    if (pageNum > pageCount) {
      log(`Page ${pageNum} out of range (PDF has ${pageCount} pages)`);
      return null;
    }

    const page = doc.loadPage(pageNum - 1); // 0-indexed

    // Render at 200 DPI for OCR (good balance of quality vs speed)
    const scale = 200 / 72;
    const pixmap = page.toPixmap(
      [scale, 0, 0, scale, 0, 0],
      mupdf.ColorSpace.DeviceRGB
    );
    const pngBuffer = pixmap.asPNG();

    return Buffer.from(pngBuffer);
  } catch (error) {
    log(`Error rendering page ${pageNum}: ${(error as Error).message}`);
    return null;
  }
}

async function extractWithTesseract(worker: Worker, imageBuffer: Buffer): Promise<string> {
  try {
    const result = await worker.recognize(imageBuffer);
    return result.data.text;
  } catch (error) {
    log(`OCR error: ${(error as Error).message}`);
    return '';
  }
}

function splitIntoVerses(text: string): string[] {
  text = text.replace(/\r\n/g, '\n').replace(/\f/g, '\n\n');

  // Try Sanskrit verse markers
  const sanskritVerses = text.split(/॥[^॥]*?॥|।।[^।]*?।।|\|\|[^|]*?\|\|/);
  if (sanskritVerses.length > 5) {
    return sanskritVerses.map(v => v.trim()).filter(v => v.length > 10);
  }

  // Numbered sections (1. 2. 3. or 1) 2) 3))
  const numbered = text.split(/\n\s*(?:\d+[\.\)]\s+|\d+\s*[-–—]\s)/);
  if (numbered.length > 5) {
    return numbered.map(v => v.trim()).filter(v => v.length > 10);
  }

  // Paragraph-based (for prose texts like Muktika Upanishad)
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 30);
  if (paragraphs.length > 5) {
    return paragraphs;
  }

  // Sentence-based splitting for short prose
  const sentences = text.split(/[।\.\!\?]\s+/).map(s => s.trim()).filter(s => s.length > 20);
  if (sentences.length > 5) {
    return sentences;
  }

  // Line-based with length filter
  const lines = text.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 20 && !l.match(/^[\d\s\-\—]+$/)); // Skip just numbers/dashes

  if (lines.length > 5) {
    return lines;
  }

  // Final fallback: chunk into ~500 char segments
  const chunks: string[] = [];
  const words = text.split(/\s+/);
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).length > 500 && current.length > 100) {
      chunks.push(current.trim());
      current = word;
    } else {
      current += (current ? ' ' : '') + word;
    }
  }
  if (current.trim().length > 50) chunks.push(current.trim());

  return chunks.length > 0 ? chunks : [text.trim()];
}

async function processBookWithOCR(book: Book, worker: Worker, db: Database.Database, force: boolean = false): Promise<number> {
  const pdfPath = path.join(PDF_DIR, book.pdf_filename);

  if (!fs.existsSync(pdfPath)) {
    log(`❌ PDF not found: ${book.pdf_filename}`);
    return 0;
  }

  // Check if already has verses (unless forcing)
  const existingCount = db.prepare('SELECT COUNT(*) as count FROM verses WHERE book_id = ?').get(book.id) as { count: number };
  if (!force && existingCount.count > 0) {
    log(`  ⏭️  Already has ${existingCount.count} verses, skipping (use --force to reprocess)`);
    return 0;
  }
  if (force && existingCount.count > 0) {
    log(`  🔄 Force reprocessing (had ${existingCount.count} verses)`);
  }

  log(`📖 Processing: ${book.title} (${book.pdf_filename})`);
  log(`   Current verses: ${book.verse_count} | Pages: ${book.total_pages}`);

  // First try text extraction (cheaper)
  try {
    const parser = new PDFParse({ url: pdfPath.replace(/\\/g, '/') });
    const textResult = await parser.getText();

    if (textResult.text && textResult.text.length > 1000) {
      log(`   ✅ Text-based PDF detected, extracting without OCR`);
      const verses = splitIntoVerses(textResult.text);

      if (verses.length > book.verse_count * 2) {
        await saveVerses(book.id, verses, db);
        return verses.length;
      }
    }
  } catch {
    // Continue to OCR
  }

  log(`   🔍 Using OCR (scanned PDF detected)`);

  // Process all pages for books with few pages, sample for large books
  const samplePages = book.total_pages <= 10 ? book.total_pages : Math.min(5, book.total_pages);
  const pageNumbers: number[] = [];
  if (book.total_pages <= 10) {
    // Process all pages for short books
    for (let i = 1; i <= book.total_pages; i++) pageNumbers.push(i);
  } else {
    // Sample pages for large books
    pageNumbers.push(1);
    for (let i = 2; i <= samplePages; i++) {
      pageNumbers.push(Math.floor((i / samplePages) * book.total_pages));
    }
  }

  let allText = '';
  let successfulPages = 0;

  for (const pageNum of pageNumbers) {
    const imageBuffer = await renderPdfPageToImage(pdfPath, pageNum);
    if (imageBuffer) {
      const text = await extractWithTesseract(worker, imageBuffer);
      if (text.length > 50) {
        allText += '\n\n' + text;
        successfulPages++;
        log(`   Page ${pageNum}: ${text.length} chars`);
      }
    }
  }

  if (allText.length < 100) {
    log(`   ⚠️  OCR produced very little text`);
    return 0;
  }

  log(`   📄 OCR extracted ${allText.length} chars from ${successfulPages} pages`);

  const verses = splitIntoVerses(allText);
  log(`   ✂️  Split into ${verses.length} verses`);

  if (verses.length > 0) {
    await saveVerses(book.id, verses, db);
  }

  return verses.length;
}

async function saveVerses(bookId: number, verses: string[], db: Database.Database) {
  const deleteExisting = db.prepare('DELETE FROM verses WHERE book_id = ?');
  const insertVerse = db.prepare(
    'INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration, translation_hindi, translation_english, page_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  const deleteFts = db.prepare('DELETE FROM verses_fts WHERE rowid IN (SELECT id FROM verses WHERE book_id = ?)');

  db.transaction(() => {
    deleteExisting.run(bookId);
    deleteFts.run(bookId);

    for (let i = 0; i < verses.length; i++) {
      insertVerse.run(bookId, null, i + 1, verses[i], '', '', '', 1);
    }

    // Rebuild FTS
    db.exec(`
      INSERT INTO verses_fts(rowid, original_text, transliteration, translation_hindi, translation_english)
      SELECT id, original_text, transliteration, translation_hindi, translation_english
      FROM verses WHERE book_id = ${bookId}
    `);
  })();
}

async function main() {
  console.log('🔍 Free OCR Extraction (Tesseract.js)\n');

  const args = process.argv.slice(2);
  const processAllLow = args.includes('--all-low');
  const forceReprocess = args.includes('--force');
  const targetBookId = processAllLow ? null : parseInt(args[0]);

  if (!processAllLow && isNaN(targetBookId as number)) {
    console.log('Usage:');
    console.log('  npx tsx scripts/free-ocr-extract.ts 38');
    console.log('  npx tsx scripts/free-ocr-extract.ts 38 --force');
    console.log('  npx tsx scripts/free-ocr-extract.ts --all-low');
    return;
  }

  if (!fs.existsSync(DB_PATH)) {
    log('❌ Database not found: ' + DB_PATH);
    process.exit(1);
  }

  const db = new Database(DB_PATH);

  // Get books to process
  let booksToProcess: Book[] = [];

  if (processAllLow) {
    booksToProcess = db.prepare(`
      SELECT b.id, b.title, b.pdf_filename, b.total_pages, COUNT(v.id) as verse_count
      FROM books b
      LEFT JOIN verses v ON b.id = v.book_id
      GROUP BY b.id
      HAVING verse_count < 10
      ORDER BY verse_count ASC, b.id ASC
    `).all() as Book[];
  } else {
    const book = db.prepare(`
      SELECT b.id, b.title, b.pdf_filename, b.total_pages, COUNT(v.id) as verse_count
      FROM books b
      LEFT JOIN verses v ON b.id = v.book_id
      WHERE b.id = ?
      GROUP BY b.id
    `).get(targetBookId) as Book | undefined;

    if (book) booksToProcess.push(book);
  }

  if (booksToProcess.length === 0) {
    log('No books to process');
    db.close();
    return;
  }

  log(`Processing ${booksToProcess.length} book(s)\n`);

  // Initialize Tesseract worker
  log('🚀 Initializing Tesseract OCR engine...');
  const worker = await createWorker('hin', 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') {
        process.stdout.write(`\r   Progress: ${(m.progress * 100).toFixed(1)}%`);
      }
    }
  });
  log('   ✅ Ready\n');

  let totalVerses = 0;
  let successCount = 0;

  for (let i = 0; i < booksToProcess.length; i++) {
    const book = booksToProcess[i];
    log(`\n[${i + 1}/${booksToProcess.length}] Book ${book.id}: ${book.title}`);

    try {
      const verses = await processBookWithOCR(book, worker, db, forceReprocess);
      if (verses > 0) {
        totalVerses += verses;
        successCount++;
        log(`   ✅ Extracted ${verses} verses`);
      } else {
        log(`   ⚠️  No verses extracted`);
      }
    } catch (error) {
      log(`   ❌ Error: ${(error as Error).message}`);
    }
  }

  // Cleanup
  await worker.terminate();

  // Clean temp files
  try {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  } catch {}

  console.log('\n═══════════════════════════════════════════');
  console.log(`✅ Done! Processed ${successCount}/${booksToProcess.length} books`);
  console.log(`   Total verses extracted: ${totalVerses}`);
  console.log('═══════════════════════════════════════════');

  db.close();
}

main().catch(console.error);
