/**
 * One-time migration: replay local SQLite into a Turso DB.
 *
 * Prerequisites:
 *   1. Create a Turso DB:  turso db create dharma-granth
 *   2. Get URL + token:     turso db show dharma-granth --url
 *                           turso db tokens create dharma-granth
 *   3. Export them:         TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/migrate-to-turso.ts
 *
 * The script:
 *   - Opens the local db/dharma.db read-only.
 *   - Creates the schema (categories/books/chapters/verses/interpretations + verses_fts) on Turso.
 *   - Streams rows from each table in batches and inserts them via libSQL.
 *
 * Idempotency: tables are created IF NOT EXISTS, but rows are inserted with INSERT OR REPLACE
 * on primary key so re-running is safe.
 */

import 'dotenv/config';
import Database from 'better-sqlite3';
import path from 'path';
import { createClient } from '@libsql/client';

const LOCAL_DB = process.env.DHARMA_DB_PATH || path.join(process.cwd(), 'db', 'dharma.db');
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error('TURSO_DATABASE_URL is required');
  process.exit(1);
}

const BATCH_SIZE = 200;

async function main() {
  const src = new Database(LOCAL_DB, { readonly: true });
  const dst = createClient({ url: url!, authToken });

  console.log('Creating schema on Turso...');
  await dst.batch(
    [
      `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        category_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        title_hindi TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        author TEXT NOT NULL,
        language TEXT NOT NULL,
        pdf_filename TEXT NOT NULL,
        total_pages INTEGER DEFAULT 0,
        description TEXT NOT NULL,
        content_status TEXT NOT NULL DEFAULT 'ready'
      )`,
      `CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY,
        book_id INTEGER NOT NULL,
        chapter_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        title_hindi TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS verses (
        id INTEGER PRIMARY KEY,
        book_id INTEGER NOT NULL,
        chapter_id INTEGER,
        verse_number INTEGER NOT NULL,
        original_text TEXT NOT NULL,
        transliteration TEXT DEFAULT '',
        translation_hindi TEXT DEFAULT '',
        translation_english TEXT DEFAULT '',
        page_number INTEGER DEFAULT 0
      )`,
      `CREATE TABLE IF NOT EXISTS interpretations (
        id INTEGER PRIMARY KEY,
        verse_id INTEGER NOT NULL UNIQUE,
        shabdarth TEXT DEFAULT '',
        bhavarth TEXT DEFAULT '',
        simple_example TEXT DEFAULT '',
        guided_learning TEXT DEFAULT '',
        scientific_temperament TEXT DEFAULT '',
        modern_relevance TEXT DEFAULT '',
        next_curiosity TEXT DEFAULT '',
        source TEXT DEFAULT 'ai',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_books_category ON books(category_id)`,
      `CREATE INDEX IF NOT EXISTS idx_verses_book ON verses(book_id)`,
      `CREATE INDEX IF NOT EXISTS idx_verses_chapter ON verses(chapter_id)`,
      `CREATE INDEX IF NOT EXISTS idx_chapters_book ON chapters(book_id)`,
    ],
    'write',
  );

  const tables: Array<{
    name: string;
    columns: string[];
  }> = [
    { name: 'categories', columns: ['id', 'name', 'slug', 'description', 'icon'] },
    {
      name: 'books',
      columns: [
        'id', 'category_id', 'title', 'title_hindi', 'slug', 'author',
        'language', 'pdf_filename', 'total_pages', 'description', 'content_status',
      ],
    },
    { name: 'chapters', columns: ['id', 'book_id', 'chapter_number', 'title', 'title_hindi'] },
    {
      name: 'verses',
      columns: [
        'id', 'book_id', 'chapter_id', 'verse_number', 'original_text',
        'transliteration', 'translation_hindi', 'translation_english', 'page_number',
      ],
    },
    {
      name: 'interpretations',
      columns: [
        'id', 'verse_id', 'shabdarth', 'bhavarth', 'simple_example', 'guided_learning',
        'scientific_temperament', 'modern_relevance', 'next_curiosity', 'source', 'created_at',
      ],
    },
  ];

  for (const { name, columns } of tables) {
    const total = (src.prepare(`SELECT COUNT(*) AS c FROM ${name}`).get() as { c: number }).c;
    if (total === 0) {
      console.log(`${name}: 0 rows, skipping`);
      continue;
    }
    console.log(`${name}: migrating ${total} rows...`);
    const placeholders = columns.map(() => '?').join(',');
    const sql = `INSERT OR REPLACE INTO ${name} (${columns.join(',')}) VALUES (${placeholders})`;

    const rows = src.prepare(`SELECT ${columns.join(',')} FROM ${name}`).iterate();
    let batch: Array<{ sql: string; args: unknown[] }> = [];
    let done = 0;
    for (const row of rows as IterableIterator<Record<string, unknown>>) {
      batch.push({ sql, args: columns.map((col) => row[col] ?? null) });
      if (batch.length >= BATCH_SIZE) {
        await dst.batch(batch, 'write');
        done += batch.length;
        process.stdout.write(`  ${name}: ${done}/${total}\r`);
        batch = [];
      }
    }
    if (batch.length > 0) {
      await dst.batch(batch, 'write');
      done += batch.length;
    }
    console.log(`  ${name}: ${done}/${total} done`);
  }

  console.log('Creating FTS index...');
  await dst.batch(
    [
      `DROP TABLE IF EXISTS verses_fts`,
      `CREATE VIRTUAL TABLE verses_fts USING fts5(
        original_text, transliteration, translation_hindi, translation_english,
        content='verses', content_rowid='id'
      )`,
      `INSERT INTO verses_fts(rowid, original_text, transliteration, translation_hindi, translation_english)
        SELECT id, original_text, transliteration, translation_hindi, translation_english FROM verses`,
    ],
    'write',
  );

  console.log('Migration complete.');
  src.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
