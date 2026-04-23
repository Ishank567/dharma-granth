import { createClient, type Client } from '@libsql/client';
import type { Category, Verse } from './types';

let client: Client | null = null;

function getClient(): Client {
  if (client) return client;
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error('TURSO_DATABASE_URL is not set');
  }
  client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return client;
}

export function isLibsqlEnabled(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

export async function getAllCategoriesAsync(): Promise<Category[]> {
  const result = await getClient().execute(`
    SELECT c.id, c.name, c.slug, c.description, c.icon,
           COUNT(b.id) AS book_count
    FROM categories c
    LEFT JOIN books b
      ON b.category_id = c.id AND b.content_status = 'ready'
    GROUP BY c.id
    ORDER BY c.id
  `);
  return result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description),
    icon: String(row.icon),
    book_count: Number(row.book_count),
  }));
}

export async function getStatsAsync(): Promise<{
  categories: number;
  books: number;
  verses: number;
}> {
  const c = getClient();
  const [cats, books, verses] = await Promise.all([
    c.execute('SELECT COUNT(*) AS count FROM categories'),
    c.execute("SELECT COUNT(*) AS count FROM books WHERE content_status = 'ready'"),
    c.execute(`
      SELECT COUNT(*) AS count FROM verses v
      JOIN books b ON b.id = v.book_id
      WHERE b.content_status = 'ready'
    `),
  ]);
  return {
    categories: Number(cats.rows[0]?.count ?? 0),
    books: Number(books.rows[0]?.count ?? 0),
    verses: Number(verses.rows[0]?.count ?? 0),
  };
}

export async function getRandomVerseAsync(): Promise<Verse | null> {
  const result = await getClient().execute(`
    SELECT v.id, v.book_id, v.chapter_id, v.verse_number,
           v.original_text, v.transliteration,
           v.translation_hindi, v.translation_english, v.page_number,
           b.title_hindi AS book_title, b.slug AS book_slug,
           c.slug AS category_slug
    FROM verses v
    JOIN books b ON b.id = v.book_id
    JOIN categories c ON c.id = b.category_id
    WHERE length(v.original_text) > 20 AND b.content_status = 'ready'
    ORDER BY RANDOM()
    LIMIT 1
  `);
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: Number(row.id),
    book_id: Number(row.book_id),
    chapter_id: row.chapter_id == null ? null : Number(row.chapter_id),
    verse_number: Number(row.verse_number),
    original_text: String(row.original_text),
    transliteration: String(row.transliteration ?? ''),
    translation_hindi: String(row.translation_hindi ?? ''),
    translation_english: String(row.translation_english ?? ''),
    page_number: Number(row.page_number ?? 0),
    book_title: row.book_title == null ? undefined : String(row.book_title),
    book_slug: row.book_slug == null ? undefined : String(row.book_slug),
    category_slug: row.category_slug == null ? undefined : String(row.category_slug),
  };
}
