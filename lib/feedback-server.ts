/**
 * The clarity-feedback collector, written against standard Request and
 * Response and a tiny key-value interface so it runs as a Cloudflare Pages
 * Function (functions/api/feedback.ts) and in tests. It stores one counter
 * per verse, rating and reason. It never stores or reads the caller's address,
 * headers (apart from the editor token on reads), cookies or any text.
 */
import { REASON_LABELS, parseSubmission, type VerseFeedback } from './feedback-protocol';

export interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  list(options: { prefix?: string; cursor?: string }): Promise<{ keys: Array<{ name: string }>; list_complete: boolean; cursor?: string }>;
}

export interface Env {
  FEEDBACK?: KV;
  EDITORIAL_TOKEN?: string;
}

const MAX_BODY = 1024;
const MAX_KEYS = 2000;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

/** Compares without stopping at the first difference. */
export function sameToken(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

async function bump(kv: KV, key: string): Promise<void> {
  const n = Number((await kv.get(key)) ?? '0');
  await kv.put(key, String((Number.isFinite(n) ? n : 0) + 1));
}

export async function handleFeedback(req: Request, env: Env): Promise<Response> {
  if (req.method === 'POST') {
    if (!env.FEEDBACK) return json({ error: 'Feedback collection is not configured.' }, 503);
    const text = await req.text();
    if (text.length > MAX_BODY) return json({ error: 'Too large.' }, 413);
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return json({ error: 'Invalid JSON.' }, 400);
    }
    const sub = parseSubmission(body);
    if (!sub) return json({ error: 'Invalid submission.' }, 400);
    await bump(env.FEEDBACK, `fb:${sub.refKey}:r:${sub.rating}`);
    for (const reason of sub.reasons) await bump(env.FEEDBACK, `fb:${sub.refKey}:w:${reason}`);
    return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  }

  if (req.method === 'GET') {
    // Reading is for editors. Without a configured token the endpoint does not exist.
    if (!env.EDITORIAL_TOKEN || !env.FEEDBACK) return json({ error: 'Not found.' }, 404);
    const given = req.headers.get('x-editorial-token') ?? '';
    if (!sameToken(given, env.EDITORIAL_TOKEN)) return json({ error: 'Unauthorized.' }, 401);
    const byRef = new Map<string, VerseFeedback>();
    let cursor: string | undefined;
    let seen = 0;
    do {
      const page = await env.FEEDBACK.list({ prefix: 'fb:', cursor });
      for (const { name } of page.keys) {
        if (++seen > MAX_KEYS) break;
        const m = /^fb:(.+):(r|w):([a-z]+)$/.exec(name);
        if (!m) continue;
        const [, refKey, kind, what] = m;
        const n = Number((await env.FEEDBACK.get(name)) ?? '0') || 0;
        const row = byRef.get(refKey) ?? { refKey, yes: 0, partly: 0, no: 0, reasons: {} };
        if (kind === 'r' && (what === 'yes' || what === 'partly' || what === 'no')) row[what] = n;
        else if (kind === 'w' && REASON_LABELS[what]) row.reasons[what] = n;
        byRef.set(refKey, row);
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor && seen <= MAX_KEYS);
    return json({ verses: Array.from(byRef.values()), truncated: seen > MAX_KEYS });
  }

  return new Response(null, { status: 405, headers: { allow: 'GET, POST' } });
}
