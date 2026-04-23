/**
 * Test Search Functionality
 * ==========================
 * Verifies FTS5 search works with Hindi/Sanskrit text
 */

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');

interface SearchResult {
  verse_id: number;
  original_text: string;
  book_title: string;
  rank: number;
}

function testSearch(db: Database.Database, query: string, description: string) {
  console.log(`\n🔍 ${description}`);
  console.log(`   Query: "${query}"`);

  try {
    const results = db.prepare(`
      SELECT v.id as verse_id, v.original_text, b.title as book_title, rank
      FROM verses_fts
      JOIN verses v ON verses_fts.rowid = v.id
      JOIN books b ON v.book_id = b.id
      WHERE verses_fts MATCH ?
      ORDER BY rank
      LIMIT 5
    `).all(query) as SearchResult[];

    if (results.length === 0) {
      console.log('   ❌ No results');
      return false;
    }

    console.log(`   ✅ Found ${results.length} results`);
    results.slice(0, 3).forEach((r, i) => {
      const text = r.original_text?.substring(0, 60) || 'N/A';
      console.log(`      ${i + 1}. [${r.book_title}] ${text}...`);
    });
    return true;
  } catch (e) {
    console.log(`   ❌ Error: ${(e as Error).message}`);
    return false;
  }
}

function main() {
  console.log('=== SEARCH FUNCTIONALITY TEST ===\n');

  const db = new Database(DB_PATH);

  // Test 1: Basic Hindi word
  testSearch(db, 'आत्मा', 'Hindi: आत्मा (Atma/Soul)');

  // Test 2: Sanskrit word
  testSearch(db, 'ब्रह्म', 'Sanskrit: ब्रह्म (Brahman)');

  // Test 3: Common phrase
  testSearch(db, 'धर्म', 'Hindi: धर्म (Dharma)');

  // Test 4: Gita reference
  testSearch(db, 'कर्म', 'Hindi: कर्म (Karma)');

  // Test 5: Full-text search phrase
  testSearch(db, 'मोक्ष', 'Hindi: मोक्ष (Moksha)');

  // Test 6: Check FTS5 index status
  console.log('\n📊 FTS5 Index Status:');
  const ftsCount = (db.prepare('SELECT COUNT(*) as c FROM verses_fts').get() as { c: number }).c;
  const verseCount = (db.prepare('SELECT COUNT(*) as c FROM verses').get() as { c: number }).c;
  console.log(`   FTS5 indexed: ${ftsCount.toLocaleString()}`);
  console.log(`   Total verses: ${verseCount.toLocaleString()}`);
  console.log(`   Status: ${ftsCount === verseCount ? '✅ Complete' : '⚠️ Partial'}`);

  // Test 7: Performance check
  console.log('\n⏱️  Performance Test:');
  const start = Date.now();
  db.prepare("SELECT * FROM verses_fts WHERE verses_fts MATCH 'आत्मा'").all();
  const elapsed = Date.now() - start;
  console.log(`   Search time: ${elapsed}ms`);
  console.log(`   Status: ${elapsed < 100 ? '✅ Fast' : elapsed < 500 ? '⚠️ Okay' : '❌ Slow'}`);

  db.close();
  console.log('\n=== END SEARCH TEST ===');
}

main();
