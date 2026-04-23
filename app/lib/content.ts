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
  content_status: 'ready' | 'ocr_pending';
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

export function getCategoryBySlug(slug: string): (Category & { book_count: number }) | undefined {
  return loadCatalog()?.categories.find((c) => c.slug === slug);
}

export function getBooksByCategory(categorySlug: string): CatalogBook[] {
  const catalog = loadCatalog();
  if (!catalog) return [];
  return catalog.books
    .filter((b) => b.category_slug === categorySlug && b.content_status === 'ready')
    .sort((a, b) => a.title_hindi.localeCompare(b.title_hindi, 'hi'));
}

export type BookSnapshot = {
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
  content_status: 'ready' | 'ocr_pending';
  verse_count: number;
  chapters: Array<{
    id: number;
    book_id: number;
    chapter_number: number;
    title: string;
    title_hindi: string;
  }>;
  verses: Verse[];
  interpretations: Record<number, {
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
  }>;
};

const bookCache = new Map<string, BookSnapshot | null>();

export function getBookBySlug(slug: string): BookSnapshot | null {
  if (bookCache.has(slug)) return bookCache.get(slug) ?? null;
  const file = path.join(DATA_DIR, 'books', `${slug}.json`);
  if (!fs.existsSync(file)) {
    bookCache.set(slug, null);
    return null;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as BookSnapshot;
  bookCache.set(slug, data);
  return data;
}

export type VerseDetail = {
  verse: Verse;
  book: BookSnapshot;
  interpretation: BookSnapshot['interpretations'][number] | null;
  prevVerseId: number | null;
  nextVerseId: number | null;
  totalVerses: number;
};

export function getVerseDetail(bookSlug: string, verseId: number): VerseDetail | null {
  const book = getBookBySlug(bookSlug);
  if (!book) return null;
  const idx = book.verses.findIndex((v) => v.id === verseId);
  if (idx === -1) return null;
  const verse = book.verses[idx];
  const interpretation = book.interpretations[verseId] ?? null;
  // Adjacent verses that also have an interpretation — ensures links don't 404
  // on a static export where only interpreted verses emit HTML.
  let prevVerseId: number | null = null;
  for (let i = idx - 1; i >= 0; i--) {
    if (book.interpretations[book.verses[i].id]) {
      prevVerseId = book.verses[i].id;
      break;
    }
  }
  let nextVerseId: number | null = null;
  for (let i = idx + 1; i < book.verses.length; i++) {
    if (book.interpretations[book.verses[i].id]) {
      nextVerseId = book.verses[i].id;
      break;
    }
  }
  return {
    verse,
    book,
    interpretation,
    prevVerseId,
    nextVerseId,
    totalVerses: book.verses.length,
  };
}

/**
 * Enumerate (category, bookId, verseId) tuples for every verse that has an
 * interpretation. Used by generateStaticParams on the verse detail page so
 * GitHub Pages emits HTML only for the curated subset.
 */
export function getInterpretedVerseParams(): Array<{
  category: string;
  bookId: string;
  verseId: string;
}> {
  const catalog = loadCatalog();
  if (!catalog) return [];
  const params: Array<{ category: string; bookId: string; verseId: string }> = [];
  for (const bookMeta of catalog.books) {
    if (bookMeta.content_status !== 'ready') continue;
    const book = getBookBySlug(bookMeta.slug);
    if (!book) continue;
    for (const verseId of Object.keys(book.interpretations)) {
      params.push({
        category: bookMeta.category_slug,
        bookId: bookMeta.slug,
        verseId,
      });
    }
  }
  return params;
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
