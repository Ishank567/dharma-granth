/**
 * Replaces the corrupt Gita Press OCR dump (book slug `srimad-bhagavad-gita`,
 * 152 verses of non-Unicode font mojibake) with the verified open-source
 * gita/gita dataset: 18 chapters, 700 Sanskrit verses with Devanagari,
 * transliteration, Hindi translation (Swami Ramsukhdas) and word meanings.
 *
 * Run with: npx tsx scripts/fix-gita-section.ts
 * Then run: npx tsx scripts/build-snapshots.ts  (regenerates public/data JSON)
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const STALE_SNAPSHOT = path.join(__dirname, '..', 'public', 'data', 'books', 'srimad-bhagavad-gita.json');

type Chapter = { chapter_number: number; name: string; name_translation: string };
type Verse = { id: number; chapter_number: number; text: string; transliteration: string; word_meanings: string };
type Translation = { verse_id: number; lang: string; author_id: number; description: string };

async function main() {
  const db = new Database(DB_PATH);

  console.log('Fetching verified Bhagavad Gita data from gita/gita...');
  const [chaptersRes, versesRes, translationsRes] = await Promise.all([
    fetch('https://raw.githubusercontent.com/gita/gita/main/data/chapters.json'),
    fetch('https://raw.githubusercontent.com/gita/gita/main/data/verse.json'),
    fetch('https://raw.githubusercontent.com/gita/gita/main/data/translation.json'),
  ]);
  const chaptersData = (await chaptersRes.json()) as Chapter[];
  const versesData = (await versesRes.json()) as Verse[];
  const translationsData = (await translationsRes.json()) as Translation[];
  console.log(`Fetched ${chaptersData.length} chapters, ${versesData.length} verses, ${translationsData.length} translations.`);

  const gitaCategory = db.prepare(`SELECT id FROM categories WHERE slug = 'gita'`).get() as { id: number } | undefined;
  if (!gitaCategory) throw new Error('gita category missing');

  db.exec('BEGIN TRANSACTION');
  try {
    const corrupt = db.prepare(`SELECT id FROM books WHERE slug = 'srimad-bhagavad-gita'`).get() as { id: number } | undefined;
    if (corrupt) {
      const vIds = (db.prepare(`SELECT id FROM verses WHERE book_id = ?`).all(corrupt.id) as { id: number }[]).map((r) => r.id);
      if (vIds.length) {
        const ph = vIds.map(() => '?').join(',');
        db.prepare(`DELETE FROM interpretations WHERE verse_id IN (${ph})`).run(...vIds);
      }
      db.prepare(`DELETE FROM verses WHERE book_id = ?`).run(corrupt.id);
      db.prepare(`DELETE FROM chapters WHERE book_id = ?`).run(corrupt.id);
      db.prepare(`DELETE FROM books WHERE id = ?`).run(corrupt.id);
      console.log(`Removed corrupt book id=${corrupt.id} (srimad-bhagavad-gita) and ${vIds.length} verses.`);
    }

    let clean = db.prepare(`SELECT id FROM books WHERE slug = 'bhagavad-gita'`).get() as { id: number } | undefined;
    if (clean) {
      const vIds = (db.prepare(`SELECT id FROM verses WHERE book_id = ?`).all(clean.id) as { id: number }[]).map((r) => r.id);
      if (vIds.length) {
        const ph = vIds.map(() => '?').join(',');
        db.prepare(`DELETE FROM interpretations WHERE verse_id IN (${ph})`).run(...vIds);
      }
      db.prepare(`DELETE FROM verses WHERE book_id = ?`).run(clean.id);
      db.prepare(`DELETE FROM chapters WHERE book_id = ?`).run(clean.id);
    } else {
      const res = db
        .prepare(
          `INSERT INTO books (category_id, title, title_hindi, slug, author, language, pdf_filename, total_pages, description, content_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ready')`
        )
        .run(
          gitaCategory.id,
          'Bhagavad Gita',
          'श्रीमद्भगवद्गीता',
          'bhagavad-gita',
          'महर्षि वेदव्यास',
          'संस्कृत/हिन्दी',
          'verified-dataset.json',
          700,
          '१८ अध्याय, ७०० श्लोक — प्रामाणिक संस्कृत पाठ, लिप्यन्तरण एवं हिन्दी अनुवाद (स्वामी रामसुखदास)।'
        );
      clean = { id: Number(res.lastInsertRowid) };
    }
    const bookId = clean.id;
    console.log(`Target book id=${bookId} (bhagavad-gita).`);

    const chapterIdByNumber = new Map<number, number>();
    const insertChapter = db.prepare(`INSERT INTO chapters (book_id, chapter_number, title, title_hindi) VALUES (?, ?, ?, ?)`);
    for (const ch of chaptersData) {
      const r = insertChapter.run(bookId, ch.chapter_number, ch.name_translation, ch.name);
      chapterIdByNumber.set(ch.chapter_number, Number(r.lastInsertRowid));
    }
    console.log(`Inserted ${chaptersData.length} chapters.`);

    const hindiByVerseId = new Map<number, Translation>();
    for (const t of translationsData) {
      if (t.lang !== 'hindi') continue;
      const existing = hindiByVerseId.get(t.verse_id);
      if (!existing || t.author_id === 11) hindiByVerseId.set(t.verse_id, t);
    }

    const insertVerse = db.prepare(
      `INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration) VALUES (?, ?, ?, ?, ?)`
    );
    const insertInterp = db.prepare(
      `INSERT INTO interpretations (verse_id, shabdarth, bhavarth, source) VALUES (?, ?, ?, 'verified_dataset')`
    );

    let globalVerseNumber = 1;
    for (const v of versesData) {
      const chapterId = chapterIdByNumber.get(v.chapter_number);
      if (!chapterId) throw new Error(`no chapter for verse ${v.id}`);
      const res = insertVerse.run(bookId, chapterId, globalVerseNumber++, v.text.trim(), (v.transliteration || '').trim());
      const newVerseId = Number(res.lastInsertRowid);
      const tr = hindiByVerseId.get(v.id);
      const bhavarth = tr ? tr.description.replace(/।।.*?।।/, '').trim() : '';
      insertInterp.run(newVerseId, v.word_meanings || '', bhavarth);
    }
    console.log(`Inserted ${versesData.length} verses with interpretations.`);

    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  if (fs.existsSync(STALE_SNAPSHOT)) {
    fs.unlinkSync(STALE_SNAPSHOT);
    console.log(`Removed stale snapshot ${path.basename(STALE_SNAPSHOT)}.`);
  }

  console.log('✅ Done. Now run: npx tsx scripts/build-snapshots.ts');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
