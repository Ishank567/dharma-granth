import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const db = new Database(DB_PATH);

console.log("Checking for missing or unreadable verses...");

// 1. Check for empty or whitespace-only verses
type VerseRow = { id: number; verse_number: number; book_title: string; chapter_title: string; original_text: string };
type BookRow = { id: number; title: string };
type ChapterRow = { id: number; title: string };
type VerseNumRow = { verse_number: number };

const emptyVerses = db.prepare(`
  SELECT v.id, v.verse_number, b.title as book_title, c.title as chapter_title, v.original_text
  FROM verses v
  JOIN books b ON b.id = v.book_id
  LEFT JOIN chapters c ON c.id = v.chapter_id
  WHERE trim(v.original_text) = '' OR v.original_text IS NULL
`).all() as VerseRow[];

if (emptyVerses.length > 0) {
  console.log(`\n❌ Found ${emptyVerses.length} empty or null verses:`);
  emptyVerses.slice(0, 10).forEach(v => {
    console.log(`  - Book: ${v.book_title}, Chapter: ${v.chapter_title}, Verse: ${v.verse_number}, ID: ${v.id}`);
  });
  if (emptyVerses.length > 10) console.log("  ...and more.");
} else {
  console.log("✅ No empty or null verses found.");
}

// 2. Check for unreadable/garbled characters (like )
const garbledVerses = db.prepare(`
  SELECT v.id, v.verse_number, b.title as book_title, c.title as chapter_title, v.original_text
  FROM verses v
  JOIN books b ON b.id = v.book_id
  LEFT JOIN chapters c ON c.id = v.chapter_id
  WHERE v.original_text LIKE '%%' OR v.original_text LIKE '%?%'
`).all() as VerseRow[];

// Exclude legitimate question marks if any, though ? in Sanskrit is rare.
// Let's just output them for review.
const actuallyGarbled = garbledVerses.filter(v => v.original_text.includes('') || v.original_text.includes('??'));

if (actuallyGarbled.length > 0) {
  console.log(`\n❌ Found ${actuallyGarbled.length} verses with potential encoding issues ( or ??):`);
  actuallyGarbled.slice(0, 10).forEach(v => {
    console.log(`  - Book: ${v.book_title}, Chapter: ${v.chapter_title}, Verse: ${v.verse_number}, ID: ${v.id}`);
    console.log(`    Text: ${v.original_text.substring(0, 50)}...`);
  });
  if (actuallyGarbled.length > 10) console.log("  ...and more.");
} else {
  console.log("✅ No unreadable/garbled characters () found.");
}

// 3. Check for extremely short verses (less than 3 characters, which is suspicious for a shlok)
const shortVerses = db.prepare(`
  SELECT v.id, v.verse_number, b.title as book_title, c.title as chapter_title, v.original_text
  FROM verses v
  JOIN books b ON b.id = v.book_id
  LEFT JOIN chapters c ON c.id = v.chapter_id
  WHERE length(trim(v.original_text)) < 5 AND v.original_text NOT LIKE '%॥%'
`).all() as VerseRow[];

if (shortVerses.length > 0) {
  console.log(`\n⚠️ Found ${shortVerses.length} extremely short verses (< 5 chars):`);
  shortVerses.slice(0, 10).forEach(v => {
    console.log(`  - Book: ${v.book_title}, Chapter: ${v.chapter_title}, Verse: ${v.verse_number}, Text: '${v.original_text}'`);
  });
} else {
  console.log("✅ No extremely short verses found.");
}

// 4. Check for sequence gaps in chapters
// Group verses by book and chapter, order by verse_number
const books = db.prepare('SELECT id, title FROM books').all() as BookRow[];
let sequenceGaps = 0;

for (const book of books) {
  const chapters = db.prepare('SELECT id, title FROM chapters WHERE book_id = ?').all(book.id) as ChapterRow[];

  for (const chapter of chapters) {
    const verses = db.prepare('SELECT verse_number FROM verses WHERE book_id = ? AND chapter_id = ? ORDER BY verse_number ASC').all(book.id, chapter.id) as VerseNumRow[];

    let expected = 1;
    for (const verse of verses) {
      if (verse.verse_number !== expected) {
        // Only log first few gaps to avoid spam
        if (sequenceGaps < 10) {
          console.log(`\n⚠️ Gap found in Book: ${book.title}, Chapter: ${chapter.title}. Expected verse ${expected}, got ${verse.verse_number}`);
        }
        sequenceGaps++;
        expected = verse.verse_number; // Reset to continue checking
      }
      expected++;
    }
  }
}

if (sequenceGaps === 0) {
  console.log("\n✅ No sequence gaps found in chapters. Verses are numbered sequentially.");
} else {
  console.log(`\n⚠️ Found ${sequenceGaps} sequence gaps across all books/chapters.`);
}

console.log("\nDone checking.");
