#!/usr/bin/env npx tsx
/**
 * High-concurrency batch interpretation using Service Account auth.
 *
 * Instead of the free-tier 15 RPM limit, SA auth on the Generative
 * Language API allows 200+ concurrent requests → ~300 verses/min.
 *
 * Usage:
 *   npx tsx scripts/sa-batch-interpret.ts                    # all pending
 *   npx tsx scripts/sa-batch-interpret.ts --books=22,29,26   # specific books
 *   npx tsx scripts/sa-batch-interpret.ts --limit=1000       # first 1000
 *   npx tsx scripts/sa-batch-interpret.ts --concurrency=30   # tune concurrency
 *   npx tsx scripts/sa-batch-interpret.ts --dry-run          # preview only
 */

import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { GoogleAuth, type AuthClient } from 'google-auth-library';
import {
  normalizeInterpretationPayload,
  InterpretationValidationError,
  buildInterpretationInput,
  type InterpretationPayload,
} from '../app/lib/interpretationUtils';

// ── Config ──────────────────────────────────────────────────────────
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SA_KEY_PATHS = [
  'C:/Users/ishan/Downloads/skilled-tangent-491310-b2-60f4ac6dad37.json',
  'C:/Users/ishan/Downloads/round-gasket-491805-g2-65a615bba267.json',
  'C:/Users/ishan/Downloads/numeric-water-491808-d5-80e3b6bbe2b7.json',
];
const MODEL = 'gemini-2.5-flash';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const DB_PATH = path.join(PROJECT_ROOT, 'db', 'dharma.db');
const CHECKPOINT_PATH = path.join(PROJECT_ROOT, 'db', 'sa-batch-checkpoint.json');
const LOG_PATH = path.join(PROJECT_ROOT, 'db', 'sa-batch-log.txt');

// CLI flags
const CONCURRENCY = Number(
  process.argv.find((a) => a.startsWith('--concurrency='))?.split('=')[1] || 50
);
const BATCH_LIMIT = Number(
  process.argv.find((a) => a.startsWith('--limit='))?.split('=')[1] || 0
);
const BOOKS_FILTER = process.argv.find((a) => a.startsWith('--books='))?.split('=')[1];
const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_EXISTING = true; // always skip existing

// ── Types ───────────────────────────────────────────────────────────
interface VerseRow {
  id: number;
  verse_number: number;
  original_text: string;
  transliteration: string | null;
  translation_hindi: string | null;
  translation_english: string | null;
  book_id: number;
  book_title: string;
  book_slug: string;
}

interface Checkpoint {
  completedVerseIds: number[];
  failedVerseIds: number[];
  lastUpdated: string;
}

// ── SA Client type ──────────────────────────────────────────────────
interface SAClient {
  name: string;          // project ID for logging
  client: AuthClient;
  quotaPaused: boolean;  // per-client quota state
}
let saClients: SAClient[] = [];

// ── State ───────────────────────────────────────────────────────────
let generated = 0;
let failed = 0;
let skipped = 0;
const startTime = Date.now();
let networkPaused = false; // shared flag: true = all workers wait

// ── Helpers ─────────────────────────────────────────────────────────
function log(msg: string) {
  const ts = new Date().toISOString().slice(11, 19);
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + '\n');
}

function loadCheckpoint(): Checkpoint {
  if (fs.existsSync(CHECKPOINT_PATH)) {
    return JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf8'));
  }
  return { completedVerseIds: [], failedVerseIds: [], lastUpdated: '' };
}

function saveCheckpoint(cp: Checkpoint) {
  cp.lastUpdated = new Date().toISOString();
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(cp, null, 2));
}

async function waitForNetwork(): Promise<void> {
  // Simple connectivity probe — try to reach Google's oauth endpoint
  const https = await import('https');
  return new Promise((resolve) => {
    const check = () => {
      const req = https.get('https://oauth2.googleapis.com/', { timeout: 5000 }, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        log('  🌐 Network still down, retrying in 30s...');
        setTimeout(check, 30_000);
      });
      req.on('timeout', () => {
        req.destroy();
        log('  🌐 Network timeout, retrying in 30s...');
        setTimeout(check, 30_000);
      });
    };
    check();
  });
}

function buildPrompt(input: ReturnType<typeof buildInterpretationInput>): string {
  const translationBlock = [
    input.translationHindi ? `हिन्दी अर्थ-सूत्र: ${input.translationHindi}` : '',
    input.translationEnglish ? `अंग्रेज़ी अर्थ-सूत्र: ${input.translationEnglish}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `तुम सनातन धर्मग्रंथों के गहन अध्येता हो। नीचे दिए गए श्लोक या पाठ की **पूरी और विस्तृत** व्याख्या केवल हिन्दी में दो। भाषा सरल लेकिन गंभीर हो।

संदर्भ:
- ग्रंथ: ${input.bookTitle}
- श्लोक संख्या: ${input.verseNumber}
${input.chapterTitle ? `- अध्याय: ${input.chapterTitle}\n` : ''}${translationBlock ? `\nउपलब्ध अनुवाद:\n${translationBlock}\n` : ''}
मूल पाठ:
${input.originalText}

JSON format में उत्तर दो:
{
  "shabdarth": "हर संस्कृत शब्द का अर्थ — **शब्द** → अर्थ प्रारूप में, अंत में सरल अनुवाद",
  "bhavarth": "8-12 वाक्यों में गहरा दार्शनिक अर्थ, 2+ उदाहरण सहित",
  "simple_example": "3-5 वाक्यों में एक सरल जीवन-कहानी जो मूल संदेश समझाए",
  "guided_learning": "1. ...\\n2. ...\\n3. ...\\n4. ...\\n5. ... (5-7 क्रमबद्ध बिंदु)",
  "scientific_temperament": "5-7 वाक्यों में तर्कशील, वैज्ञानिक दृष्टि",
  "modern_relevance": "4-6 वाक्यों में आज के जीवन के लिए ठोस अभ्यास",
  "next_curiosity": "2-3 वाक्यों में अगले श्लोक की ओर जिज्ञासा"
}

केवल वैध JSON दो, कोई अतिरिक्त text नहीं।`;
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() || text.trim();
  const match = candidate.match(/\{[\s\S]*\}/);
  if (!match) throw new InterpretationValidationError('No JSON found in response');
  return match[0];
}

function repairAndParseJson(raw: string): Record<string, string> {
  try { return JSON.parse(raw); } catch {}
  let fixed = raw.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
  try { return JSON.parse(fixed); } catch {}
  fixed = fixed.replace(/("(?:[^"\\]|\\.)*")/g, (m) =>
    m.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
  );
  try { return JSON.parse(fixed); } catch {}
  fixed = fixed.replace(/'([^']+)'\s*:/g, '"$1":');
  try { return JSON.parse(fixed); } catch {}
  throw new InterpretationValidationError('JSON repair failed');
}

// ── API call ────────────────────────────────────────────────────────
async function callGemini(
  saClient: SAClient,
  prompt: string,
  retries = 3
): Promise<string> {
  const url = `${API_BASE}/models/${MODEL}:generateContent`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await saClient.client.request({ url, method: 'POST', data: body });
      const data = response.data as Record<string, unknown>;
      const candidates = data.candidates as Array<Record<string, unknown>> | undefined;
      const text = (candidates?.[0] as Record<string, unknown>)?.content as
        | Record<string, unknown>
        | undefined;
      const parts = text?.parts as Array<Record<string, unknown>> | undefined;
      const result = parts?.[0]?.text as string | undefined;

      if (!result) throw new Error('Empty response from model');
      return result;
    } catch (err: unknown) {
      const code = (err as { code?: number }).code;
      const msg = err instanceof Error ? err.message : String(err);

      const isNetwork =
        msg.includes('ENOTFOUND') || msg.includes('ECONNRESET') ||
        msg.includes('ETIMEDOUT') || msg.includes('socket hang up') ||
        msg.includes('fetch failed') || msg.includes('ECONNREFUSED');
      const isQuotaExceeded =
        code === 429 && msg.includes('exceeded your current quota');
      const isResourceExhausted =
        code === 429 && msg.includes('Resource exhausted');
      const isTransient =
        code === 429 || code === 503 || code === 500 || code === 502 || isNetwork;

      // ── Network outage handling ──
      if (isNetwork && !networkPaused) {
        networkPaused = true;
        log('  🌐 Network down detected — pausing all workers until connectivity returns...');
        await waitForNetwork();
        networkPaused = false;
        log('  🌐 Network restored — resuming');
        continue;
      }
      if (networkPaused) {
        while (networkPaused) await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      // ── Quota exceeded handling (per-client) ──
      if (isQuotaExceeded && !saClient.quotaPaused) {
        saClient.quotaPaused = true;
        const QUOTA_WAIT_MIN = 15;
        const quotaProbe = async (): Promise<boolean> => {
          try {
            await saClient.client.request({
              url: `${API_BASE}/models/${MODEL}:generateContent`,
              method: 'POST',
              data: { contents: [{ role: 'user', parts: [{ text: 'test' }] }], generationConfig: { maxOutputTokens: 10 } },
            });
            return true;
          } catch (probeErr: unknown) {
            const probeMsg = probeErr instanceof Error ? probeErr.message : String(probeErr);
            return !probeMsg.includes('exceeded your current quota');
          }
        };
        log(`  💰 QUOTA EXCEEDED [${saClient.name}] — pausing its workers. Will probe every ${QUOTA_WAIT_MIN} min...`);
        let quotaRestored = false;
        while (!quotaRestored) {
          await new Promise((r) => setTimeout(r, QUOTA_WAIT_MIN * 60 * 1000));
          log(`  💰 Probing quota [${saClient.name}]...`);
          quotaRestored = await quotaProbe();
          if (!quotaRestored) {
            log(`  💰 Quota still exhausted [${saClient.name}] — waiting another ${QUOTA_WAIT_MIN} min...`);
          }
        }
        log(`  💰 Quota restored [${saClient.name}] — resuming its workers`);
        saClient.quotaPaused = false;
        continue;
      }
      if (saClient.quotaPaused) {
        while (saClient.quotaPaused) await new Promise((r) => setTimeout(r, 2000));
        continue;
      }

      // ── Vertex AI RPM exhausted (per-minute, not daily) ──
      if (isResourceExhausted && attempt < retries) {
        const wait = 30_000 + Math.random() * 30_000; // 30-60s with jitter
        log(`  ⏳ Resource exhausted, waiting ${(wait / 1000).toFixed(0)}s (attempt ${attempt}/${retries})`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      // ── Transient error retry ──
      if (isTransient && attempt < retries) {
        const wait = code === 429 ? 10000 * attempt : 3000 * attempt;
        if (code === 429) {
          log(`  ⏳ 429 rate limit, waiting ${wait / 1000}s (attempt ${attempt}/${retries})`);
        }
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}

// ── Process one verse ───────────────────────────────────────────────
const MAX_PARSE_RETRIES = 2;

async function processVerse(
  saClient: SAClient,
  verse: VerseRow,
  db: Database.Database,
  insertStmt: Database.Statement,
  checkpoint: Checkpoint
): Promise<boolean> {
  const input = buildInterpretationInput({
    id: verse.id,
    verse_number: verse.verse_number,
    original_text: verse.original_text,
    transliteration: verse.transliteration || '',
    translation_hindi: verse.translation_hindi || '',
    translation_english: verse.translation_english || '',
    book_title: verse.book_title,
    book_slug: verse.book_slug,
  });

  const prompt = buildPrompt(input);

  for (let attempt = 1; attempt <= MAX_PARSE_RETRIES; attempt++) {
    try {
      const responseText = await callGemini(saClient, prompt);
      const jsonStr = extractJson(responseText);
      const parsed = repairAndParseJson(jsonStr);
      const validated = normalizeInterpretationPayload(parsed);

      insertStmt.run(
        verse.id,
        validated.shabdarth,
        validated.bhavarth,
        validated.simple_example,
        validated.guided_learning,
        validated.scientific_temperament,
        validated.modern_relevance,
        validated.next_curiosity
      );

      checkpoint.completedVerseIds.push(verse.id);
      generated++;
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isParseError =
        err instanceof InterpretationValidationError ||
        msg.includes('JSON') ||
        msg.includes('repair');

      if (isParseError && attempt < MAX_PARSE_RETRIES) {
        continue; // retry silently
      }

      log(`  ✗ v${verse.id} (${verse.book_title} #${verse.verse_number}): ${msg.slice(0, 80)}`);
      checkpoint.failedVerseIds.push(verse.id);
      failed++;
      return false;
    }
  }

  return false;
}

// ── Concurrency pool ────────────────────────────────────────────────
async function runPool<T>(
  items: T[],
  concurrency: number,
  fn: (item: T, workerIdx: number) => Promise<void>
): Promise<void> {
  let idx = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async (_, workerIdx) => {
    while (idx < items.length) {
      const i = idx++;
      await fn(items[i], workerIdx);
    }
  });
  await Promise.all(workers);
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  log(`\n${'='.repeat(60)}`);
  log(`SA Batch Interpret — ${MODEL} — concurrency ${CONCURRENCY}`);
  log(`${'='.repeat(60)}`);

  // Auth — create one client per SA key
  saClients = [];
  for (const keyPath of SA_KEY_PATHS) {
    const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    const projectId = keyData.project_id || path.basename(keyPath, '.json');
    const auth = new GoogleAuth({
      keyFile: keyPath,
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform',
        'https://www.googleapis.com/auth/generative-language',
      ],
    });
    const client = await auth.getClient();
    saClients.push({ name: projectId, client, quotaPaused: false });
    log(`✓ SA authenticated: ${projectId}`);
  }
  log(`  ${saClients.length} service account(s) ready`);

  // DB
  const db = new Database(DB_PATH);
  const checkpoint = loadCheckpoint();
  // Clear failed IDs so they get retried (failures are often transient)
  if (checkpoint.failedVerseIds.length > 0) {
    log(`Clearing ${checkpoint.failedVerseIds.length} previously failed verse IDs for retry`);
    checkpoint.failedVerseIds = [];
    saveCheckpoint(checkpoint);
  }
  const completedSet = new Set(checkpoint.completedVerseIds);

  // Query verses
  let whereClause = '';
  const params: unknown[] = [];
  if (BOOKS_FILTER) {
    const ids = BOOKS_FILTER.split(',').map(Number);
    whereClause = `AND v.book_id IN (${ids.map(() => '?').join(',')})`;
    params.push(...ids);
  }

  const verses: VerseRow[] = db
    .prepare(
      `SELECT v.id, v.verse_number, v.original_text, v.transliteration,
              v.translation_hindi, v.translation_english,
              v.book_id, b.title as book_title, b.slug as book_slug
       FROM verses v
       JOIN books b ON v.book_id = b.id
       WHERE v.id NOT IN (SELECT verse_id FROM interpretations)
         ${whereClause}
       ORDER BY v.book_id, v.verse_number`
    )
    .all(...params) as VerseRow[];

  // Filter out checkpoint-completed
  const pending = verses.filter((v) => !completedSet.has(v.id));
  const queue = BATCH_LIMIT > 0 ? pending.slice(0, BATCH_LIMIT) : pending;

  log(`Pending: ${pending.length}  |  Queue: ${queue.length}  |  Checkpoint completed: ${completedSet.size}`);

  if (queue.length === 0) {
    log('Nothing to process!');
    db.close();
    return;
  }

  if (DRY_RUN) {
    log('DRY RUN — would process above verses.');
    const bookCounts = new Map<string, number>();
    queue.forEach((v) => bookCounts.set(v.book_title, (bookCounts.get(v.book_title) || 0) + 1));
    bookCounts.forEach((count, title) => log(`  ${title}: ${count}`));
    db.close();
    return;
  }

  // Prepare insert statement
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO interpretations
      (verse_id, shabdarth, bhavarth, simple_example, guided_learning,
       scientific_temperament, modern_relevance, next_curiosity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Progress tracking
  let lastLogTime = Date.now();
  let lastLogCount = 0;
  const total = queue.length;

  const progressInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const rate = generated / (elapsed / 60);
    const remaining = total - generated - failed;
    const eta = rate > 0 ? remaining / rate : 0;

    log(
      `📊 Progress: ${generated}/${total} done, ${failed} failed | ` +
        `${rate.toFixed(1)} v/min | ETA: ${eta.toFixed(0)} min`
    );

    // Save checkpoint every progress log
    saveCheckpoint(checkpoint);
  }, 30_000); // Every 30s

  // Run in concurrent pool — workers round-robin across SA clients,
  // but fall back to any non-paused client when their primary is quota-paused
  await runPool(queue, CONCURRENCY, async (verse, workerIdx) => {
    let saClient = saClients[workerIdx % saClients.length];
    // If assigned client is quota-paused, try another
    if (saClient.quotaPaused) {
      const alt = saClients.find(c => !c.quotaPaused);
      if (alt) saClient = alt;
      // If all paused, stick with assigned one (callGemini will wait)
    }
    try {
      await processVerse(saClient, verse, db, insertStmt, checkpoint);
    } catch (err: unknown) {
      // Safety net — never let a single verse crash the whole batch
      const msg = err instanceof Error ? err.message : String(err);
      log(`  💀 UNHANDLED v${verse.id} [${saClient.name}]: ${msg.slice(0, 100)}`);
      checkpoint.failedVerseIds.push(verse.id);
      failed++;
    }
  });

  clearInterval(progressInterval);
  saveCheckpoint(checkpoint);

  const elapsed = (Date.now() - startTime) / 1000;
  const rate = generated / (elapsed / 60);

  log(`\n${'─'.repeat(60)}`);
  log(`✅ Complete: ${generated} generated, ${failed} failed`);
  log(`⏱  Time: ${(elapsed / 60).toFixed(1)} min | Rate: ${rate.toFixed(1)} v/min`);
  log(`─`.repeat(60));

  db.close();
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
