/**
 * Generate AI Interpretations using Google Generative AI (Gemini)
 * ================================================================
 * Creates detailed verse interpretations using Gemini API
 * Requires: GOOGLE_GENAI_API_KEY environment variable
 *
 * Usage: npx tsx scripts/generate-interpretations.ts [book_id]
 *        npx tsx scripts/generate-interpretations.ts --all
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { GoogleGenAI } from '@google/genai';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const API_KEY = process.env.GOOGLE_GENAI_API_KEY || '';

interface Verse {
  id: number;
  verse_number: number;
  original_text: string;
  transliteration: string;
  translation_hindi: string;
  translation_english: string;
  book_title: string;
}

function log(msg: string) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${msg}`);
}

async function generateInterpretation(genAI: GoogleGenAI, verse: Verse): Promise<{
  shabdarth: string;
  bhavarth: string;
  simple_example: string;
  guided_learning: string;
  modern_relevance: string;
} | null> {
  const prompt = `You are a Sanskrit scholar and spiritual teacher. Provide a detailed interpretation of this verse from ${verse.book_title}.

Verse: ${verse.original_text}
${verse.transliteration ? `Transliteration: ${verse.transliteration}` : ''}
${verse.translation_hindi ? `Hindi Translation: ${verse.translation_hindi}` : ''}
${verse.translation_english ? `English Translation: ${verse.translation_english}` : ''}

Please provide a JSON response with these fields:
- shabdarth: Word-by-word meaning in Hindi
- bhavarth: Essential meaning and philosophical interpretation in Hindi
- simple_example: A simple real-life example in Hindi to illustrate the teaching
- guided_learning: Step-by-step reflection questions to help understand this verse
- modern_relevance: How this teaching applies to modern life

Respond ONLY with valid JSON. Do not include markdown formatting.`;

  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    const text = result.text || '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    log(`   ⚠️  API error: ${(error as Error).message}`);
    return null;
  }
}

async function processBook(bookId: number, db: Database.Database, genAI: GoogleGenAI, limit?: number): Promise<number> {
  let verses = db.prepare(`
    SELECT v.id, v.verse_number, v.original_text, v.transliteration,
           v.translation_hindi, v.translation_english, b.title as book_title
    FROM verses v
    JOIN books b ON v.book_id = b.id
    WHERE v.book_id = ?
    AND v.id NOT IN (SELECT verse_id FROM interpretations)
    ORDER BY v.verse_number
  `).all(bookId) as Verse[];

  if (limit && verses.length > limit) {
    log(`  Limiting to first ${limit} verses (of ${verses.length} total)`);
    verses = verses.slice(0, limit);
  }

  if (verses.length === 0) {
    log('  No verses need interpretations');
    return 0;
  }

  log(`  Processing ${verses.length} verses...`);

  const insertInterpretation = db.prepare(`
    INSERT INTO interpretations 
    (verse_id, shabdarth, bhavarth, guided_learning, modern_relevance, source)
    VALUES (?, ?, ?, ?, ?, 'ai')
  `);

  let successCount = 0;
  for (let i = 0; i < verses.length; i++) {
    const verse = verses[i];
    log(`  [${i + 1}/${verses.length}] Verse ${verse.verse_number}...`);

    const interpretation = await generateInterpretation(genAI, verse);
    if (interpretation) {
      try {
        insertInterpretation.run(
          verse.id,
          interpretation.shabdarth || '',
          interpretation.bhavarth || '',
          interpretation.guided_learning || '',
          interpretation.modern_relevance || ''
        );
        successCount++;
      } catch (e) {
        log(`   ❌ DB error: ${(e as Error).message}`);
      }
    }

    // Rate limiting - be nice to the API
    if (i < verses.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return successCount;
}

async function main() {
  console.log('🤖 Generate AI Interpretations (Gemini)\n');

  if (!API_KEY) {
    console.error('❌ GOOGLE_GENAI_API_KEY environment variable not set');
    console.log('Usage: GOOGLE_GENAI_API_KEY=your_key npx tsx scripts/generate-interpretations.ts');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const processAll = args.includes('--all');
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1]) : undefined;
  const bookId = processAll ? null : parseInt(args[0]);

  if (!processAll && isNaN(bookId as number)) {
    console.log('Usage:');
    console.log('  npx tsx scripts/generate-interpretations.ts 1       # Process book ID 1');
    console.log('  npx tsx scripts/generate-interpretations.ts 1 --limit 5  # Process first 5 verses');
    console.log('  npx tsx scripts/generate-interpretations.ts --all     # Process all books');
    return;
  }

  const genAI = new GoogleGenAI({ apiKey: API_KEY });
  const db = new Database(DB_PATH);

  // Check stats
  const totalVerses = (db.prepare('SELECT COUNT(*) as c FROM verses').get() as { c: number }).c;
  const missingInterp = (db.prepare(`
    SELECT COUNT(*) as c FROM verses v 
    WHERE v.id NOT IN (SELECT verse_id FROM interpretations)
  `).get() as { c: number }).c;

  log(`Database: ${totalVerses.toLocaleString()} total verses`);
  log(`Missing interpretations: ${missingInterp.toLocaleString()} verses\n`);

  if (processAll) {
    const books = db.prepare('SELECT id, title FROM books ORDER BY id').all() as { id: number; title: string }[];
    let totalGenerated = 0;

    for (const book of books) {
      log(`\n📚 Book ${book.id}: ${book.title}`);
      const generated = await processBook(book.id, db, genAI, limit);
      totalGenerated += generated;
      log(`  ✅ Generated ${generated} interpretations`);
    }

    log(`\n═══════════════════════════════════════════`);
    log(`✅ Done! Total interpretations: ${totalGenerated}`);
    log(`═══════════════════════════════════════════`);
  } else {
    const book = db.prepare('SELECT id, title FROM books WHERE id = ?').get(bookId) as { id: number; title: string } | undefined;
    if (!book) {
      log(`Book ${bookId} not found`);
      db.close();
      return;
    }

    log(`📚 Book ${book.id}: ${book.title}`);
    const generated = await processBook(book.id, db, genAI, limit);
    log(`\n✅ Generated ${generated} interpretations`);
  }

  db.close();
}

main().catch(console.error);
