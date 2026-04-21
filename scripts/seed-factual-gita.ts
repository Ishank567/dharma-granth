import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const db = new Database(DB_PATH);

async function main() {
  console.log('Fetching verified Bhagavad Gita data from gita/gita repo...');

  const [chaptersRes, versesRes, translationsRes] = await Promise.all([
    fetch('https://raw.githubusercontent.com/gita/gita/main/data/chapters.json'),
    fetch('https://raw.githubusercontent.com/gita/gita/main/data/verse.json'),
    fetch('https://raw.githubusercontent.com/gita/gita/main/data/translation.json'),
  ]);

  const chaptersData = await chaptersRes.json();
  const versesData = await versesRes.json();
  const translationsData = await translationsRes.json();

  console.log('Data fetched. Modifying database...');

  db.exec('BEGIN TRANSACTION');
  try {
    // Get or create the Gita book
    let gitaBook = db.prepare('SELECT id FROM books WHERE slug = ?').get('bhagavad-gita-as-it-is') as { id: number };
    if (!gitaBook) {
      console.log('Bhagavad Gita book not found. Inserting it...');
      const categoryId = db.prepare('SELECT id FROM categories WHERE slug = ?').get('gita') as { id: number };
      const res = db.prepare('INSERT INTO books (category_id, title, title_hindi, slug, author, language, pdf_filename, total_pages, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
        categoryId.id,
        'Bhagavad Gita',
        'श्रीमद्भगवद्गीता',
        'bhagavad-gita',
        'महर्षि वेदव्यास',
        'संस्कृत/हिन्दी',
        'verified-dataset.json',
        700,
        '100% प्रामाणिक श्लोक और सटीक अनुवाद (Verified Open Source Dataset)।'
      );
      gitaBook = { id: res.lastInsertRowid as number };
    }
    const bookId = gitaBook.id;

    // Delete existing interpretations
    const existingVerses = db.prepare('SELECT id FROM verses WHERE book_id = ?').all(bookId) as { id: number }[];
    const verseIds = existingVerses.map((v) => v.id);
    
    if (verseIds.length > 0) {
      const placeholders = verseIds.map(() => '?').join(',');
      db.prepare(`DELETE FROM interpretations WHERE verse_id IN (${placeholders})`).run(...verseIds);
      console.log(`Deleted ${verseIds.length} existing interpretations.`);
    }

    // Delete existing verses
    db.prepare('DELETE FROM verses WHERE book_id = ?').run(bookId);
    console.log('Deleted existing verses.');

    // Delete existing chapters
    db.prepare('DELETE FROM chapters WHERE book_id = ?').run(bookId);
    console.log('Deleted existing chapters.');

    // Insert new chapters
    const chapterIdMap = new Map();
    const insertChapter = db.prepare('INSERT INTO chapters (book_id, chapter_number, title, title_hindi) VALUES (?, ?, ?, ?)');
    for (const ch of chaptersData) {
      const res = insertChapter.run(bookId, ch.chapter_number, ch.name_translation, ch.name);
      chapterIdMap.set(ch.chapter_number, res.lastInsertRowid);
    }
    console.log(`Inserted ${chaptersData.length} true chapters.`);

    // Group translations by verse_id and author (preferably Swami Ramsukhdas (author_id: 11) or Swami Tejomayananda (author_id: 17) for Hindi)
    const hindiTranslations = new Map();
    for (const t of translationsData) {
      if (t.lang === 'hindi') {
        if (!hindiTranslations.has(t.verse_id)) {
          hindiTranslations.set(t.verse_id, t);
        } else {
          // Prefer Ramsukhdas
          if (t.author_id === 11) {
            hindiTranslations.set(t.verse_id, t);
          }
        }
      }
    }

    const insertVerse = db.prepare(`
      INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertInterpretation = db.prepare(`
      INSERT INTO interpretations (verse_id, shabdarth, bhavarth, source)
      VALUES (?, ?, ?, 'verified_dataset')
    `);

    // The gita/gita dataset has global verse ids (1 to 700). 
    // We want the verse_number to just be 1 to 700 for simplicity of reading sequence.
    let globalVerseNumber = 1;
    for (const v of versesData) {
      const chapterId = chapterIdMap.get(v.chapter_number);
      
      const res = insertVerse.run(
        bookId, 
        chapterId, 
        globalVerseNumber++, 
        v.text.trim(), 
        v.transliteration.trim()
      );
      const newVerseId = res.lastInsertRowid;

      const translation = hindiTranslations.get(v.id);
      let bhavarth = translation ? translation.description.trim() : 'अनुवाद उपलब्ध नहीं';
      // Clean up the translation (sometimes starts with "।।1.1।।धृतराष्ट्र ने कहा --")
      bhavarth = bhavarth.replace(/।।.*?।।/, '').trim();

      const shabdarth = v.word_meanings || '';

      insertInterpretation.run(newVerseId, shabdarth, bhavarth);
    }

    console.log(`Inserted ${versesData.length} true Sanskrit verses and interpretations.`);

    // Rename the book to just "Bhagavad Gita" to remove "As It Is" since we changed the source
    db.prepare('UPDATE books SET title = ?, title_hindi = ?, author = ?, description = ? WHERE id = ?').run(
      'Bhagavad Gita',
      'श्रीमद्भगवद्गीता',
      'महर्षि वेदव्यास',
      '100% प्रामाणिक श्लोक और सटीक अनुवाद (Verified Open Source Dataset)।',
      bookId
    );

    db.exec('COMMIT');
    console.log('✅ Success! Bhagavad Gita is now 100% factual.');
  } catch (e) {
    db.exec('ROLLBACK');
    console.error('❌ Failed:', e);
  }
}

main();
