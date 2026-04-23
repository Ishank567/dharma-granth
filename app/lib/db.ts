import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DHARMA_DB_PATH || path.join(process.cwd(), 'db', 'dharma.db');

let db: Database.Database | null = null;
let schemaReady = false;

function ensureBookColumns(database: Database.Database) {
  const columns = database
    .prepare("PRAGMA table_info(books)")
    .all() as Array<{ name: string }>;
  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has('content_status')) {
    database.exec("ALTER TABLE books ADD COLUMN content_status TEXT NOT NULL DEFAULT 'ready'");
  }
}

function ensureInterpretationColumns(database: Database.Database) {
  const columns = database
    .prepare("PRAGMA table_info(interpretations)")
    .all() as Array<{ name: string }>;
  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has('guided_learning')) {
    database.exec("ALTER TABLE interpretations ADD COLUMN guided_learning TEXT DEFAULT ''");
  }

  if (!columnNames.has('scientific_temperament')) {
    database.exec("ALTER TABLE interpretations ADD COLUMN scientific_temperament TEXT DEFAULT ''");
  }

  if (!columnNames.has('simple_example')) {
    database.exec("ALTER TABLE interpretations ADD COLUMN simple_example TEXT DEFAULT ''");
  }

  if (!columnNames.has('next_curiosity')) {
    database.exec("ALTER TABLE interpretations ADD COLUMN next_curiosity TEXT DEFAULT ''");
  }
}

function ensureSchema(database: Database.Database) {
  if (schemaReady) {
    return;
  }

  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      title_hindi TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      author TEXT NOT NULL,
      language TEXT NOT NULL,
      pdf_filename TEXT NOT NULL,
      total_pages INTEGER DEFAULT 0,
      description TEXT NOT NULL,
      content_status TEXT NOT NULL DEFAULT 'ready',
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      chapter_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      title_hindi TEXT NOT NULL,
      FOREIGN KEY (book_id) REFERENCES books(id)
    );

    CREATE TABLE IF NOT EXISTS verses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      chapter_id INTEGER,
      verse_number INTEGER NOT NULL,
      original_text TEXT NOT NULL,
      transliteration TEXT DEFAULT '',
      translation_hindi TEXT DEFAULT '',
      translation_english TEXT DEFAULT '',
      page_number INTEGER DEFAULT 0,
      FOREIGN KEY (book_id) REFERENCES books(id),
      FOREIGN KEY (chapter_id) REFERENCES chapters(id)
    );

    CREATE TABLE IF NOT EXISTS interpretations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      verse_id INTEGER NOT NULL UNIQUE,
      shabdarth TEXT DEFAULT '',
      bhavarth TEXT DEFAULT '',
      simple_example TEXT DEFAULT '',
      guided_learning TEXT DEFAULT '',
      scientific_temperament TEXT DEFAULT '',
      modern_relevance TEXT DEFAULT '',
      next_curiosity TEXT DEFAULT '',
      source TEXT DEFAULT 'ai',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (verse_id) REFERENCES verses(id)
    );
  `);

  ensureBookColumns(database);
  ensureInterpretationColumns(database);

  database.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS verses_fts USING fts5(
      original_text,
      transliteration,
      translation_hindi,
      translation_english,
      content='verses',
      content_rowid='id'
    );
  `);

  const triggerExists = database.prepare(
    "SELECT name FROM sqlite_master WHERE type='trigger' AND name='verses_ai'"
  ).get();

  if (!triggerExists) {
    database.exec(`
      CREATE TRIGGER verses_ai AFTER INSERT ON verses BEGIN
        INSERT INTO verses_fts(rowid, original_text, transliteration, translation_hindi, translation_english)
        VALUES (new.id, new.original_text, new.transliteration, new.translation_hindi, new.translation_english);
      END;

      CREATE TRIGGER verses_ad AFTER DELETE ON verses BEGIN
        INSERT INTO verses_fts(verses_fts, rowid, original_text, transliteration, translation_hindi, translation_english)
        VALUES ('delete', old.id, old.original_text, old.transliteration, old.translation_hindi, old.translation_english);
      END;

      CREATE TRIGGER verses_au AFTER UPDATE ON verses BEGIN
        INSERT INTO verses_fts(verses_fts, rowid, original_text, transliteration, translation_hindi, translation_english)
        VALUES ('delete', old.id, old.original_text, old.transliteration, old.translation_hindi, old.translation_english);
        INSERT INTO verses_fts(rowid, original_text, transliteration, translation_hindi, translation_english)
        VALUES (new.id, new.original_text, new.transliteration, new.translation_hindi, new.translation_english);
      END;
    `);
  }

  schemaReady = true;
}

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  ensureSchema(db);
  return db;
}

export function initializeDb() {
  schemaReady = false;
  return getDb();
}

// === Query Functions ===

export function getAllCategories() {
  const db = getDb();
  return db.prepare(`
    SELECT c.*, COUNT(b.id) as book_count
    FROM categories c
    LEFT JOIN books b ON b.category_id = c.id AND b.content_status = 'ready'
    GROUP BY c.id
    ORDER BY c.id
  `).all();
}

export function getCategoryBySlug(slug: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug);
}

export function getBooksByCategory(categorySlug: string) {
  const db = getDb();
  return db.prepare(`
    SELECT b.*, c.name as category_name, c.slug as category_slug,
           (SELECT COUNT(*) FROM verses v WHERE v.book_id = b.id) as verse_count
    FROM books b
    JOIN categories c ON c.id = b.category_id
    WHERE c.slug = ? AND b.content_status = 'ready'
    ORDER BY b.title_hindi
  `).all(categorySlug);
}

export function getBookBySlug(slug: string) {
  const db = getDb();
  return db.prepare(`
    SELECT b.*, c.name as category_name, c.slug as category_slug
    FROM books b
    JOIN categories c ON c.id = b.category_id
    WHERE b.slug = ?
  `).get(slug);
}

export function getVersesByBook(bookId: number, limit = 50, offset = 0) {
  const db = getDb();
  return db.prepare(`
    SELECT v.*, ch.title as chapter_title, ch.title_hindi as chapter_title_hindi
    FROM verses v
    LEFT JOIN chapters ch ON ch.id = v.chapter_id
    WHERE v.book_id = ?
    ORDER BY v.verse_number
    LIMIT ? OFFSET ?
  `).all(bookId, limit, offset);
}

export function getVerseById(verseId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT v.*, b.title_hindi as book_title, b.slug as book_slug,
           c.slug as category_slug, ch.title_hindi as chapter_title
    FROM verses v
    JOIN books b ON b.id = v.book_id
    JOIN categories c ON c.id = b.category_id
    LEFT JOIN chapters ch ON ch.id = v.chapter_id
    WHERE v.id = ?
  `).get(verseId);
}

export function getVerseByBookAndNumber(bookId: number, verseNumber: number) {
  const db = getDb();
  return db.prepare(`
    SELECT v.*, b.title_hindi as book_title, b.slug as book_slug,
           c.slug as category_slug, ch.title_hindi as chapter_title
    FROM verses v
    JOIN books b ON b.id = v.book_id
    JOIN categories c ON c.id = b.category_id
    LEFT JOIN chapters ch ON ch.id = v.chapter_id
    WHERE v.book_id = ? AND v.verse_number = ?
  `).get(bookId, verseNumber);
}

export function getTotalVerseCount(bookId: number): number {
  const db = getDb();
  const result = db.prepare('SELECT COUNT(*) as count FROM verses WHERE book_id = ?').get(bookId) as { count: number };
  return result.count;
}

export function searchVerses(query: string, limit = 30, offset = 0, categorySlug?: string) {
  const db = getDb();
  const sanitized = query.replace(/['"]/g, '');
  if (categorySlug) {
    return db.prepare(`
      SELECT v.id, v.verse_number, v.original_text, v.translation_hindi,
             b.title_hindi as book_title, b.slug as book_slug,
             c.slug as category_slug,
             rank
      FROM verses_fts fts
      JOIN verses v ON v.id = fts.rowid
      JOIN books b ON b.id = v.book_id
      JOIN categories c ON c.id = b.category_id
      WHERE verses_fts MATCH ? AND c.slug = ? AND b.content_status = 'ready'
      ORDER BY rank
      LIMIT ? OFFSET ?
    `).all(sanitized, categorySlug, limit, offset);
  }
  return db.prepare(`
    SELECT v.id, v.verse_number, v.original_text, v.translation_hindi,
           b.title_hindi as book_title, b.slug as book_slug,
           c.slug as category_slug,
           rank
    FROM verses_fts fts
    JOIN verses v ON v.id = fts.rowid
    JOIN books b ON b.id = v.book_id
    JOIN categories c ON c.id = b.category_id
    WHERE verses_fts MATCH ? AND b.content_status = 'ready'
    ORDER BY rank
    LIMIT ? OFFSET ?
  `).all(sanitized, limit, offset);
}

export function searchVersesCount(query: string, categorySlug?: string): number {
  const db = getDb();
  const sanitized = query.replace(/['"]/g, '');
  if (categorySlug) {
    const result = db.prepare(`
      SELECT COUNT(*) as count
      FROM verses_fts fts
      JOIN verses v ON v.id = fts.rowid
      JOIN books b ON b.id = v.book_id
      JOIN categories c ON c.id = b.category_id
      WHERE verses_fts MATCH ? AND c.slug = ? AND b.content_status = 'ready'
    `).get(sanitized, categorySlug) as { count: number };
    return result.count;
  }
  const result = db.prepare(`
    SELECT COUNT(*) as count
    FROM verses_fts fts
    JOIN verses v ON v.id = fts.rowid
    JOIN books b ON b.id = v.book_id
    WHERE verses_fts MATCH ? AND b.content_status = 'ready'
  `).get(sanitized) as { count: number };
  return result.count;
}

export function getChaptersByBook(bookId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT ch.id, ch.chapter_number, ch.title, ch.title_hindi,
           COUNT(v.id) as verse_count,
           COALESCE((
             SELECT COUNT(*) FROM verses v2
             WHERE v2.book_id = ch.book_id
             AND v2.verse_number < COALESCE(
               (SELECT MIN(v3.verse_number) FROM verses v3 WHERE v3.chapter_id = ch.id), 0
             )
           ), 0) as verse_offset
    FROM chapters ch
    LEFT JOIN verses v ON v.chapter_id = ch.id
    WHERE ch.book_id = ?
    GROUP BY ch.id
    ORDER BY ch.chapter_number
  `).all(bookId);
}

export function getBookVerseCount(bookId: number): number {
  const db = getDb();
  const result = db.prepare('SELECT COUNT(*) as count FROM verses WHERE book_id = ?').get(bookId) as { count: number };
  return result.count;
}

export function getRandomVerse() {
  const db = getDb();
  return db.prepare(`
    SELECT v.*, b.title_hindi as book_title, b.slug as book_slug,
           c.slug as category_slug
    FROM verses v
    JOIN books b ON b.id = v.book_id
    JOIN categories c ON c.id = b.category_id
    WHERE length(v.original_text) > 20 AND b.content_status = 'ready'
    ORDER BY RANDOM()
    LIMIT 1
  `).get();
}

export function getInterpretation(verseId: number) {
  const db = getDb();
  return db.prepare('SELECT * FROM interpretations WHERE verse_id = ?').get(verseId);
}

export function saveInterpretation(
  verseId: number,
  shabdarth: string,
  bhavarth: string,
  guidedLearning: string,
  scientificTemperament: string,
  modernRelevance: string,
  source = 'ai',
  simpleExample = '',
  nextCuriosity = ''
) {
  const db = getDb();
  return db.prepare(`
    INSERT OR REPLACE INTO interpretations (
      verse_id,
      shabdarth,
      bhavarth,
      simple_example,
      guided_learning,
      scientific_temperament,
      modern_relevance,
      next_curiosity,
      source
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    verseId,
    shabdarth,
    bhavarth,
    simpleExample,
    guidedLearning,
    scientificTemperament,
    modernRelevance,
    nextCuriosity,
    source
  );
}

export function getStats() {
  const db = getDb();
  const categories = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  const books = db.prepare("SELECT COUNT(*) as count FROM books WHERE content_status = 'ready'").get() as { count: number };
  const verses = db.prepare(`
    SELECT COUNT(*) as count FROM verses v
    JOIN books b ON b.id = v.book_id
    WHERE b.content_status = 'ready'
  `).get() as { count: number };
  return {
    categories: categories.count,
    books: books.count,
    verses: verses.count,
  };
}
