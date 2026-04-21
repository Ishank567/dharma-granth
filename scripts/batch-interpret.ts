import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  normalizeInterpretationPayload,
  InterpretationValidationError,
  buildInterpretationInput,
  type InterpretationPayload,
} from '../app/lib/interpretationUtils';

const PROJECT_ROOT = path.resolve(__dirname, '..');

const PROCESS_WITH_ENV = process as typeof process & {
  loadEnvFile?: (path?: string) => void;
};
PROCESS_WITH_ENV.loadEnvFile?.(path.join(PROJECT_ROOT, '.env.local'));

// ── Config ──────────────────────────────────────────────────────────
const BATCH_LIMIT = Number(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] || 0);
const BOOK_FILTER = process.argv.find(a => a.startsWith('--book='))?.split('=')[1];
const BOOKS_FILTER = process.argv.find(a => a.startsWith('--books='))?.split('=')[1]; // comma-separated IDs
const SKIP_EXISTING = process.argv.includes('--skip-existing');
const DRY_RUN = process.argv.includes('--dry-run');
const MAX_LANES = Number(process.argv.find(a => a.startsWith('--max-lanes='))?.split('=')[1] || 0);
const LANE_RPM = 2; // RPM per lane — very conservative to avoid 429s across many lanes
const MAX_RETRIES_PER_VERSE = 5;
const RETRY_BACKOFF_MS = [10000, 30000, 60000, 90000, 120000]; // Progressive backoff for retries

const DB_PATH = path.join(PROJECT_ROOT, 'db', 'dharma.db');
const CHECKPOINT_PATH = path.join(PROJECT_ROOT, 'db', 'batch-interpret-checkpoint.json');
const LOG_PATH = path.join(PROJECT_ROOT, 'db', 'batch-interpret-log.txt');

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
  chapter_id: number | null;
  chapter_title: string | null;
}

interface Checkpoint {
  completedVerseIds: number[];
  failedVerseIds: number[];
  lastUpdated: string;
}

// ── State ───────────────────────────────────────────────────────────
let generated = 0;
let skipped = 0;
let failed = 0;
const startTime = Date.now();

// ── Lane (key+model pair with independent rate limiter) ─────────────
interface Lane {
  id: string;
  key: string;
  model: string;
  genModel: ReturnType<ReturnType<typeof GoogleGenerativeAI.prototype.getGenerativeModel>['generateContent']> extends Promise<infer R> ? never : ReturnType<InstanceType<typeof GoogleGenerativeAI>['getGenerativeModel']>;
  timestamps: number[];
  alive: boolean;
}

function buildLanes(): Lane[] {
  const keys = [
    process.env.GOOGLE_GEMINI_API_KEY,
    process.env.GOOGLE_GEMINI_API_KEY_2,
    process.env.GOOGLE_GEMINI_API_KEY_3,
    process.env.GOOGLE_GEMINI_API_KEY_4,
    process.env.GOOGLE_GEMINI_API_KEY_5,
    process.env.GOOGLE_GEMINI_API_KEY_6,
    process.env.GOOGLE_GEMINI_API_KEY_7,
    process.env.GOOGLE_GEMINI_API_KEY_8,
    process.env.GOOGLE_GEMINI_API_KEY_9,
    // K10 skipped — project denied access (403)
  ].filter(Boolean) as string[];

  // Both models — free-tier quotas are per-(project, model), so each key gets
  // separate RPD quotas per model. Using both doubles effective throughput.
  const models = ['gemini-2.5-flash'];
  const lanes: Lane[] = [];

  for (const [ki, key] of keys.entries()) {
    for (const model of models) {
      lanes.push({
        id: `K${ki + 1}:${model.replace('gemini-', '').replace('-preview', '')}`,
        key,
        model,
        genModel: new GoogleGenerativeAI(key).getGenerativeModel({ model }),
        timestamps: [],
        alive: true,
      });
    }
  }
  const result = MAX_LANES > 0 ? lanes.slice(0, MAX_LANES) : lanes;
  return result;
}

async function waitForLaneRateLimit(lane: Lane) {
  const now = Date.now();
  while (lane.timestamps.length > 0 && lane.timestamps[0]! < now - 60_000) {
    lane.timestamps.shift();
  }
  if (lane.timestamps.length >= LANE_RPM) {
    const waitMs = 60_000 - (now - lane.timestamps[0]!) + 1000;
    log(`  ⏳ [${lane.id}] Rate limit: waiting ${Math.ceil(waitMs / 1000)}s...`);
    await sleep(waitMs);
  }
  lane.timestamps.push(Date.now());
}

// ── Helpers ─────────────────────────────────────────────────────────
function ts() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function log(msg: string) {
  const line = `[${ts()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + '\n');
}

function loadCheckpoint(): Checkpoint {
  try {
    if (fs.existsSync(CHECKPOINT_PATH)) {
      return JSON.parse(fs.readFileSync(CHECKPOINT_PATH, 'utf-8'));
    }
  } catch { /* ignore corrupt checkpoint */ }
  return { completedVerseIds: [], failedVerseIds: [], lastUpdated: new Date().toISOString() };
}

function saveCheckpoint(cp: Checkpoint) {
  cp.lastUpdated = new Date().toISOString();
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(cp, null, 2));
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Gemini ──────────────────────────────────────────────────────────

function buildPrompt(input: ReturnType<typeof buildInterpretationInput>) {
  const translationBlock = [
    input.translationHindi ? `हिन्दी अर्थ-सूत्र: ${input.translationHindi}` : '',
    input.translationEnglish ? `अंग्रेज़ी अर्थ-सूत्र: ${input.translationEnglish}` : '',
  ].filter(Boolean).join('\n');

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
  // First try direct parse
  try { return JSON.parse(raw); } catch {}
  // Strip control chars except \n \r \t
  let fixed = raw.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
  try { return JSON.parse(fixed); } catch {}
  // Replace literal newlines inside string values with \n
  fixed = fixed.replace(/("(?:[^"\\]|\\.)*")/g, (m) => {
    return m.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
  });
  try { return JSON.parse(fixed); } catch {}
  // Try replacing single quotes with double quotes for keys
  fixed = fixed.replace(/'([^']+)'\s*:/g, '"$1":');
  try { return JSON.parse(fixed); } catch {}
  throw new InterpretationValidationError('JSON repair failed');
}

async function generateForVerse(
  lane: Lane,
  verse: VerseRow
): Promise<InterpretationPayload> {
  const input = buildInterpretationInput({
    id: verse.id,
    verse_number: verse.verse_number,
    original_text: verse.original_text,
    transliteration: verse.transliteration || '',
    translation_hindi: verse.translation_hindi || '',
    translation_english: verse.translation_english || '',
    book_title: verse.book_title,
    book_slug: verse.book_slug,
    chapter_title: verse.chapter_title || '',
  });

  const prompt = buildPrompt(input);
  const result = await lane.genModel.generateContent(prompt);
  const text = result.response.text();
  return normalizeInterpretationPayload(repairAndParseJson(extractJson(text)));
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const db = new Database(DB_PATH);
  const lanes = buildLanes();
  const checkpoint = loadCheckpoint();
  const completedSet = new Set(checkpoint.completedVerseIds);

  // Probe which lanes actually work (stagger probes to avoid rate-limiting)
  log('🔍 Probing lanes...');
  for (const lane of lanes) {
    try {
      await lane.genModel.generateContent('Say hi');
      log(`  ✅ ${lane.id}: OK`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRateLimit = msg.includes('429') || msg.includes('Too many requests') || msg.includes('quota');
      if (isRateLimit) {
        // Rate-limited during probe → assume lane is alive to avoid false negatives
        log(`  ⚠️  ${lane.id}: rate-limited during probe, assuming alive`);
      } else {
        lane.alive = false;
        log(`  ❌ ${lane.id}: unavailable (${msg.substring(0, 60)})`);
      }
    }
    await sleep(400); // stagger probes to avoid exhausting RPM
  }
  const activeLanes = lanes.filter(l => l.alive);
  if (activeLanes.length === 0) {
    log('💥 No working lanes! Check API keys.');
    return;
  }

  // Get all verses that need interpretation
  let query = `
    SELECT v.id, v.verse_number, v.original_text, v.transliteration,
           v.translation_hindi, v.translation_english, v.book_id,
           v.chapter_id, b.title as book_title, b.slug as book_slug,
           c.title as chapter_title
    FROM verses v
    JOIN books b ON b.id = v.book_id
    LEFT JOIN chapters c ON c.id = v.chapter_id
  `;
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (SKIP_EXISTING) {
    conditions.push('v.id NOT IN (SELECT verse_id FROM interpretations)');
  }
  if (BOOK_FILTER) {
    const bookId = Number(BOOK_FILTER);
    if (!isNaN(bookId)) {
      conditions.push('v.book_id = ?');
      params.push(bookId);
    } else {
      conditions.push('b.slug = ?');
      params.push(BOOK_FILTER);
    }
  }
  if (BOOKS_FILTER) {
    const bookIds = BOOKS_FILTER.split(',').map(Number).filter(n => !isNaN(n));
    if (bookIds.length > 0) {
      conditions.push(`v.book_id IN (${bookIds.map(() => '?').join(',')})`);
      params.push(...bookIds);
    }
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY v.book_id, v.verse_number';
  if (BATCH_LIMIT > 0) {
    query += ` LIMIT ${BATCH_LIMIT}`;
  }

  const allVerses = db.prepare(query).all(...params) as VerseRow[];
  const verses = allVerses.filter(v => !completedSet.has(v.id));

  log('━'.repeat(60));
  log(`🚀 Batch Interpretation Generation (Parallel Lanes)`);
  log(`   Lanes: ${activeLanes.map(l => l.id).join(', ')} | RPM/lane: ${LANE_RPM}`);
  log(`   Effective RPM: ~${activeLanes.length * LANE_RPM}`);
  log(`   Total: ${allVerses.length} verses, ${verses.length} remaining`);
  if (BATCH_LIMIT) log(`   Limit: ${BATCH_LIMIT}`);
  if (BOOK_FILTER) log(`   Book filter: ${BOOK_FILTER}`);
  if (BOOKS_FILTER) log(`   Books filter: ${BOOKS_FILTER}`);
  if (SKIP_EXISTING) log(`   Skipping existing interpretations`);
  if (DRY_RUN) log(`   🔸 DRY RUN — no writes`);
  log('━'.repeat(60));

  if (verses.length === 0) {
    log('✅ Nothing to do!');
    return;
  }

  // Group by book for logging
  const bookGroups = new Map<number, { title: string; count: number }>();
  for (const v of verses) {
    const existing = bookGroups.get(v.book_id);
    if (existing) existing.count++;
    else bookGroups.set(v.book_id, { title: v.book_title, count: 1 });
  }
  log(`📚 Books to process: ${bookGroups.size}`);
  for (const [id, info] of bookGroups) {
    log(`   [${id}] ${info.title}: ${info.count} verses`);
  }

  const saveStmt = db.prepare(`
    INSERT OR REPLACE INTO interpretations (
      verse_id, shabdarth, bhavarth, simple_example,
      guided_learning, scientific_temperament, modern_relevance,
      next_curiosity, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ai')
  `);

  // Thread-safe verse queue
  let nextIdx = 0;
  function getNextVerse(): VerseRow | null {
    if (nextIdx >= verses.length) return null;
    return verses[nextIdx++]!;
  }

  // Each lane runs as an independent async worker
  async function laneWorker(lane: Lane) {
    let laneGenerated = 0;
    let laneBook = '';

    while (true) {
      const verse = getNextVerse();
      if (!verse) break;

      if (verse.book_title !== laneBook) {
        laneBook = verse.book_title;
        log(`\n📘 [${lane.id}] ${laneBook}`);
      }

      await waitForLaneRateLimit(lane);

      if (DRY_RUN) {
        log(`  🔸 [${lane.id}] [DRY] Verse ${verse.id} (#${verse.verse_number})`);
        skipped++;
        continue;
      }

      let retries = 0;
      let success = false;

      while (retries <= MAX_RETRIES_PER_VERSE) {
        try {
          const payload = await generateForVerse(lane, verse);
          saveStmt.run(
            verse.id,
            payload.shabdarth,
            payload.bhavarth,
            payload.simple_example,
            payload.guided_learning,
            payload.scientific_temperament,
            payload.modern_relevance,
            payload.next_curiosity
          );
          checkpoint.completedVerseIds.push(verse.id);
          generated++;
          laneGenerated++;
          log(`  ✅ [${lane.id}] Verse ${verse.id} (${verse.book_title} #${verse.verse_number})`);
          success = true;
          break;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const isRateLimit = msg.includes('429') || msg.includes('Too many requests');
          const isQuotaError = msg.includes('Quota') || msg.includes('Limit') || msg.includes('quota');
          const isServerError = msg.includes('403') || msg.includes('404') || msg.includes('500');
          const isJsonError = msg.includes('JSON') || msg.includes('parse');
          
          // Rate limit: aggressive backoff with jitter
          if (isRateLimit && retries < MAX_RETRIES_PER_VERSE) {
            const backoff = RETRY_BACKOFF_MS[Math.min(retries, RETRY_BACKOFF_MS.length - 1)]!;
            const jitter = Math.floor(Math.random() * 5000);
            log(`  ⏳ [${lane.id}] Rate limited (429) on verse ${verse.id}, retry ${retries + 1}/${MAX_RETRIES_PER_VERSE} in ${Math.ceil((backoff + jitter) / 1000)}s...`);
            await sleep(backoff + jitter);
            retries++;
            continue;
          }
          // Server errors (403, 404, 500): retry with backoff
          if (isServerError && retries < 2) {
            const backoff = RETRY_BACKOFF_MS[Math.min(retries, RETRY_BACKOFF_MS.length - 1)]!;
            log(`  ⏳ [${lane.id}] Server error on verse ${verse.id}, retry ${retries + 1}/${MAX_RETRIES_PER_VERSE} in ${backoff / 1000}s...`);
            await sleep(backoff);
            retries++;
            continue;
          }
          // Quota errors: wait longer
          if (isQuotaError && retries < MAX_RETRIES_PER_VERSE) {
            const backoff = RETRY_BACKOFF_MS[Math.min(retries + 1, RETRY_BACKOFF_MS.length - 1)]!;
            const jitter = Math.floor(Math.random() * 10000);
            log(`  ⏳ [${lane.id}] Quota error on verse ${verse.id}, retry ${retries + 1}/${MAX_RETRIES_PER_VERSE} in ${Math.ceil((backoff + jitter) / 1000)}s...`);
            await sleep(backoff + jitter);
            retries++;
            continue;
          }
          // JSON parse errors: retry up to 2 times
          if (isJsonError && retries < 2) {
            log(`  ⏳ [${lane.id}] JSON parse error on verse ${verse.id}, retry ${retries + 1}/${MAX_RETRIES_PER_VERSE}...`);
            await waitForLaneRateLimit(lane);
            retries++;
            continue;
          }
          // Failed after retries
          checkpoint.failedVerseIds.push(verse.id);
          failed++;
          log(`  ❌ [${lane.id}] Verse ${verse.id} (attempt ${retries + 1}): ${msg.substring(0, 100)}`);
          break;
        }
      }

      // Save checkpoint every few verses
      if ((laneGenerated % 5) === 0) {
        saveCheckpoint(checkpoint);
      }

      // Progress report every 25 verses per lane
      if (laneGenerated > 0 && laneGenerated % 25 === 0) {
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = generated / (elapsed / 60);
        const remaining = verses.length - nextIdx;
        const eta = rate > 0 ? Math.ceil(remaining / rate) : 0;
        log(`  📊 [${lane.id}] Progress: ${generated} done, ${failed} failed, ${remaining} left — ${rate.toFixed(1)} v/min — ETA: ${eta} min`);
      }
    }

    saveCheckpoint(checkpoint);
    log(`  🏁 [${lane.id}] Lane finished: ${laneGenerated} generated`);
  }

  // Run all lanes in parallel, staggered to avoid t=0 burst
  log(`\n🏎️  Starting ${activeLanes.length} parallel lanes (staggered 7s)...\n`);
  await Promise.all(activeLanes.map((lane, i) =>
    sleep(i * 7000).then(() => laneWorker(lane))
  ));

  const elapsed = (Date.now() - startTime) / 1000;
  log('\n' + '━'.repeat(60));
  log(`✅ Done! ${generated} generated, ${failed} failed, ${skipped} skipped`);
  log(`⏱️  Total time: ${elapsed > 60 ? `${Math.floor(elapsed / 60)}m ${Math.floor(elapsed % 60)}s` : `${Math.floor(elapsed)}s`}`);
  log(`📈 Rate: ${(generated / (elapsed / 60)).toFixed(1)} verses/min`);
  log(`📁 Checkpoint: ${CHECKPOINT_PATH}`);
  log(`📝 Log: ${LOG_PATH}`);
  log('━'.repeat(60));

  db.close();
}

main().catch(err => {
  log(`💥 Fatal: ${err.message}`);
  process.exit(1);
});
