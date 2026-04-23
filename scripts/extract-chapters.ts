/**
 * Extract Chapters from Major Books
 * =================================
 * Detects and extracts chapter structure from Gita, Upanishads, etc.
 */

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');

interface Book {
  id: number;
  title: string;
  pdf_filename: string;
}

interface Verse {
  id: number;
  verse_number: number;
  original_text: string;
}

function detectChapters(verses: Verse[]): Array<{ number: number; title: string; verse_start: number; verse_end: number }> {
  const chapters: Array<{ number: number; title: string; verse_start: number; verse_end: number }> = [];
  let currentChapter = 0;
  let lastChapterVerse = 0;

  for (let i = 0; i < verses.length; i++) {
    const verse = verses[i];
    const text = verse.original_text;

    // Look for chapter markers in Sanskrit/Hindi
    // Pattern: "अर्जुन उवाच", "श्रीभगवानुवाच", "द्वितीयोऽध्यायः", etc.
    const chapterMatch = text.match(/(?:प्रथम|द्वितीय|तृतीय|चतुर्थ|पञ्चम|षष्ठ|सप्तम|अष्टम|नवम|दशम)[\s\-]?[अध्याय|ओ\'ध्याय]/i);
    
    if (chapterMatch && verse.verse_number > lastChapterVerse + 5) {
      currentChapter++;
      if (currentChapter > 1) {
        // Close previous chapter
        chapters[chapters.length - 1].verse_end = verses[i - 1].verse_number;
      }
      chapters.push({
        number: currentChapter,
        title: `अध्याय ${currentChapter}`,
        verse_start: verse.verse_number,
        verse_end: verses[verses.length - 1].verse_number
      });
      lastChapterVerse = verse.verse_number;
    }
  }

  // If no chapters detected, create single chapter with all verses
  if (chapters.length === 0 && verses.length > 0) {
    chapters.push({
      number: 1,
      title: 'प्रथम अध्याय',
      verse_start: verses[0].verse_number,
      verse_end: verses[verses.length - 1].verse_number
    });
  }

  // Fix last chapter end
  if (chapters.length > 0) {
    chapters[chapters.length - 1].verse_end = verses[verses.length - 1].verse_number;
  }

  return chapters;
}

function main() {
  console.log('=== EXTRACT CHAPTERS ===\n');

  const db = new Database(DB_PATH);

  // Major books that should have chapters
  const majorBooks = db.prepare(`
    SELECT id, title, pdf_filename 
    FROM books 
    WHERE title LIKE '%गीता%' 
       OR title LIKE '%उपनिषद%'
       OR title LIKE '%Gita%'
       OR title LIKE '%Upanishad%'
       OR title LIKE '%Bhagavad%'
    ORDER BY id
  `).all() as Book[];

  console.log(`Found ${majorBooks.length} major books to process\n`);

  const insertChapter = db.prepare(`
    INSERT INTO chapters (book_id, chapter_number, title, title_hindi)
    VALUES (?, ?, ?, ?)
    ON CONFLICT DO NOTHING
  `);

  let totalChapters = 0;

  for (const book of majorBooks) {
    console.log(`📖 ${book.title}`);

    // Get verses for this book
    const verses = db.prepare(`
      SELECT id, verse_number, original_text
      FROM verses
      WHERE book_id = ?
      ORDER BY verse_number
    `).all(book.id) as Verse[];

    if (verses.length === 0) {
      console.log('   ⚠️ No verses found\n');
      continue;
    }

    // Detect chapters
    const chapters = detectChapters(verses);

    // Insert chapters
    for (const chapter of chapters) {
      insertChapter.run(
        book.id,
        chapter.number,
        `Chapter ${chapter.number}`,
        chapter.title
      );
    }

    console.log(`   ✅ Created ${chapters.length} chapters (${verses.length} verses)\n`);
    totalChapters += chapters.length;
  }

  console.log(`═══════════════════════════════════════════`);
  console.log(`✅ Total chapters created: ${totalChapters}`);
  console.log(`═══════════════════════════════════════════`);

  db.close();
}

main();
