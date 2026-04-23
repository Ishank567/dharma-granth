/**
 * Local LLM Interpretations using Ollama
 * ======================================
 * Generates verse interpretations using locally-running AI
 * No API costs, no quotas, works offline
 *
 * Prerequisites:
 *   1. Install Ollama: https://ollama.com/download
 *   2. Pull a model: ollama pull llama3.2 (or gemma2, mistral, etc.)
 *
 * Usage: npx tsx scripts/local-llm-interpret.ts [book_id] [--model llama3.2]
 *        npx tsx scripts/local-llm-interpret.ts --all
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { execSync } from 'child_process';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

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

async function checkOllama(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

async function getModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/tags`);
    const data = await response.json() as { models: Array<{ name: string }> };
    return data.models.map(m => m.name);
  } catch {
    return [];
  }
}

async function generateInterpretation(model: string, verse: Verse): Promise<{
  shabdarth: string;
  bhavarth: string;
  guided_learning: string;
  modern_relevance: string;
} | null> {
  const prompt = `You are a Sanskrit scholar. Provide a detailed interpretation of this verse from ${verse.book_title}.

Verse: ${verse.original_text.substring(0, 500)}
${verse.translation_hindi ? `Translation: ${verse.translation_hindi.substring(0, 300)}` : ''}

Provide a JSON response with exactly these fields:
{
  "shabdarth": "Word-by-word meaning in Hindi (2-3 sentences)",
  "bhavarth": "Essential philosophical meaning in Hindi (3-4 sentences)",
  "guided_learning": "3 reflection questions to understand this teaching",
  "modern_relevance": "How this applies to modern life in Hindi (2-3 sentences)"
}

Respond ONLY with valid JSON. Keep responses concise but meaningful.`;

  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 800
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json() as { response: string };
    const text = data.response;

    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // Fall through to text parsing
      }
    }

    // Fallback: extract fields from text
    return {
      shabdarth: extractSection(text, 'shabdarth', 'word-by-word') || 'शब्दार्थ उपलब्ध नहीं',
      bhavarth: extractSection(text, 'bhavarth', 'essential meaning') || 'भावार्थ उपलब्ध नहीं',
      guided_learning: extractSection(text, 'guided_learning', 'reflection') || 'प्रश्न उपलब्ध नहीं',
      modern_relevance: extractSection(text, 'modern_relevance', 'modern') || 'आधुनिक प्रासंगिकता उपलब्ध नहीं'
    };
  } catch (error) {
    log(`   ⚠️  LLM error: ${(error as Error).message}`);
    return null;
  }
}

function extractSection(text: string, field: string, fallback: string): string {
  const patterns = [
    new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`, 'i'),
    new RegExp(`${field}[:\\s]+([^\\n]{10,200})`, 'i'),
    new RegExp(`${fallback}[:\\s]+([^\\n]{10,200})`, 'i')
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}

async function processBook(bookId: number, db: Database.Database, model: string, limit?: number): Promise<number> {
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

  log(`  Processing ${verses.length} verses with ${model}...`);

  const insertInterpretation = db.prepare(`
    INSERT INTO interpretations 
    (verse_id, shabdarth, bhavarth, guided_learning, modern_relevance, source)
    VALUES (?, ?, ?, ?, ?, 'local-llm')
  `);

  let successCount = 0;
  for (let i = 0; i < verses.length; i++) {
    const verse = verses[i];
    log(`  [${i + 1}/${verses.length}] Verse ${verse.verse_number}...`);

    const interpretation = await generateInterpretation(model, verse);
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

    // Small delay to not overwhelm local LLM
    if (i < verses.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return successCount;
}

async function main() {
  console.log('🤖 Local LLM Interpretations (Ollama)\n');

  // Check Ollama
  const isRunning = await checkOllama();
  if (!isRunning) {
    console.error('❌ Ollama not running');
    console.log('\nTo set up:');
    console.log('  1. Download: https://ollama.com/download');
    console.log('  2. Install and start Ollama');
    console.log('  3. Pull a model: ollama pull llama3.2');
    console.log('\nThen run this script again.');
    process.exit(1);
  }

  const models = await getModels();
  if (models.length === 0) {
    console.error('❌ No models found');
    console.log('Pull a model first: ollama pull llama3.2');
    process.exit(1);
  }

  log(`Available models: ${models.join(', ')}`);

  // Parse args
  const args = process.argv.slice(2);
  const processAll = args.includes('--all');
  const modelIndex = args.indexOf('--model');
  const model = modelIndex >= 0 ? args[modelIndex + 1] : models[0];
  const limitIndex = args.indexOf('--limit');
  const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1]) : undefined;
  const bookId = processAll ? null : parseInt(args[0]);

  if (!processAll && isNaN(bookId as number)) {
    console.log('Usage:');
    console.log(`  npx tsx scripts/local-llm-interpret.ts 1 --model ${models[0]}`);
    console.log(`  npx tsx scripts/local-llm-interpret.ts 1 --limit 5`);
    console.log(`  npx tsx scripts/local-llm-interpret.ts --all`);
    return;
  }

  if (!models.includes(model)) {
    log(`⚠️  Model ${model} not found. Using ${models[0]}`);
  }

  const db = new Database(DB_PATH);

  // Stats
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
      const generated = await processBook(book.id, db, model, limit);
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
    const generated = await processBook(book.id, db, model, limit);
    log(`\n✅ Generated ${generated} interpretations`);
  }

  db.close();
}

main().catch(console.error);
