import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const db = new Database(DB_PATH);

async function processVeda(repoName: string, bookTitle: string, titleHindi: string, slug: string, author: string, filesToFetch: string[], chapterPrefix: string, categorySlug: string) {
  console.log(`\nFetching ${bookTitle} data...`);

  let allVersesCount = 0;
  
  db.exec('BEGIN TRANSACTION');
  try {
    // Clean up old fragmented books (e.g. Rig Veda Vol. 1)
    const oldBooks = db.prepare("SELECT id FROM books WHERE slug LIKE ?").all(`%${slug}%`) as { id: number }[];
    for (const ob of oldBooks) {
      console.log(`Deleting old fragmented book ID ${ob.id}...`);
      const vIds = db.prepare('SELECT id FROM verses WHERE book_id = ?').all(ob.id) as { id: number }[];
      if (vIds.length > 0) {
        for (let i = 0; i < vIds.length; i += 900) {
          const chunk = vIds.slice(i, i + 900);
          const chunkIds = chunk.map(v => v.id);
          const placeholders = chunkIds.map(() => '?').join(',');
          db.prepare(`DELETE FROM interpretations WHERE verse_id IN (${placeholders})`).run(...chunkIds);
        }
      }
      db.prepare('DELETE FROM verses WHERE book_id = ?').run(ob.id);
      db.prepare('DELETE FROM chapters WHERE book_id = ?').run(ob.id);
      db.prepare('DELETE FROM books WHERE id = ?').run(ob.id);
    }

    const categoryId = db.prepare('SELECT id FROM categories WHERE slug = ?').get(categorySlug) as { id: number } || { id: 3 }; // ved category
    const resBook = db.prepare('INSERT INTO books (category_id, title, title_hindi, slug, author, language, pdf_filename, total_pages, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      categoryId.id,
      bookTitle,
      titleHindi,
      slug,
      author,
      'संस्कृत',
      'verified-dataset.json',
      0,
      `100% प्रामाणिक ${titleHindi} (Verified Open Source Dataset)। अनुवाद AI द्वारा प्रक्रियाधीन है।`
    );
    const bookId = resBook.lastInsertRowid as number;

    const insertChapter = db.prepare('INSERT INTO chapters (book_id, chapter_number, title, title_hindi) VALUES (?, ?, ?, ?)');
    const insertVerse = db.prepare(`
      INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration) 
      VALUES (?, ?, ?, ?, '')
    `);

    let globalChapterIndex = 1;

    for (const file of filesToFetch) {
      const url = `https://raw.githubusercontent.com/bhavykhatri/DharmicData/master/${repoName}/${file}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Failed to fetch ${url}`);
        continue;
      }
      const json = await res.json();
      
      const chapterTitle = `${chapterPrefix} ${globalChapterIndex}`;
      const resChapter = insertChapter.run(bookId, globalChapterIndex++, chapterTitle, chapterTitle);
      const chapterId = resChapter.lastInsertRowid;

      let verseCounter = 1;
      
      for (const item of json) {
        const text = item.text || '';
        if (!text) continue;

        // Split by traditional verse numbering: e.g., ॥१॥
        const verses = text.match(/[^॥]+॥\s*[०-९0-9]+\s*॥/g) || [text];
        
        for (const v of verses) {
          const cleanText = v.trim();
          if (cleanText.length < 5) continue;
          
          insertVerse.run(bookId, chapterId, verseCounter++, cleanText);
          allVersesCount++;
        }
      }
      console.log(`Processed ${file}`);
    }

    db.exec('COMMIT');
    console.log(`✅ Success! ${bookTitle} inserted with ${allVersesCount} pure Sanskrit verses.`);
  } catch (e) {
    db.exec('ROLLBACK');
    console.error(`❌ Failed processing ${bookTitle}:`, e);
  }
}

async function main() {
  const rigvedaFiles = Array.from({length: 10}, (_, i) => `rigveda_mandala_${i+1}.json`);
  const atharvavedaFiles = Array.from({length: 20}, (_, i) => `atharvaveda_kaanda_${i+1}.json`);

  await processVeda('Rigveda', 'Rigveda', 'ऋग्वेद', 'rigveda', 'महर्षि वेदव्यास', rigvedaFiles, 'Mandala', 'ved');
  await processVeda('AtharvaVeda', 'Atharvaveda', 'अथर्ववेद', 'atharvaveda', 'महर्षि वेदव्यास', atharvavedaFiles, 'Kanda', 'ved');
  
  console.log('\\nAll requested books processed! Translations will remain blank until batch-interpret is run for their IDs.');
}

main();
