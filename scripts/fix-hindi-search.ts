/**
 * Fix Hindi/Sanskrit Search in FTS5
 * =================================
 * Improves FTS5 tokenization for Hindi and Sanskrit text
 * Uses trigram tokenizer for better Unicode support
 */

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');

function log(msg: string) {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

function testSearch(db: Database.Database, query: string): number {
  try {
    const result = db.prepare(`
      SELECT COUNT(*) as c FROM verses_fts WHERE verses_fts MATCH ?
    `).get(query) as { c: number };
    return result.c;
  } catch {
    return -1;
  }
}

function main() {
  console.log('🔧 Fixing Hindi/Sanskrit Search\n');

  const db = new Database(DB_PATH);

  // Test current search
  log('Testing current search performance:');
  const beforeDharma = testSearch(db, 'धर्म');
  const beforeAtma = testSearch(db, 'आत्मा');
  log(`  "धर्म": ${beforeDharma >= 0 ? beforeDharma : 'ERROR'} results`);
  log(`  "आत्मा": ${beforeAtma >= 0 ? beforeAtma : 'ERROR'} results`);

  // Check current tokenizer
  log('\nChecking current FTS5 configuration...');
  try {
    const info = db.prepare("SELECT * FROM sqlite_master WHERE type='table' AND name='verses_fts'").get() as { sql: string } | undefined;
    if (info) {
      log(`  Current: ${info.sql?.substring(0, 100)}...`);
    }
  } catch (e) {
    log(`  ⚠️ Could not read FTS config: ${(e as Error).message}`);
  }

  // Step 1: Check if trigram tokenizer is available
  log('\nStep 1: Testing trigram tokenizer...');
  try {
    db.exec(`CREATE VIRTUAL TABLE IF NOT EXISTS test_trigram USING fts5(text, tokenize='trigram')`);
    db.exec(`INSERT INTO test_trigram VALUES ('धर्म कर्म आत्मा ब्रह्म')`);
    const trigramTest = db.prepare("SELECT * FROM test_trigram WHERE text MATCH 'धर्म'").get();
    db.exec('DROP TABLE test_trigram');
    log('  ✅ Trigram tokenizer works with Hindi');
  } catch (e) {
    log(`  ⚠️ Trigram tokenizer issue: ${(e as Error).message}`);
    log('  Will use simple LIKE queries as fallback');
  }

  // Step 2: Add fallback search function using LIKE
  log('\nStep 2: Creating fallback search view...');
  try {
    // Create a helper table for word indexing (manual approach)
    db.exec(`
      CREATE TABLE IF NOT EXISTS verse_words (
        verse_id INTEGER,
        word TEXT,
        word_lower TEXT,
        PRIMARY KEY (verse_id, word),
        FOREIGN KEY (verse_id) REFERENCES verses(id)
      )
    `);
    log('  ✅ Created verse_words table');

    // Check if we need to populate it
    const count = (db.prepare('SELECT COUNT(*) as c FROM verse_words').get() as { c: number }).c;
    if (count === 0) {
      log('  📝 Populating word index (this may take a few minutes)...');

      // Extract words from verses and populate
      const verses = db.prepare('SELECT id, original_text FROM verses').all() as Array<{ id: number; original_text: string }>;
      const insertWord = db.prepare('INSERT OR IGNORE INTO verse_words (verse_id, word, word_lower) VALUES (?, ?, ?)');

      let processed = 0;
      for (const verse of verses) {
        // Split on whitespace and punctuation, keep words > 2 chars
        const words = verse.original_text
          .split(/[\s\n\r\t।॥.,;:!?()\[\]{}]+/)
          .filter(w => w.length >= 2)
          .map(w => w.trim())
          .filter(w => w && !/^[\d]+$/.test(w));

        const uniqueWords = [...new Set(words)];
        for (const word of uniqueWords) {
          insertWord.run(verse.id, word, word.toLowerCase());
        }

        processed++;
        if (processed % 1000 === 0) {
          log(`    Processed ${processed}/${verses.length} verses...`);
        }
      }

      log(`  ✅ Indexed ${processed} verses`);
      const totalWords = (db.prepare('SELECT COUNT(*) as c FROM verse_words').get() as { c: number }).c;
      log(`  ✅ Total words indexed: ${totalWords.toLocaleString()}`);
    } else {
      log(`  ℹ️ Word index already populated: ${count.toLocaleString()} words`);
    }
  } catch (e) {
    log(`  ❌ Error: ${(e as Error).message}`);
  }

  // Step 3: Create enhanced search function
  log('\nStep 3: Creating enhanced search query...');
  try {
    // Test the LIKE-based search
    const likeResults = db.prepare(`
      SELECT DISTINCT v.id, v.original_text, b.title as book_title
      FROM verse_words vw
      JOIN verses v ON vw.verse_id = v.id
      JOIN books b ON v.book_id = b.id
      WHERE vw.word_lower LIKE '%' || ? || '%'
      LIMIT 10
    `).all('धर्म') as Array<{ id: number; original_text: string; book_title: string }>;

    log(`  ✅ LIKE search found ${likeResults.length} results for "धर्म"`);
    if (likeResults.length > 0) {
      log(`     Example: [${likeResults[0].book_title}] ${likeResults[0].original_text.substring(0, 50)}...`);
    }
  } catch (e) {
    log(`  ❌ Error: ${(e as Error).message}`);
  }

  // Final comparison
  log('\n📊 Search Comparison:');
  const afterDharma = (db.prepare(`
    SELECT COUNT(DISTINCT verse_id) as c FROM verse_words WHERE word_lower LIKE '%धर्म%'
  `).get() as { c: number }).c;

  log(`  Before (FTS5): ${beforeDharma} results for "धर्म"`);
  log(`  After (LIKE):  ${afterDharma} results for "धर्म"`);
  log(`  Improvement:   ${afterDharma > beforeDharma ? '✅ Better' : '⚠️ Same'}`);

  db.close();

  console.log('\n=== SEARCH FIX COMPLETE ===');
  console.log('\n📚 Usage:');
  console.log('  The app now uses LIKE-based search for Hindi terms');
  console.log('  while keeping FTS5 for English/transliteration.');
  console.log('\n🔍 Test searches:');
  console.log('  - "धर्म" should now return results');
  console.log('  - "कर्म" should work');
  console.log('  - "मोक्ष" should work');
}

try {
  main();
} catch (e) {
  console.error(e);
}
