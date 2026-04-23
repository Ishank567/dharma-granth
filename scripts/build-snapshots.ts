/**
 * Reads db/dharma.db and emits static JSON snapshots under public/data/.
 *
 *   public/data/catalog.json         — categories + all books (id, slug, titles, metadata, verse counts)
 *   public/data/books/<slug>.json    — book metadata + verses + interpretations keyed by verse_id
 *
 * Runs as part of `npm run build`. If the DB file is missing (Vercel/Pages runners that
 * don't carry dharma.db), the script exits 0 without touching the filesystem — the
 * previously-generated JSON that's committed to the repo is what ships.
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_PATH = process.env.DHARMA_DB_PATH || path.join(process.cwd(), 'db', 'dharma.db');
const OUT_DIR = path.join(process.cwd(), 'public', 'data');
const BOOKS_DIR = path.join(OUT_DIR, 'books');

if (!fs.existsSync(DB_PATH)) {
  console.log(`[snapshots] ${DB_PATH} not found — skipping (using committed JSON).`);
  process.exit(0);
}

fs.mkdirSync(BOOKS_DIR, { recursive: true });

const db = new Database(DB_PATH, { readonly: true });

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

type BookRow = {
  id: number;
  category_id: number;
  title: string;
  title_hindi: string;
  slug: string;
  author: string;
  language: string;
  pdf_filename: string;
  total_pages: number;
  description: string;
  content_status: string;
};

type ChapterRow = {
  id: number;
  book_id: number;
  chapter_number: number;
  title: string;
  title_hindi: string;
};

type VerseRow = {
  id: number;
  book_id: number;
  chapter_id: number | null;
  verse_number: number;
  original_text: string;
  transliteration: string | null;
  translation_hindi: string | null;
  translation_english: string | null;
  page_number: number | null;
};

type InterpretationRow = {
  id: number;
  verse_id: number;
  shabdarth: string | null;
  bhavarth: string | null;
  simple_example: string | null;
  guided_learning: string | null;
  scientific_temperament: string | null;
  modern_relevance: string | null;
  next_curiosity: string | null;
  source: string | null;
  created_at: string | null;
};

const categories = db.prepare('SELECT * FROM categories ORDER BY id').all() as CategoryRow[];
const books = db.prepare('SELECT * FROM books ORDER BY category_id, id').all() as BookRow[];

const verseCountByBook = new Map<number, number>();
for (const row of db
  .prepare('SELECT book_id, COUNT(*) AS c FROM verses GROUP BY book_id')
  .all() as Array<{ book_id: number; c: number }>) {
  verseCountByBook.set(row.book_id, row.c);
}

const categoriesOut = categories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  icon: cat.icon,
  book_count: books.filter((b) => b.category_id === cat.id && b.content_status === 'ready').length,
}));

const booksOut = books.map((book) => ({
  id: book.id,
  category_id: book.category_id,
  category_slug: categories.find((c) => c.id === book.category_id)?.slug ?? '',
  category_name: categories.find((c) => c.id === book.category_id)?.name ?? '',
  title: book.title,
  title_hindi: book.title_hindi,
  slug: book.slug,
  author: book.author,
  language: book.language,
  pdf_filename: book.pdf_filename,
  total_pages: book.total_pages,
  description: book.description,
  content_status: book.content_status,
  verse_count: verseCountByBook.get(book.id) ?? 0,
}));

const stats = {
  categories: categories.length,
  books: books.filter((b) => b.content_status === 'ready').length,
  verses: (db.prepare(
    "SELECT COUNT(*) AS c FROM verses v JOIN books b ON b.id = v.book_id WHERE b.content_status = 'ready'",
  ).get() as { c: number }).c,
};

const catalog = {
  generated_at: new Date().toISOString(),
  stats,
  categories: categoriesOut,
  books: booksOut,
};

fs.writeFileSync(path.join(OUT_DIR, 'catalog.json'), JSON.stringify(catalog));
console.log(`[snapshots] catalog.json written: ${categoriesOut.length} categories, ${booksOut.length} books.`);

const chaptersByBook = new Map<number, ChapterRow[]>();
for (const ch of db
  .prepare('SELECT * FROM chapters ORDER BY book_id, chapter_number')
  .all() as ChapterRow[]) {
  const list = chaptersByBook.get(ch.book_id) ?? [];
  list.push(ch);
  chaptersByBook.set(ch.book_id, list);
}

const versesStmt = db.prepare(
  'SELECT * FROM verses WHERE book_id = ? ORDER BY verse_number, id',
);
const interpStmt = db.prepare(
  `SELECT i.* FROM interpretations i
   JOIN verses v ON v.id = i.verse_id
   WHERE v.book_id = ?`,
);

let totalWritten = 0;
for (const book of books) {
  if (book.content_status !== 'ready') continue;
  const verses = versesStmt.all(book.id) as VerseRow[];
  const interpretations = interpStmt.all(book.id) as InterpretationRow[];

  const interpByVerseId: Record<number, InterpretationRow> = {};
  for (const i of interpretations) interpByVerseId[i.verse_id] = i;

  const bookOut = {
    ...booksOut.find((b) => b.id === book.id),
    chapters: chaptersByBook.get(book.id) ?? [],
    verses,
    interpretations: interpByVerseId,
  };

  fs.writeFileSync(path.join(BOOKS_DIR, `${book.slug}.json`), JSON.stringify(bookOut));
  totalWritten++;
}

console.log(`[snapshots] ${totalWritten} book snapshots written to public/data/books/.`);

type SearchDoc = {
  id: number;
  book_slug: string;
  category_slug: string;
  book_title: string;
  verse_number: number;
  text: string;
  translation: string;
};

const searchDocs: SearchDoc[] = [];
const searchVerseStmt = db.prepare(
  `SELECT v.id, v.verse_number,
          substr(v.original_text, 1, 300) AS text,
          substr(COALESCE(v.translation_hindi, ''), 1, 300) AS translation,
          b.slug AS book_slug,
          b.title_hindi AS book_title,
          c.slug AS category_slug
   FROM verses v
   JOIN books b ON b.id = v.book_id
   JOIN categories c ON c.id = b.category_id
   WHERE b.content_status = 'ready' AND length(v.original_text) > 3`,
);
for (const row of searchVerseStmt.iterate() as IterableIterator<SearchDoc>) {
  searchDocs.push(row);
}

fs.writeFileSync(path.join(OUT_DIR, 'search-index.json'), JSON.stringify(searchDocs));
console.log(`[snapshots] search-index.json written: ${searchDocs.length} docs.`);

db.close();
