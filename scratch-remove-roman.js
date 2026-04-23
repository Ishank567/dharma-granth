const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'dharma.db');
const db = new Database(dbPath);

const books = db.prepare("SELECT id, title_hindi, slug FROM books WHERE title_hindi LIKE '%रोमन%' OR title LIKE '%roman%' OR slug LIKE '%roman%'").all();
console.log('Books to delete:', books);

if (books.length > 0) {
  for (const book of books) {
    db.exec('BEGIN TRANSACTION');
    try {
      // Find all verse IDs for this book
      const verses = db.prepare('SELECT id FROM verses WHERE book_id = ?').all(book.id);
      console.log(`Found ${verses.length} verses for book ${book.title_hindi}`);
      
      const verseIds = verses.map(v => v.id);
      
      // Delete interpretations in batches
      if (verseIds.length > 0) {
        const batchSize = 100;
        let deletedInterps = 0;
        for (let i = 0; i < verseIds.length; i += batchSize) {
          const batch = verseIds.slice(i, i + batchSize);
          const placeholders = batch.map(() => '?').join(',');
          const info = db.prepare(`DELETE FROM interpretations WHERE verse_id IN (${placeholders})`).run(...batch);
          deletedInterps += info.changes;
        }
        console.log(`Deleted ${deletedInterps} interpretations.`);
      }
      
      // Delete from full-text search index (requires checking if there's a trigger, but we'll do direct delete just in case, or let trigger handle it)
      // Actually triggers verses_ad and verses_au exist in db.ts to update verses_fts.
      // So deleting from verses directly will trigger the deletion from verses_fts.
      
      const vInfo = db.prepare('DELETE FROM verses WHERE book_id = ?').run(book.id);
      console.log(`Deleted ${vInfo.changes} verses.`);
      
      const cInfo = db.prepare('DELETE FROM chapters WHERE book_id = ?').run(book.id);
      console.log(`Deleted ${cInfo.changes} chapters.`);
      
      const bInfo = db.prepare('DELETE FROM books WHERE id = ?').run(book.id);
      console.log(`Deleted ${bInfo.changes} books.`);
      
      db.exec('COMMIT');
      console.log(`Successfully deleted book: ${book.title_hindi}`);
    } catch (e) {
      db.exec('ROLLBACK');
      console.error(`Failed to delete book ${book.title_hindi}:`, e);
    }
  }
} else {
  console.log('No books found matching "roman" or "रोमन"');
}
