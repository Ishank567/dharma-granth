import Database from 'better-sqlite3';
import path from 'path';

interface TargetVerse {
  id: number;
  verseNumber: number;
  bookSlug: string;
  categorySlug: string;
  bookTitle: string;
}

interface VerificationResult {
  targetVerse: TargetVerse;
  page?: {
    status: number;
    hasVerseHeading: boolean;
    hasDevDiagnostics: boolean;
    hasOfflineSeedButton: boolean;
    error: string | null;
  };
  api?: {
    offlineStatus: string | null;
    offlineSource: string | null;
    offlineFallbackReason: string | null;
    upgradedStatus: string | null;
    upgradedSource: string | null;
    error: string | null;
  };
}

const dbPath = path.join(process.cwd(), 'db', 'dharma.db');

interface VerificationOptions {
  baseUrl: string;
  verseId?: number;
  skipPage: boolean;
  skipApi: boolean;
  simulateUpgrade: boolean;
  timeoutMs: number;
}

function parseOptions() {
  const args = process.argv.slice(2);
  const options: VerificationOptions = {
    baseUrl: process.env.DHARMA_VERIFY_BASE_URL || 'http://localhost:3000',
    skipPage: false,
    skipApi: false,
    simulateUpgrade: false,
    timeoutMs: 30_000,
  };

  for (const arg of args) {
    if (arg === '--skip-page') {
      options.skipPage = true;
      continue;
    }

    if (arg === '--skip-api') {
      options.skipApi = true;
      continue;
    }

    if (arg === '--simulate-upgrade') {
      options.simulateUpgrade = true;
      continue;
    }

    if (arg.startsWith('--baseUrl=')) {
      options.baseUrl = arg.slice('--baseUrl='.length) || options.baseUrl;
      continue;
    }

    if (arg.startsWith('--verseId=')) {
      const parsed = Number(arg.slice('--verseId='.length));
      if (!Number.isNaN(parsed)) {
        options.verseId = parsed;
      }
      continue;
    }

    if (arg.startsWith('--timeoutMs=')) {
      const parsed = Number(arg.slice('--timeoutMs='.length));
      if (!Number.isNaN(parsed) && parsed > 0) {
        options.timeoutMs = parsed;
      }
    }
  }

  return options;
}

function getTargetVerse(verseId?: number) {
  const db = new Database(dbPath, { readonly: true });

  try {
    if (verseId) {
      return db.prepare(`
        SELECT v.id, v.verse_number AS verseNumber, b.slug AS bookSlug,
               c.slug AS categorySlug, b.title_hindi AS bookTitle
        FROM verses v
        JOIN books b ON b.id = v.book_id
        JOIN categories c ON c.id = b.category_id
        WHERE v.id = ?
      `).get(verseId) as TargetVerse | undefined;
    }

    return db.prepare(`
      SELECT v.id, v.verse_number AS verseNumber, b.slug AS bookSlug,
             c.slug AS categorySlug, b.title_hindi AS bookTitle
      FROM verses v
      JOIN books b ON b.id = v.book_id
      JOIN categories c ON c.id = b.category_id
      ORDER BY v.id
      LIMIT 1
    `).get() as TargetVerse | undefined;
  } finally {
    db.close();
  }
}

async function fetchText(url: string, timeoutMs: number) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  const text = await response.text();
  return { response, text };
}

async function fetchJson(url: string, payload: Record<string, unknown>, timeoutMs: number) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const text = await response.text();

  try {
    return { response, json: JSON.parse(text) as Record<string, unknown>, text };
  } catch {
    return { response, json: null, text };
  }
}

async function main() {
  const options = parseOptions();
  const targetVerse = getTargetVerse(options.verseId);

  if (!targetVerse) {
    throw new Error('सत्यापन के लिए कोई श्लोक नहीं मिला');
  }

  const result: VerificationResult = {
    targetVerse,
  };

  const checks: { label: string; pass: boolean; detail?: string }[] = [];

  if (!options.skipPage) {
    const verseUrl = `${options.baseUrl}/categories/${targetVerse.categorySlug}/${targetVerse.bookSlug}/${targetVerse.id}`;

    try {
      const page = await fetchText(verseUrl, options.timeoutMs);
      result.page = {
        status: page.response.status,
        hasVerseHeading: page.text.includes(`श्लोक ${targetVerse.verseNumber}`),
        hasDevDiagnostics: page.text.includes('Dev Diagnostics'),
        hasOfflineSeedButton: page.text.includes('fallback seed'),
        error: page.response.ok ? null : `HTTP ${page.response.status}`,
      };

      checks.push({
        label: 'page returns 200',
        pass: result.page.status === 200,
        detail: `status=${result.page.status}`,
      });
      checks.push({
        label: 'page contains verse heading',
        pass: result.page.hasVerseHeading,
        detail: `श्लोक ${targetVerse.verseNumber}`,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      result.page = {
        status: 0,
        hasVerseHeading: false,
        hasDevDiagnostics: false,
        hasOfflineSeedButton: false,
        error: msg,
      };
      checks.push({ label: 'page reachable', pass: false, detail: msg });
    }
  }

  if (!options.skipApi) {
    try {
      const offline = await fetchJson(
        `${options.baseUrl}/api/interpret`,
        {
          verseId: targetVerse.id,
          debugMode: 'force-offline',
        },
        options.timeoutMs
      );

      const offlineSource = (offline.json?.interpretation as { source?: string } | undefined)?.source ?? null;
      const offlineStatus = (offline.json?.status as string | undefined) ?? null;

      checks.push({
        label: 'offline seed returns 200',
        pass: offline.response.ok,
        detail: `status=${offline.response.status}`,
      });
      checks.push({
        label: 'offline source is "offline"',
        pass: offlineSource === 'offline',
        detail: `source=${offlineSource}`,
      });
      checks.push({
        label: 'offline status is "fallback"',
        pass: offlineStatus === 'fallback',
        detail: `status=${offlineStatus}`,
      });

      const upgraded = await fetchJson(
        `${options.baseUrl}/api/interpret`,
        options.simulateUpgrade
          ? {
              verseId: targetVerse.id,
              debugMode: 'force-ai-upgrade',
            }
          : {
              verseId: targetVerse.id,
            },
        options.timeoutMs
      );

      const upgradedSource = (upgraded.json?.interpretation as { source?: string } | undefined)?.source ?? null;
      const upgradedStatus = (upgraded.json?.status as string | undefined) ?? null;

      if (options.simulateUpgrade) {
        checks.push({
          label: 'simulated upgrade source is "ai"',
          pass: upgradedSource === 'ai',
          detail: `source=${upgradedSource}`,
        });
        checks.push({
          label: 'simulated upgrade status is "upgraded"',
          pass: upgradedStatus === 'upgraded',
          detail: `status=${upgradedStatus}`,
        });
      }

      result.api = {
        offlineStatus,
        offlineSource,
        offlineFallbackReason: (offline.json?.fallbackReason as string | undefined) ?? null,
        upgradedStatus,
        upgradedSource,
        error:
          !offline.response.ok || !upgraded.response.ok
            ? `offline=${offline.response.status}, upgraded=${upgraded.response.status}`
            : null,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      result.api = {
        offlineStatus: null,
        offlineSource: null,
        offlineFallbackReason: null,
        upgradedStatus: null,
        upgradedSource: null,
        error: msg,
      };
      checks.push({ label: 'API reachable', pass: false, detail: msg });
    }
  }

  // ── Report ──
  const passed = checks.filter((c) => c.pass).length;
  const failed = checks.filter((c) => !c.pass).length;

  console.log('');
  console.log('─── Interpretation Flow Verification ───');
  console.log(`Verse: #${targetVerse.id}  (${targetVerse.bookTitle})`);
  console.log('');

  for (const c of checks) {
    const icon = c.pass ? '✓' : '✗';
    const detailStr = c.detail ? `  (${c.detail})` : '';
    console.log(`  ${icon}  ${c.label}${detailStr}`);
  }

  console.log('');
  console.log(`Result: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log('');
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});