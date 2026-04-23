import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const db = new Database(DB_PATH);

const KAANDS = [
  '1_balakanda.json',
  '2_ayodhyakanda.json',
  '3_aranyakanda.json',
  '4_kishkindhakanda.json',
  '5_sundarakanda.json',
  '6_yudhhakanda.json',
  '7_uttarakanda.json'
];

async function main() {
  console.log('Fetching verified Valmiki Ramayana data from DharmicData repo...');

  const allData = [];
  for (let i = 0; i < KAANDS.length; i++) {
    const url = `https://raw.githubusercontent.com/bhavykhatri/DharmicData/master/ValmikiRamayana/${KAANDS[i]}`;
    const res = await fetch(url);
    const json = await res.json();
    allData.push({ kaand_name: KAANDS[i].replace('.json', ''), verses: json });
    console.log(`Fetched ${KAANDS[i]} (${json.length} verses)`);
  }

  console.log('Data fetched. Modifying database...');

  db.exec('BEGIN TRANSACTION');
  try {
    let book = db.prepare('SELECT id FROM books WHERE slug = ?').get('ramayana-all-kand-6191-pages') as { id: number };
    
    if (!book) {
      book = db.prepare("SELECT id FROM books WHERE title LIKE '%ramayana%'").get() as { id: number };
    }

    if (!book) {
      console.log('Valmiki Ramayana book not found. Inserting it...');
      const categoryId = db.prepare('SELECT id FROM categories WHERE slug = ?').get('purana') as { id: number } || { id: 1 };
      const res = db.prepare('INSERT INTO books (category_id, title, title_hindi, slug, author, language, pdf_filename, total_pages, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
        categoryId.id,
        'Valmiki Ramayana',
        'वाल्मीकि रामायण',
        'valmiki-ramayana',
        'महर्षि वाल्मीकि',
        'संस्कृत',
        'verified-dataset.json',
        0,
        '100% प्रामाणिक वाल्मीकि रामायण (Verified Open Source Dataset)। अनुवाद AI द्वारा प्रक्रियाधीन है।'
      );
      book = { id: res.lastInsertRowid as number };
    }
    const bookId = book.id;

    // Delete existing interpretations
    const existingVerses = db.prepare('SELECT id FROM verses WHERE book_id = ?').all(bookId) as { id: number }[];
    const verseIds = existingVerses.map((v) => v.id);
    
    if (verseIds.length > 0) {
      // Chunk deletion to avoid sqlite limits
      for (let i = 0; i < verseIds.length; i += 900) {
        const chunk = verseIds.slice(i, i + 900);
        const placeholders = chunk.map(() => '?').join(',');
        db.prepare(`DELETE FROM interpretations WHERE verse_id IN (${placeholders})`).run(...chunk);
        db.prepare(`DELETE FROM verse_words WHERE verse_id IN (${placeholders})`).run(...chunk);
      }
      console.log(`Deleted ${verseIds.length} existing interpretations.`);
    }

    db.prepare('DELETE FROM verses WHERE book_id = ?').run(bookId);
    db.prepare('DELETE FROM chapters WHERE book_id = ?').run(bookId);
    console.log('Deleted existing verses and chapters.');

    const insertChapter = db.prepare('INSERT INTO chapters (book_id, chapter_number, title, title_hindi) VALUES (?, ?, ?, ?)');
    const insertVerse = db.prepare(`
      INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration) 
      VALUES (?, ?, ?, ?, '')
    `);

    let globalChapterIndex = 1;
    let totalVersesInserted = 0;

    for (const kaand of allData) {
      // Create a chapter per Sarga
      // verses have { sarg: 1, shloka: 1, text: "..." }
      let currentSarg = -1;
      let currentChapterId = -1;

      for (const v of kaand.verses) {
        if (v.sarg !== currentSarg) {
          currentSarg = v.sarg;
          const chapterTitle = `${kaand.kaand_name.split('_')[1]} - Sarg ${currentSarg}`;
          const resChapter = insertChapter.run(bookId, globalChapterIndex++, chapterTitle, chapterTitle);
          currentChapterId = Number(resChapter.lastInsertRowid);
        }

        insertVerse.run(bookId, currentChapterId, v.shloka, v.text.trim());
        totalVersesInserted++;
      }
    }

    console.log(`Inserted ${totalVersesInserted} true Valmiki Ramayana verses (pure Sanskrit).`);

    db.prepare('UPDATE books SET title = ?, title_hindi = ?, slug = ?, author = ?, description = ? WHERE id = ?').run(
      'Valmiki Ramayana',
      'वाल्मीकि रामायण',
      'valmiki-ramayana',
      'महर्षि वाल्मीकि',
      '100% प्रामाणिक वाल्मीकि रामायण (Verified Open Source Dataset)।',
      bookId
    );

    db.exec('COMMIT');
    console.log(`✅ Success! Valmiki Ramayana (ID: ${bookId}) is now 100% factual. Run batch-interpret.ts to translate.`);
  } catch (e) {
    db.exec('ROLLBACK');
    console.error('❌ Failed:', e);
  }
}

main();
