import fs from 'fs';
import path from 'path';
import type { Category, Verse } from './types';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

export type CatalogBook = {
  id: number;
  category_id: number;
  category_slug: string;
  category_name: string;
  title: string;
  title_hindi: string;
  slug: string;
  author: string;
  language: string;
  pdf_filename: string;
  total_pages: number;
  description: string;
  content_status: string;
  verse_count: number;
};

export type Catalog = {
  generated_at: string;
  stats: { categories: number; books: number; verses: number };
  categories: Array<Category & { book_count: number }>;
  books: CatalogBook[];
};

let cached: Catalog | null = null;

function loadCatalog(): Catalog | null {
  if (cached) return cached;
  const file = path.join(DATA_DIR, 'catalog.json');
  if (!fs.existsSync(file)) return null;
  cached = JSON.parse(fs.readFileSync(file, 'utf8')) as Catalog;
  return cached;
}

export function getAllCategories(): Array<Category & { book_count: number }> {
  return loadCatalog()?.categories ?? [];
}

export function getStats(): { categories: number; books: number; verses: number } {
  return loadCatalog()?.stats ?? { categories: 0, books: 0, verses: 0 };
}

export function getRandomVerse(): Verse | null {
  const catalog = loadCatalog();
  if (!catalog) return null;
  const readyBooks = catalog.books.filter((b) => b.content_status === 'ready' && b.verse_count > 0);
  if (readyBooks.length === 0) return null;
  const book = readyBooks[Math.floor(Math.random() * readyBooks.length)];
  const bookFile = path.join(DATA_DIR, 'books', `${book.slug}.json`);
  if (!fs.existsSync(bookFile)) return null;
  const bookData = JSON.parse(fs.readFileSync(bookFile, 'utf8')) as {
    verses: Verse[];
  };
  const eligible = bookData.verses.filter((v) => (v.original_text ?? '').length > 20);
  if (eligible.length === 0) return null;
  const v = eligible[Math.floor(Math.random() * eligible.length)];
  return {
    ...v,
    book_title: book.title_hindi,
    book_slug: book.slug,
    category_slug: book.category_slug,
  };
}
