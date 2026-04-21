/**
 * Re-split verses for books that have good OCR text but poor verse splitting.
 * Usage: npx tsx scripts/resplit-verses.ts 50 53
 */
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');

const TARGET_SIZE = 500;
const MAX_SIZE = 800;
const LINE_TARGET = 400;

function splitIntoVerses(text: string): string[] {
  text = text.replace(/\r\n/g, '\n').replace(/\f/g, '\n\n');

  const sv = text.split(/॥[^॥]*?॥|।।[^।]*?।।/);
  if (sv.length > 5) return sv.map((v) => v.trim()).filter((v) => v.length > 15);

  const np = text.split(/\n\s*(?:\d+[\.\)]\s|\d+\s*[-–—]\s)/);
  if (np.length > 5) return np.map((v) => v.trim()).filter((v) => v.length > 15);

  const paras = text.split(/\n\s*\n/);
  if (paras.length > 3) {
    const verses: string[] = [];
    let cur = '';
    for (const p of paras) {
      const t = p.trim();
      if (!t || t.length < 8) continue;
      if (cur.length > TARGET_SIZE || (cur.length + t.length > MAX_SIZE && cur.length > 20)) {
        verses.push(cur.trim());
        cur = t;
      } else {
        cur += (cur ? '\n\n' : '') + t;
      }
    }
    if (cur.trim().length > 15) verses.push(cur.trim());
    if (verses.length > 2) return verses;
  }

  const chunks: string[] = [];
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  let cur = '';
  for (const l of lines) {
    if (cur.length > LINE_TARGET && cur.length > 20) {
      chunks.push(cur.trim());
      cur = l;
    } else {
      cur += (cur ? '\n' : '') + l;
    }
  }
  if (cur.trim().length > 15) chunks.push(cur.trim());
  return chunks.length > 0 ? chunks : [text.trim()].filter((v) => v.length > 15);
}

const bookIds = process.argv.slice(2).map(Number).filter(Boolean);
if (bookIds.length === 0) {
  console.log('Usage: npx tsx scripts/resplit-verses.ts <bookId> [bookId2] ...');
  process.exit(1);
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const delInterp = db.prepare('DELETE FROM interpretations WHERE verse_id IN (SELECT id FROM verses WHERE book_id = ?)');
const delVerses = db.prepare('DELETE FROM verses WHERE book_id = ?');
const ins = db.prepare(
  "INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration, translation_hindi, translation_english, page_number) VALUES (?, ?, ?, ?, '', '', '', ?)"
);

for (const bookId of bookIds) {
  const book = db.prepare('SELECT id, title, total_pages FROM books WHERE id = ?').get(bookId) as any;
  if (!book) {
    console.log(`Book ${bookId} not found`);
    continue;
  }

  const oldVerses = db.prepare('SELECT original_text FROM verses WHERE book_id = ? ORDER BY verse_number').all(bookId) as any[];
  const fullText = oldVerses.map((v: any) => v.original_text).join('\n\n');
  const newVerses = splitIntoVerses(fullText);

  console.log(`${book.title}: ${oldVerses.length} → ${newVerses.length} verses`);

  const tx = db.transaction(() => {
    delInterp.run(bookId);
    delVerses.run(bookId);
    for (let i = 0; i < newVerses.length; i++) {
      ins.run(
        bookId,
        null,
        i + 1,
        newVerses[i],
        Math.max(1, Math.floor((i / Math.max(newVerses.length, 1)) * book.total_pages) + 1)
      );
    }
  });
  tx();
}

// Rebuild FTS index
try {
  db.exec("INSERT INTO verses_fts(verses_fts) VALUES('rebuild')");
  console.log('Search index rebuilt');
} catch (e) {
  console.log(`FTS rebuild: ${(e as Error).message}`);
}

db.close();
console.log('Done!');
