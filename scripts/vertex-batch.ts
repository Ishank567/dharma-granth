#!/usr/bin/env npx tsx
/**
 * Vertex AI Batch Prediction for dharma-granth interpretations.
 *
 * Subcommands:
 *   generate   – Build JSONL request file(s) + verse-ID mapping from SQLite
 *   submit     – Create GCS bucket, upload JSONL, submit batch prediction job
 *   status     – Poll job status
 *   import     – Download output, parse, validate, import to SQLite
 *
 * Usage:
 *   npx tsx scripts/vertex-batch.ts generate
 *   npx tsx scripts/vertex-batch.ts submit
 *   npx tsx scripts/vertex-batch.ts status
 *   npx tsx scripts/vertex-batch.ts import
 */

import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import { Storage } from '@google-cloud/storage';
import { GoogleAuth } from 'google-auth-library';
import {
  normalizeInterpretationPayload,
  InterpretationValidationError,
  buildInterpretationInput,
  type InterpretationPayload,
} from '../app/lib/interpretationUtils';

// ── Config ──────────────────────────────────────────────────────────
const PROJECT_ID = 'skilled-tangent-491310-b2';
const LOCATION = 'us-central1';
const MODEL_ID = 'gemini-2.0-flash-001';
const PUBLISHER_MODEL = `publishers/google/models/${MODEL_ID}`;
const BUCKET_NAME = 'dharma-granth-batch-interpret';
const SA_KEY_PATH = path.resolve(
  'C:/Users/ishan/Downloads/skilled-tangent-491310-b2-60f4ac6dad37.json'
);
const DB_PATH = path.join(process.cwd(), 'db', 'dharma.db');
const BATCH_DIR = path.join(process.cwd(), 'db', 'vertex-batch');
const STATE_PATH = path.join(BATCH_DIR, 'state.json');
const CHUNK_SIZE = 25_000; // Max requests per JSONL file

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

interface BatchState {
  bucketName: string;
  inputFiles: string[];
  mappingFile: string;
  jobName: string;
  jobId: string;
  outputPrefix: string;
  createdAt: string;
  verseCount: number;
}

// ── Helpers ─────────────────────────────────────────────────────────
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg: string) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${msg}`);
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
  try {
    return JSON.parse(raw);
  } catch {}
  let fixed = raw.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
  try {
    return JSON.parse(fixed);
  } catch {}
  fixed = fixed.replace(/("(?:[^"\\]|\\.)*")/g, (m) => {
    return m.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
  });
  try {
    return JSON.parse(fixed);
  } catch {}
  fixed = fixed.replace(/'([^']+)'\s*:/g, '"$1":');
  try {
    return JSON.parse(fixed);
  } catch {}
  throw new InterpretationValidationError('JSON repair failed');
}

// ── Vertex AI request format ────────────────────────────────────────
function buildRequestLine(prompt: string) {
  return {
    request: {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    },
  };
}

// ── GENERATE ────────────────────────────────────────────────────────
async function generate() {
  ensureDir(BATCH_DIR);
  const db = new Database(DB_PATH, { readonly: true });

  const existingIds = new Set(
    (db.prepare('SELECT verse_id FROM interpretations').all() as { verse_id: number }[]).map(
      (r) => r.verse_id
    )
  );

  const allVerses: VerseRow[] = db.prepare(
    `SELECT v.id, v.verse_number, v.original_text, v.transliteration,
            v.translation_hindi, v.translation_english,
            v.book_id, b.title as book_title, b.slug as book_slug
     FROM verses v JOIN books b ON v.book_id = b.id
     ORDER BY v.book_id, v.verse_number`
  ).all() as VerseRow[];

  const pending = allVerses.filter((v) => !existingIds.has(v.id));
  db.close();

  log(
    `Total verses: ${allVerses.length}  |  Interpreted: ${existingIds.size}  |  Pending: ${pending.length}`
  );
  if (pending.length === 0) {
    log('All verses already have interpretations!');
    return;
  }

  const mapping: { verseId: number; lineIndex: number; chunkFile: string }[] = [];
  const chunks = Math.ceil(pending.length / CHUNK_SIZE);

  for (let c = 0; c < chunks; c++) {
    const start = c * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, pending.length);
    const chunk = pending.slice(start, end);
    const filename = `batch-input-${String(c + 1).padStart(3, '0')}.jsonl`;
    const filepath = path.join(BATCH_DIR, filename);

    const lines: string[] = [];
    for (let i = 0; i < chunk.length; i++) {
      const v = chunk[i];
      const input = buildInterpretationInput({
        id: v.id,
        verse_number: v.verse_number,
        original_text: v.original_text,
        transliteration: v.transliteration || '',
        translation_hindi: v.translation_hindi || '',
        translation_english: v.translation_english || '',
        book_title: v.book_title,
        book_slug: v.book_slug,
      });
      const prompt = buildPrompt(input);
      lines.push(JSON.stringify(buildRequestLine(prompt)));
      mapping.push({ verseId: v.id, lineIndex: start + i, chunkFile: filename });
    }

    fs.writeFileSync(filepath, lines.join('\n') + '\n');
    log(`Written ${filename}  (${chunk.length} requests, ${(fs.statSync(filepath).size / 1024 / 1024).toFixed(1)} MB)`);
  }

  const mappingPath = path.join(BATCH_DIR, 'verse-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping));
  log(`Mapping saved (${mapping.length} entries)`);
  log(`\nDone — ${chunks} JSONL file(s) for ${pending.length} verses.`);
  log(`Next: npx tsx scripts/vertex-batch.ts submit`);
}

// ── SUBMIT ──────────────────────────────────────────────────────────
async function submit() {
  ensureDir(BATCH_DIR);

  const jsonlFiles = fs.readdirSync(BATCH_DIR).filter((f) => f.startsWith('batch-input-') && f.endsWith('.jsonl'));
  if (jsonlFiles.length === 0) {
    log('No JSONL files found. Run "generate" first.');
    return;
  }
  log(`Found ${jsonlFiles.length} JSONL file(s)`);

  // ── GCS ──
  const storage = new Storage({ projectId: PROJECT_ID, keyFilename: SA_KEY_PATH });

  const [buckets] = await storage.getBuckets();
  if (!buckets.some((b) => b.name === BUCKET_NAME)) {
    log(`Creating GCS bucket: ${BUCKET_NAME} in ${LOCATION}`);
    await storage.createBucket(BUCKET_NAME, { location: LOCATION });
  } else {
    log(`Bucket ${BUCKET_NAME} exists`);
  }

  const bucket = storage.bucket(BUCKET_NAME);
  const gcsUris: string[] = [];

  for (const file of jsonlFiles) {
    const gcsPath = `input/${file}`;
    log(`Uploading ${file}...`);
    await bucket.upload(path.join(BATCH_DIR, file), { destination: gcsPath });
    gcsUris.push(`gs://${BUCKET_NAME}/${gcsPath}`);
    log(`  → gs://${BUCKET_NAME}/${gcsPath}`);
  }

  // ── Submit batch job via REST API ──
  const auth = new GoogleAuth({
    keyFile: SA_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();

  const outputPrefix = `gs://${BUCKET_NAME}/output/${Date.now()}/`;
  const displayName = `dharma-interpret-${new Date().toISOString().slice(0, 10)}`;

  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/batchPredictionJobs`;
  const body = {
    displayName,
    model: PUBLISHER_MODEL,
    inputConfig: {
      instancesFormat: 'jsonl',
      gcsSource: { uris: gcsUris },
    },
    outputConfig: {
      predictionsFormat: 'jsonl',
      gcsDestination: { outputUriPrefix: outputPrefix },
    },
  };

  log('Submitting batch prediction job...');
  const response = await client.request({ url, method: 'POST', data: body });
  const job = response.data as Record<string, unknown>;

  log(`Job created: ${job.name}`);
  log(`State: ${job.state}`);

  // Save state
  const mappingPath = path.join(BATCH_DIR, 'verse-mapping.json');
  const mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

  const state: BatchState = {
    bucketName: BUCKET_NAME,
    inputFiles: gcsUris,
    mappingFile: mappingPath,
    jobName: job.name as string,
    jobId: (job.name as string).split('/').pop()!,
    outputPrefix,
    createdAt: new Date().toISOString(),
    verseCount: mappingData.length,
  };
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  log(`State saved → ${STATE_PATH}`);
  log(`\nNext: npx tsx scripts/vertex-batch.ts status`);
}

// ── STATUS ──────────────────────────────────────────────────────────
async function status() {
  if (!fs.existsSync(STATE_PATH)) {
    log('No state file. Run "submit" first.');
    return;
  }
  const state: BatchState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));

  const auth = new GoogleAuth({
    keyFile: SA_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();

  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/${state.jobName}`;
  const { data: job } = (await client.request({ url, method: 'GET' })) as { data: Record<string, any> };

  log(`Job: ${job.displayName}`);
  log(`State: ${job.state}`);
  log(`Created: ${job.createTime}`);
  if (job.startTime) log(`Started: ${job.startTime}`);
  if (job.endTime) log(`Ended:   ${job.endTime}`);
  if (job.completionStats) {
    const s = job.completionStats;
    log(`Completed:  ${s.successfulCount ?? 0}`);
    log(`Failed:     ${s.failedCount ?? 0}`);
    log(`Incomplete: ${s.incompleteCount ?? 0}`);
  }
  if (job.error) {
    log(`Error: ${JSON.stringify(job.error)}`);
  }

  // Return state string for callers
  return job.state as string;
}

// ── IMPORT ──────────────────────────────────────────────────────────
async function importResults() {
  if (!fs.existsSync(STATE_PATH)) {
    log('No state file. Run "submit" first.');
    return;
  }
  const state: BatchState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));

  // Load mapping
  const mapping: { verseId: number; lineIndex: number; chunkFile: string }[] = JSON.parse(
    fs.readFileSync(state.mappingFile, 'utf8')
  );

  // Download output files from GCS
  const storage = new Storage({ projectId: PROJECT_ID, keyFilename: SA_KEY_PATH });
  const bucket = storage.bucket(state.bucketName);
  const outputDir = path.join(BATCH_DIR, 'output');
  ensureDir(outputDir);

  const prefix = state.outputPrefix.replace(`gs://${state.bucketName}/`, '');
  const [files] = await bucket.getFiles({ prefix });
  const jsonlFiles = files.filter((f) => f.name.endsWith('.jsonl'));
  log(`Found ${jsonlFiles.length} output file(s)`);

  if (jsonlFiles.length === 0) {
    log('No output files yet. Job may still be running — check "status" first.');
    return;
  }

  // Download and collect all output lines
  const allOutputLines: string[] = [];
  for (const file of jsonlFiles) {
    const localPath = path.join(outputDir, path.basename(file.name));
    await file.download({ destination: localPath });
    const content = fs.readFileSync(localPath, 'utf8');
    allOutputLines.push(...content.trim().split('\n').filter(Boolean));
    log(`Downloaded ${path.basename(file.name)} (${content.trim().split('\n').length} lines)`);
  }

  log(`Total output lines: ${allOutputLines.length}  |  Mapping entries: ${mapping.length}`);
  if (allOutputLines.length !== mapping.length) {
    log(`⚠  Count mismatch — will import available results`);
  }

  // Import to SQLite
  const db = new Database(DB_PATH);
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO interpretations
      (verse_id, shabdarth, bhavarth, simple_example, guided_learning,
       scientific_temperament, modern_relevance, next_curiosity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let imported = 0;
  let failed = 0;
  const errors: { verseId: number; error: string }[] = [];

  const importTx = db.transaction(() => {
    const count = Math.min(allOutputLines.length, mapping.length);
    for (let i = 0; i < count; i++) {
      const entry = mapping[i];
      try {
        const output = JSON.parse(allOutputLines[i]);

        // Check batch status field
        if (output.status && output.status !== '') {
          errors.push({ verseId: entry.verseId, error: `Batch status: ${output.status}` });
          failed++;
          continue;
        }

        const text = output.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          errors.push({ verseId: entry.verseId, error: 'No text in response' });
          failed++;
          continue;
        }

        const jsonStr = extractJson(text);
        const parsed = repairAndParseJson(jsonStr);
        const validated = normalizeInterpretationPayload(parsed);

        insertStmt.run(
          entry.verseId,
          validated.shabdarth,
          validated.bhavarth,
          validated.simple_example,
          validated.guided_learning,
          validated.scientific_temperament,
          validated.modern_relevance,
          validated.next_curiosity
        );
        imported++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push({ verseId: entry.verseId, error: msg });
        failed++;
      }
    }
  });

  importTx();
  db.close();

  log(`\n── Import Results ──`);
  log(`  Imported:  ${imported}`);
  log(`  Failed:    ${failed}`);
  log(`  Total:     ${imported + failed}`);

  if (errors.length > 0) {
    const errPath = path.join(BATCH_DIR, 'import-errors.json');
    fs.writeFileSync(errPath, JSON.stringify(errors.slice(0, 500), null, 2));
    log(`  First ${Math.min(errors.length, 500)} errors → ${errPath}`);
  }
}

// ── MAIN ────────────────────────────────────────────────────────────
const cmd = process.argv[2];

(async () => {
  try {
    switch (cmd) {
      case 'generate':
        await generate();
        break;
      case 'submit':
        await submit();
        break;
      case 'status':
        await status();
        break;
      case 'import':
        await importResults();
        break;
      default:
        console.log(`Usage: npx tsx scripts/vertex-batch.ts <generate|submit|status|import>\n`);
        console.log(`  generate  – Build JSONL requests from DB (79K verses)`);
        console.log(`  submit    – Upload to GCS + start Vertex AI batch job`);
        console.log(`  status    – Check batch job progress`);
        console.log(`  import    – Download results + import to SQLite`);
    }
  } catch (err) {
    console.error('Fatal:', err);
    process.exit(1);
  }
})();
