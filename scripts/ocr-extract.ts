/**
 * OCR Re-extraction Script for Scanned PDFs (Multi-threaded)
 * ===========================================================
 * Uses worker_threads + mupdf (WASM) to render PDF pages in parallel,
 * pipelined with Google Cloud Vision API for Hindi/Sanskrit OCR.
 *
 * Architecture:
 *   - N worker threads render PDF pages to PNG concurrently (CPU-bound)
 *   - Main thread pipelines render results into Vision API calls (I/O-bound)
 *   - Semaphore limits concurrent Vision API calls to avoid rate limits
 *   - Fully pipelined: rendering and OCR overlap for maximum throughput
 *
 * Usage:
 *   npx tsx scripts/ocr-extract.ts              # process all scanned PDFs
 *   npx tsx scripts/ocr-extract.ts --book 5     # process only book ID 5
 *   npx tsx scripts/ocr-extract.ts --limit 3    # process only first 3 scanned books
 *   npx tsx scripts/ocr-extract.ts --dpi 200    # override DPI (default 200)
 *   npx tsx scripts/ocr-extract.ts --force      # re-process already completed books
 *   npx tsx scripts/ocr-extract.ts --threads 8  # override render thread count
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import Database from 'better-sqlite3';
import { Worker } from 'node:worker_threads';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const PDF_DIR = path.resolve(__dirname, '..', '..');
const CHECKPOINT_PATH = path.join(__dirname, '..', 'db', 'ocr-checkpoint.json');
const SERVICE_ACCOUNT_PATH = String.raw`C:\Users\ishan\Downloads\skilled-tangent-491310-b2-60f4ac6dad37.json`;
const WORKER_PATH = path.join(__dirname, 'ocr-render-worker.ts');

const DEFAULT_DPI = 200;
const DEFAULT_VISION_CONCURRENCY = 15; // parallel Vision API calls (I/O-bound)
const DEFAULT_RENDER_THREADS = Math.min(os.cpus().length - 1, 6); // CPU-bound render workers

// Parse CLI args
const args = process.argv.slice(2);
function getArg(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined;
}
const hasFlag = (name: string) => args.includes(`--${name}`);

const targetBookId = getArg('book') ? parseInt(getArg('book')!, 10) : null;
const bookLimit = getArg('limit') ? parseInt(getArg('limit')!, 10) : null;
const dpiOverride = getArg('dpi') ? parseInt(getArg('dpi')!, 10) : null;
const threadCount = getArg('threads') ? parseInt(getArg('threads')!, 10) : DEFAULT_RENDER_THREADS;
const forceReprocess = hasFlag('force');
const scale = (dpiOverride || DEFAULT_DPI) / 72;

// ─── Semaphore for concurrency control ───
class Semaphore {
  private queue: (() => void)[] = [];
  private current = 0;
  constructor(private max: number) {}
  async acquire(): Promise<void> {
    if (this.current < this.max) { this.current++; return; }
    return new Promise((resolve) => this.queue.push(resolve));
  }
  release() {
    this.current--;
    const next = this.queue.shift();
    if (next) { this.current++; next(); }
  }
}

// ─── Worker Thread Render Pool ───
class RenderPool {
  private workers: Worker[] = [];
  private callbacks = new Map<number, (msg: any) => void>();
  private roundRobin = 0;
  private nextId = 0;
  private alive = true;

  constructor(size: number) {
    for (let i = 0; i < size; i++) {
      const w = new Worker(WORKER_PATH);
      w.on('message', (msg: any) => {
        const cb = this.callbacks.get(msg.id);
        if (cb) { this.callbacks.delete(msg.id); cb(msg); }
      });
      w.on('error', (err) => console.error(`  Worker ${i} error: ${err.message}`));
      this.workers.push(w);
    }
  }

  renderPage(pdfPath: string, pageIdx: number, renderScale: number): Promise<{ pageIdx: number; png: Buffer | null; error: string | null }> {
    return new Promise((resolve) => {
      const id = this.nextId++;
      this.callbacks.set(id, (msg) => resolve({ pageIdx: msg.pageIdx, png: msg.png, error: msg.error }));
      const workerIdx = this.roundRobin++ % this.workers.length;
      this.workers[workerIdx].postMessage({ type: 'render', id, pdfPath, pageIdx, scale: renderScale });
    });
  }

  evictDoc(pdfPath: string) {
    for (const w of this.workers) w.postMessage({ type: 'evict', pdfPath });
  }

  async close() {
    if (!this.alive) return;
    this.alive = false;
    await Promise.all(this.workers.map((w) => w.terminate()));
  }
}

interface Checkpoint {
  [bookId: string]: {
    pagesCompleted: number;
    totalPages: number;
    status: 'in-progress' | 'done';
  };
}

function loadCheckpoint(): Checkpoint {
  try {
    return JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

function saveCheckpoint(cp: Checkpoint) {
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(cp, null, 2));
}

interface ScannedBook {
  id: number;
  title: string;
  slug: string;
  pdf_filename: string;
  total_pages: number;
  category_id: number;
}

function getScannedBooks(db: Database.Database): ScannedBook[] {
  const rows = db.prepare(`
    SELECT b.id, b.title, b.slug, b.pdf_filename, b.total_pages, b.category_id,
      (SELECT GROUP_CONCAT(substr(original_text, 1, 200), '|||') FROM (
        SELECT original_text FROM verses WHERE book_id = b.id LIMIT 5
      )) as samples
    FROM books b
    ORDER BY b.total_pages ASC
  `).all() as (ScannedBook & { samples: string })[];

  return rows.filter((r) => {
    const sampleTexts = (r.samples || '').split('|||');
    // Check each sample: strip page markers and see if real text remains
    const hasGoodText = sampleTexts.some((s) => {
      const cleaned = s
        .replace(/\n/g, ' ')
        .replace(/-- \d+ of \d+ --/g, '')
        .trim();
      return cleaned.length > 100;
    });
    // Book is "scanned" if no verse sample has substantial readable text
    return !hasGoodText;
  });
}

function splitIntoVerses(text: string): string[] {
  text = text.replace(/\r\n/g, '\n').replace(/\f/g, '\n\n');

  // Try Sanskrit verse markers first (॥ N ॥ or ।। N ।।)
  const sanskritVerses = text.split(/॥[^॥]*?॥|।।[^।]*?।।/);
  if (sanskritVerses.length > 5) {
    return sanskritVerses.map((v) => v.trim()).filter((v) => v.length > 15);
  }

  // Try numbered parts
  const numberedParts = text.split(/\n\s*(?:\d+[\.\)]\s|\d+\s*[-–—]\s)/);
  if (numberedParts.length > 5) {
    return numberedParts.map((v) => v.trim()).filter((v) => v.length > 15);
  }

  // Paragraph-based chunking (target ~300–600 chars per verse for readability)
  const TARGET_SIZE = 500;
  const MAX_SIZE = 800;
  const paragraphs = text.split(/\n\s*\n/);
  if (paragraphs.length > 3) {
    const verses: string[] = [];
    let current = '';
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed || trimmed.length < 8) continue;
      if (current.length > TARGET_SIZE || (current.length + trimmed.length > MAX_SIZE && current.length > 20)) {
        verses.push(current.trim());
        current = trimmed;
      } else {
        current += (current ? '\n\n' : '') + trimmed;
      }
    }
    if (current.trim().length > 15) verses.push(current.trim());
    if (verses.length > 2) return verses;
  }

  // Line-based fallback — chunk by lines, targeting ~400 chars
  const LINE_TARGET = 400;
  const chunks: string[] = [];
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  let current = '';
  for (const line of lines) {
    if (current.length > LINE_TARGET && current.length > 20) {
      chunks.push(current.trim());
      current = line;
    } else {
      current += (current ? '\n' : '') + line;
    }
  }
  if (current.trim().length > 15) chunks.push(current.trim());

  return chunks.length > 0 ? chunks : [text.trim()].filter((v) => v.length > 15);
}

/**
 * Clean up common OCR artifacts from Hindi/Sanskrit text
 */
function cleanOcrText(text: string): string {
  return text
    // Remove form feeds, null bytes
    .replace(/[\x00\f]/g, '')
    // Normalize whitespace but preserve newlines
    .replace(/[ \t]+/g, ' ')
    .replace(/ +\n/g, '\n')
    .replace(/\n +/g, '\n')
    // Remove isolated single characters that are likely noise
    .replace(/(?:^|\n)\s*[^\S\n]*[a-zA-Z]\s*(?:\n|$)/g, '\n')
    // Collapse excessive newlines
    .replace(/\n{4,}/g, '\n\n\n')
    .trim();
}

async function main() {
  console.log('🔍 OCR Re-extraction Script (Multi-threaded + Cloud Vision)');
  console.log('============================================================\n');

  // Set up Vision API client
  process.env.GOOGLE_APPLICATION_CREDENTIALS = SERVICE_ACCOUNT_PATH;
  const vision = await import('@google-cloud/vision');
  const visionClient = new vision.default.ImageAnnotatorClient();

  // Quick test call
  console.log('🔗 Testing Vision API connection...');
  try {
    await visionClient.textDetection({
      image: { content: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        'base64'
      ) },
    });
    console.log('✅ Vision API connected successfully\n');
  } catch (e: any) {
    console.error(`❌ Vision API error: ${e.message}`);
    if (e.message.includes('has not been used') || e.message.includes('PERMISSION_DENIED')) {
      console.error('\n⚠️  Cloud Vision API is not enabled on this project.');
      console.error('   Enable it at: https://console.cloud.google.com/apis/library/vision.googleapis.com');
    }
    process.exit(1);
  }

  // Start render worker pool
  console.log(`🧵 Starting ${threadCount} render worker threads...`);
  const pool = new RenderPool(threadCount);
  const visionSem = new Semaphore(DEFAULT_VISION_CONCURRENCY);
  // Limit total in-flight pages to avoid memory bloat (render + OCR pipeline)
  const pipelineSem = new Semaphore(threadCount + DEFAULT_VISION_CONCURRENCY + 5);
  console.log(`⚙️  DPI: ${dpiOverride || DEFAULT_DPI}, Render threads: ${threadCount}, Vision concurrency: ${DEFAULT_VISION_CONCURRENCY}\n`);

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  const checkpoint = loadCheckpoint();

  let scannedBooks = getScannedBooks(db);

  if (targetBookId) {
    scannedBooks = scannedBooks.filter((b) => b.id === targetBookId);
    if (scannedBooks.length === 0 && forceReprocess) {
      // With --force, allow processing any book even if it has good text
      const book = db.prepare(
        'SELECT id, title, slug, pdf_filename, total_pages, category_id FROM books WHERE id = ?'
      ).get(targetBookId) as ScannedBook | undefined;
      if (book) {
        scannedBooks = [book];
      }
    }
    if (scannedBooks.length === 0) {
      console.log(`❌ Book ID ${targetBookId} not found or already has good text. Use --force to override.`);
      await pool.close();
      process.exit(1);
    }
  }

  if (bookLimit) {
    scannedBooks = scannedBooks.slice(0, bookLimit);
  }

  const totalPages = scannedBooks.reduce((sum, b) => sum + b.total_pages, 0);
  console.log(`📚 ${scannedBooks.length} scanned PDFs found (${totalPages.toLocaleString()} total pages)\n`);

  const deleteVerses = db.prepare('DELETE FROM verses WHERE book_id = ?');
  const insertVerse = db.prepare(
    'INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration, translation_hindi, translation_english, page_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const deleteInterpretations = db.prepare(
    'DELETE FROM interpretations WHERE verse_id IN (SELECT id FROM verses WHERE book_id = ?)'
  );

  let booksProcessed = 0;
  let totalVersesCreated = 0;

  for (const book of scannedBooks) {
    const bookCp = checkpoint[book.id.toString()];
    if (bookCp?.status === 'done' && !forceReprocess) {
      console.log(`⏭️  Skipping ${book.title} (already OCR'd — use --force to redo)`);
      continue;
    }

    const pdfPath = path.join(PDF_DIR, book.pdf_filename);
    if (!fs.existsSync(pdfPath)) {
      console.log(`⚠️  File not found: ${book.pdf_filename}`);
      continue;
    }

    // Get actual page count from a quick mupdf check via worker
    const testRender = await pool.renderPage(pdfPath, 0, scale);
    if (testRender.error && testRender.error.includes('out of range')) {
      console.log(`⚠️  Cannot open: ${book.pdf_filename}`);
      continue;
    }

    console.log(`\n📖 Processing: ${book.title}`);
    console.log(`   PDF: ${book.pdf_filename} (${book.total_pages} pages)`);

    const startTime = Date.now();
    const pageCount = book.total_pages;
    const pageTexts: string[] = new Array(pageCount).fill('');
    let pagesCompleted = 0;

    // ─── Pipeline: render (workers) → OCR (Vision API) — fully overlapped ───
    const allJobs: Promise<void>[] = [];

    for (let i = 0; i < pageCount; i++) {
      await pipelineSem.acquire(); // backpressure: limit total in-flight

      const job = (async (pageIdx: number) => {
        try {
          // Step 1: Render in worker thread (CPU-bound, parallelized)
          const renderResult = await pool.renderPage(pdfPath, pageIdx, scale);

          if (renderResult.error || !renderResult.png) {
            console.log(`\n   ⚠️  Page ${pageIdx + 1} render failed: ${renderResult.error}`);
            return;
          }

          // Step 2: Vision API OCR (I/O-bound, semaphore-limited)
          await visionSem.acquire();
          try {
            const [result] = await visionClient.documentTextDetection({
              image: { content: renderResult.png },
              imageContext: { languageHints: ['hi', 'sa', 'en'] },
            });
            pageTexts[pageIdx] = result.fullTextAnnotation?.text || '';
          } catch (e: any) {
            // Retry once on transient errors
            if (e.code === 14 || e.code === 8 || e.message?.includes('UNAVAILABLE')) {
              await new Promise((r) => setTimeout(r, 2000));
              try {
                const [result] = await visionClient.documentTextDetection({
                  image: { content: renderResult.png },
                  imageContext: { languageHints: ['hi', 'sa', 'en'] },
                });
                pageTexts[pageIdx] = result.fullTextAnnotation?.text || '';
              } catch (e2) {
                console.log(`\n   ⚠️  Page ${pageIdx + 1} OCR retry failed: ${(e2 as Error).message}`);
              }
            } else {
              console.log(`\n   ⚠️  Page ${pageIdx + 1} OCR failed: ${e.message}`);
            }
          } finally {
            visionSem.release();
          }
        } finally {
          pagesCompleted++;
          pipelineSem.release();

          // Progress update
          if (pagesCompleted % 10 === 0 || pagesCompleted === pageCount) {
            const pct = ((pagesCompleted / pageCount) * 100).toFixed(1);
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
            const pps = (pagesCompleted / ((Date.now() - startTime) / 1000)).toFixed(1);
            process.stdout.write(`\r   📄 ${pagesCompleted}/${pageCount} pages (${pct}%) — ${elapsed}s — ${pps} pages/s   `);
          }
        }
      })(i);

      allJobs.push(job);
    }

    try {
      await Promise.all(allJobs);
      console.log(''); // newline after progress

      // Free cached PDF from workers
      pool.evictDoc(pdfPath);

      // Combine all page texts
      const fullText = pageTexts
        .map((t) => cleanOcrText(t))
        .filter((t) => t.length > 5)
        .join('\n\n');

      if (fullText.length < 50) {
        console.log(`   ⚠️  OCR produced very little text (${fullText.length} chars). Skipping.`);
        checkpoint[book.id.toString()] = { pagesCompleted: pageCount, totalPages: pageCount, status: 'done' };
        saveCheckpoint(checkpoint);
        continue;
      }

      // Split into verses
      const verses = splitIntoVerses(fullText);
      console.log(`   ✂️  Split into ${verses.length} verses (${fullText.length} chars total)`);

      // Replace in database (transaction)
      const replaceBook = db.transaction(() => {
        deleteInterpretations.run(book.id);
        deleteVerses.run(book.id);
        for (let i = 0; i < verses.length; i++) {
          insertVerse.run(
            book.id, null, i + 1, verses[i],
            '', '', '',
            Math.max(1, Math.floor((i / Math.max(verses.length, 1)) * pageCount) + 1)
          );
        }
      });
      replaceBook();
      totalVersesCreated += verses.length;

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`   ✅ Done in ${elapsed}s — ${verses.length} verses saved`);

      checkpoint[book.id.toString()] = { pagesCompleted: pageCount, totalPages: pageCount, status: 'done' };
      saveCheckpoint(checkpoint);
      booksProcessed++;
    } catch (e) {
      console.error(`\n   ❌ Error processing ${book.title}: ${(e as Error).message}`);
      saveCheckpoint(checkpoint);
    }
  }

  // Shut down render pool
  await pool.close();

  // Rebuild FTS index
  console.log('\n🔄 Rebuilding search index...');
  try {
    db.exec("INSERT INTO verses_fts(verses_fts) VALUES('rebuild')");
    console.log('✅ Search index rebuilt');
  } catch (e) {
    console.log(`⚠️  FTS rebuild: ${(e as Error).message}`);
  }

  console.log(`\n🎉 OCR Complete!`);
  console.log(`   Books processed: ${booksProcessed}`);
  console.log(`   Verses created: ${totalVersesCreated}`);
  console.log(`   Threads used: ${threadCount} render + ${DEFAULT_VISION_CONCURRENCY} Vision API`);

  db.close();
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
