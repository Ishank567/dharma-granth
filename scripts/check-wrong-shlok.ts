import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '..', 'db', 'dharma.db');
const db = new Database(DB_PATH);

type ArtifactRow = { slug: string; verse_number: number; id: number; preview: string };
type ShortRow = { slug: string; id: number; verse_number: number; len: number; original_text: string };
type LongRow = { slug: string; id: number; verse_number: number; len: number; preview: string };
type DupRow = { book_id: number; verse_number: number; cnt: number; verse_ids: string; previews: string };
type NumberedRow = { slug: string; id: number; verse_number: number; preview: string };
type SampleRow = { verse_number: number; len: number; preview: string };

console.log('=== CHECKING FOR WRONG/BROKEN VERSES ===\n');

// 1. Verses with PDF/Page artifacts
const pdfArtifacts = db.prepare(`
  SELECT b.slug, b.title_hindi, v.id, v.verse_number, 
         length(v.original_text) as txt_len,
         substr(v.original_text, 1, 200) as preview
  FROM verses v
  JOIN books b ON b.id = v.book_id
  WHERE v.original_text LIKE '%Pdf%' 
     OR v.original_text LIKE '%PDF%'
     OR v.original_text LIKE '%Page %'
     OR v.original_text LIKE '%www.%'
     OR v.original_text LIKE '%http%'
  ORDER BY b.id, v.verse_number
  LIMIT 30
`).all() as ArtifactRow[];

console.log(`[1] PDF/Page artifacts found: ${pdfArtifacts.length}`);
for (const row of pdfArtifacts.slice(0, 10)) {
  console.log(`  ${row.slug} #${row.verse_number} (id=${row.id}): ${row.preview.substring(0, 80).replace(/\n/g, ' ')}...`);
}

// 2. Very short verses (< 20 chars) - likely extraction errors
const shortVerses = db.prepare(`
  SELECT b.slug, v.id, v.verse_number, 
         length(v.original_text) as len,
         v.original_text
  FROM verses v
  JOIN books b ON b.id = v.book_id
  WHERE length(v.original_text) < 20
  ORDER BY len ASC
  LIMIT 30
`).all() as ShortRow[];

console.log(`\n[2] Very short verses (<20 chars): ${shortVerses.length}`);
for (const row of shortVerses.slice(0, 10)) {
  console.log(`  ${row.slug} #${row.verse_number} (id=${row.id}, len=${row.len}): "${row.original_text}"`);
}

// 3. Very long verses (>5000 chars) - possible concatenation errors
const longVerses = db.prepare(`
  SELECT b.slug, v.id, v.verse_number, 
         length(v.original_text) as len,
         substr(v.original_text, 1, 100) as preview
  FROM verses v
  JOIN books b ON b.id = v.book_id
  WHERE length(v.original_text) > 5000
  ORDER BY len DESC
  LIMIT 20
`).all() as LongRow[];

console.log(`\n[3] Very long verses (>5000 chars): ${longVerses.length}`);
for (const row of longVerses.slice(0, 10)) {
  console.log(`  ${row.slug} #${row.verse_number} (id=${row.id}): ${row.len} chars - ${row.preview.substring(0, 60)}...`);
}

// 4. Duplicate verse numbers in same book
const dups = db.prepare(`
  SELECT book_id, verse_number, COUNT(*) as cnt,
         group_concat(id) as verse_ids,
         substr(group_concat(substr(original_text, 1, 30)), 1, 100) as previews
  FROM verses
  GROUP BY book_id, verse_number
  HAVING cnt > 1
  ORDER BY cnt DESC
  LIMIT 20
`).all() as DupRow[];

console.log(`\n[4] Duplicate verse numbers: ${dups.length} book/verse combos`);
for (const d of dups.slice(0, 10)) {
  const book = db.prepare('SELECT slug, title_hindi FROM books WHERE id = ?').get(d.book_id) as { slug: string; title_hindi: string };
  console.log(`  ${book.slug} (${book.title_hindi}) #${d.verse_number}: ${d.cnt} duplicates [ids: ${d.verse_ids}]`);
}

// 5. Verses with numbers/pagination markers
const numbered = db.prepare(`
  SELECT b.slug, v.id, v.verse_number, 
         substr(v.original_text, 1, 150) as preview
  FROM verses v
  JOIN books b ON b.id = v.book_id
  WHERE v.original_text GLOB '*[0-9][0-9][0-9]*' 
    AND (v.original_text LIKE '% 100 %' 
      OR v.original_text LIKE '% 200 %'
      OR v.original_text LIKE '%Page%'
      OR v.original_text GLOB '*|| [0-9]*')
  ORDER BY b.id, v.verse_number
  LIMIT 20
`).all() as NumberedRow[];

console.log(`\n[5] Verses with suspicious number patterns: ${numbered.length}`);
for (const row of numbered.slice(0, 8)) {
  console.log(`  ${row.slug} #${row.verse_number}: ${row.preview.substring(0, 80).replace(/\n/g, ' ')}...`);
}

// 6. Check specific book mentioned - vishnu-puran (largest remaining)
const vishnuCount = (db.prepare("SELECT COUNT(*) as c FROM verses WHERE book_id = (SELECT id FROM books WHERE slug = 'vishnu-puran')").get() as { c: number }).c;
console.log(`\n[6] Sample from vishnu-puran (largest book with ${vishnuCount} verses):`);
const vishnuSamples = db.prepare(`
  SELECT v.verse_number, length(v.original_text) as len,
         substr(v.original_text, 1, 200) as preview
  FROM verses v
  JOIN books b ON b.id = v.book_id
  WHERE b.slug = 'vishnu-puran'
  ORDER BY v.verse_number
  LIMIT 5
`).all() as SampleRow[];
for (const row of vishnuSamples) {
  console.log(`  #${row.verse_number} (len=${row.len}): ${row.preview.substring(0, 70).replace(/\n/g, ' ')}...`);
}

db.close();
console.log('\n=== SCAN COMPLETE ===');
