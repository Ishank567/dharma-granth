/**
 * Restore specific books from their PDF files without rebuilding the entire database.
 * Usage: npx tsx scripts/restore-books.ts 8 46 43 61 14 6 74 68
 */
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { PDFParse } from 'pdf-parse';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const PDF_DIR = path.resolve(__dirname, '..', '..');

function splitIntoVerses(text: string): string[] {
  text = text.replace(/\r\n/g, '\n').replace(/\f/g, '\n\n');

  const sanskritVerses = text.split(/॥[^॥]*?॥|।।[^।]*?।।|\|\|[^|]*?\|\|/);
  if (sanskritVerses.length > 5) {
    return sanskritVerses.map((v) => v.trim()).filter((v) => v.length > 10);
  }

  const numberedParts = text.split(/\n\s*(?:\d+[\.\)]\s|\d+\s*[-–—]\s)/);
  if (numberedParts.length > 5) {
    return numberedParts.map((v) => v.trim()).filter((v) => v.length > 10);
  }

  const paragraphs = text.split(/\n\s*\n/);
  if (paragraphs.length > 3) {
    const verses: string[] = [];
    let current = '';
    for (const p of paragraphs) {
      const t = p.trim();
      if (!t || t.length < 5) continue;
      if (current.length + t.length > 800 && current.length > 20) {
        verses.push(current.trim());
        current = t;
      } else {
        current += (current ? '\n\n' : '') + t;
      }
    }
    if (current.trim().length > 10) verses.push(current.trim());
    if (verses.length > 2) return verses;
  }

  const chunks: string[] = [];
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  let current = '';
  for (const line of lines) {
    if (current.length + line.length > 500 && current.length > 20) {
      chunks.push(current.trim());
      current = line;
    } else {
      current += (current ? '\n' : '') + line;
    }
  }
  if (current.trim().length > 10) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text.trim()].filter((v) => v.length > 10);
}

const bookIds = process.argv.slice(2).map(Number).filter(Boolean);
if (bookIds.length === 0) {
  console.log('Usage: npx tsx scripts/restore-books.ts <bookId> [bookId2] ...');
  process.exit(1);
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const delInterp = db.prepare('DELETE FROM interpretations WHERE verse_id IN (SELECT id FROM verses WHERE book_id = ?)');
const delVerses = db.prepare('DELETE FROM verses WHERE book_id = ?');
const insVerse = db.prepare(
  "INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration, translation_hindi, translation_english, page_number) VALUES (?, ?, ?, ?, '', '', '', ?)"
);

async function restoreBook(bookId: number) {
  const book = db.prepare('SELECT id, title, pdf_filename, total_pages FROM books WHERE id = ?').get(bookId) as any;
  if (!book) {
    console.log(`Book #${bookId} not found`);
    return;
  }

  const pdfPath = path.join(PDF_DIR, book.pdf_filename);
  if (!fs.existsSync(pdfPath)) {
    console.log(`PDF not found for #${bookId} ${book.title}: ${book.pdf_filename}`);
    return;
  }

  const oldCount = (db.prepare('SELECT COUNT(*) as c FROM verses WHERE book_id = ?').get(bookId) as any).c;

  const parser = new PDFParse({ url: pdfPath.replace(/\\/g, '/') });
  const textResult = await parser.getText();
  const fullText = textResult.text || '';
  const numPages = textResult.total || book.total_pages;

  const verses = splitIntoVerses(fullText);

  const tx = db.transaction(() => {
    delInterp.run(bookId);
    delVerses.run(bookId);
    for (let i = 0; i < verses.length; i++) {
      insVerse.run(
        bookId,
        null,
        i + 1,
        verses[i],
        Math.max(1, Math.floor((i / Math.max(verses.length, 1)) * Math.max(numPages, 1)) + 1)
      );
    }
  });
  tx();

  console.log(`${book.title}: ${oldCount} → ${verses.length} verses (restored from PDF)`);
}

async function main() {
  for (const bookId of bookIds) {
    await restoreBook(bookId);
  }

  try {
    db.exec("INSERT INTO verses_fts(verses_fts) VALUES('rebuild')");
    console.log('Search index rebuilt');
  } catch (e) {
    console.log(`FTS rebuild: ${(e as Error).message}`);
  }

  db.close();
  console.log('Done!');
}

main().catch((e) => {
  console.error('Error:', e);
  db.close();
  process.exit(1);
});
