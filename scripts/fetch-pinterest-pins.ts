// Pulls pins from your Pinterest account and bakes them into
// data/pinterest-quotes.ts as static "wisdom" cards for the dashboard.
//
// The site is statically exported (next.config.js: output: 'export'), so
// there is no server at runtime to hold your Pinterest client secret or do
// a live OAuth exchange — this script runs once locally (or whenever you
// want to refresh), and its output gets committed/built like any other
// data file.
//
// Setup:
//   1. Register an app at https://developers.pinterest.com/ (redirect URI:
//      http://127.0.0.1:8734/callback).
//   2. Add to .env.local:
//        PINTEREST_CLIENT_ID=...
//        PINTEREST_CLIENT_SECRET=...
//        PINTEREST_BOARD_ID=...   (optional — restrict to one board)
//   3. Run: npm run fetch:pinterest
//      A browser tab opens for you to log in to Pinterest and authorize the
//      app yourself. The script prints a PINTEREST_REFRESH_TOKEN afterward —
//      save it into .env.local so future runs skip the browser step.

import * as http from 'node:http';
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Minimal .env.local loader — tsx doesn't auto-load env files the way `next dev` does. */
function loadEnvLocal() {
  const envPath = resolve(__dirname, '../.env.local');
  let contents: string;
  try {
    contents = readFileSync(envPath, 'utf-8');
  } catch {
    return;
  }
  for (const line of contents.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

const CLIENT_ID = process.env.PINTEREST_CLIENT_ID;
const CLIENT_SECRET = process.env.PINTEREST_CLIENT_SECRET;
const BOARD_ID = process.env.PINTEREST_BOARD_ID;
const REFRESH_TOKEN = process.env.PINTEREST_REFRESH_TOKEN;

const REDIRECT_URI = 'http://127.0.0.1:8734/callback';
const SCOPES = 'boards:read,pins:read';
const OUTPUT_PATH = resolve(__dirname, '../data/pinterest-quotes.ts');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    'Missing PINTEREST_CLIENT_ID / PINTEREST_CLIENT_SECRET in .env.local.\n' +
      'Register an app at https://developers.pinterest.com/ first — see the ' +
      'comment at the top of this script for the full setup steps.'
  );
  process.exit(1);
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

function basicAuthHeader(): string {
  return `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;
}

async function requestToken(body: URLSearchParams): Promise<TokenResponse> {
  const response = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: basicAuthHeader(),
    },
    body: body.toString(),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Pinterest OAuth failed (${response.status}): ${text}`);
  }
  return (await response.json()) as TokenResponse;
}

/** Opens the Pinterest consent screen and waits for the OAuth redirect on localhost. */
async function authorizeInteractively(): Promise<string> {
  const state = Math.random().toString(36).slice(2);
  const authUrl =
    `https://www.pinterest.com/oauth/?client_id=${encodeURIComponent(CLIENT_ID!)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code&scope=${encodeURIComponent(SCOPES)}&state=${state}`;

  console.log('\nOpen this URL in your browser and authorize the app with your own Pinterest login:\n');
  console.log(authUrl + '\n');
  console.log('Waiting for the redirect back to ' + REDIRECT_URI + ' ...');

  const code = await new Promise<string>((promiseResolve, promiseReject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? '/', REDIRECT_URI);
      if (url.pathname !== '/callback') {
        res.writeHead(404).end();
        return;
      }
      const returnedState = url.searchParams.get('state');
      const returnedCode = url.searchParams.get('code');
      const error = url.searchParams.get('error');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<p>Pinterest authorization complete — you can close this tab.</p>');
      server.close();
      if (error) {
        promiseReject(new Error(`Pinterest denied authorization: ${error}`));
      } else if (!returnedCode || returnedState !== state) {
        promiseReject(new Error('Pinterest OAuth response missing/mismatched state.'));
      } else {
        promiseResolve(returnedCode);
      }
    });
    server.listen(8734);
  });

  return code;
}

async function getAccessToken(): Promise<string> {
  if (REFRESH_TOKEN) {
    const token = await requestToken(
      new URLSearchParams({ grant_type: 'refresh_token', refresh_token: REFRESH_TOKEN })
    );
    return token.access_token;
  }

  const code = await authorizeInteractively();
  const token = await requestToken(
    new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI })
  );
  if (token.refresh_token) {
    console.log(
      '\nSave this to .env.local so future runs skip the browser step:\n' +
        `PINTEREST_REFRESH_TOKEN=${token.refresh_token}\n`
    );
  }
  return token.access_token;
}

interface PinterestApiPin {
  id: string;
  title?: string;
  description?: string;
  alt_text?: string;
  link?: string;
  board_id?: string;
  media?: { images?: Record<string, { url?: string }> };
}

function bestImageUrl(media?: PinterestApiPin['media']): string | undefined {
  const images = media?.images;
  if (!images) return undefined;
  return (
    images.original?.url ??
    images['1200x1200']?.url ??
    images['600x315']?.url ??
    Object.values(images).find((img) => img?.url)?.url
  );
}

async function fetchAllPins(accessToken: string): Promise<PinterestApiPin[]> {
  const pins: PinterestApiPin[] = [];
  const basePath = BOARD_ID ? `/boards/${BOARD_ID}/pins/` : '/pins/';
  let bookmark: string | undefined;

  for (let page = 0; page < 40; page++) {
    const qs = new URLSearchParams({ page_size: '25' });
    if (bookmark) qs.set('bookmark', bookmark);

    const response = await fetch(`https://api.pinterest.com/v5${basePath}?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Pinterest API error (${response.status}): ${text}`);
    }
    const data = (await response.json()) as { items?: PinterestApiPin[]; bookmark?: string };
    pins.push(...(data.items ?? []));
    bookmark = data.bookmark;
    if (!bookmark) break;
  }

  return pins;
}

interface BoardsById {
  [id: string]: string;
}

async function fetchBoardNames(accessToken: string): Promise<BoardsById> {
  const response = await fetch('https://api.pinterest.com/v5/boards/?page_size=100', {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
  });
  if (!response.ok) return {};
  const data = (await response.json()) as { items?: Array<{ id: string; name: string }> };
  const map: BoardsById = {};
  for (const b of data.items ?? []) map[b.id] = b.name;
  return map;
}

function toSourceLiteral(pins: PinterestApiPin[], boardNames: BoardsById): string {
  const entries = pins
    .map((p) => {
      const quote = (p.title || p.description || p.alt_text || '').trim();
      const imageUrl = bestImageUrl(p.media);
      if (!quote || !imageUrl) return null;
      const board = p.board_id ? boardNames[p.board_id] : undefined;
      return {
        id: p.id,
        quote,
        board,
        imageUrl,
        link: p.link || `https://www.pinterest.com/pin/${p.id}/`,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const body = entries
    .map(
      (e) =>
        `  {\n` +
        `    id: ${JSON.stringify(e.id)},\n` +
        `    quote: ${JSON.stringify(e.quote)},\n` +
        (e.board ? `    board: ${JSON.stringify(e.board)},\n` : '') +
        `    imageUrl: ${JSON.stringify(e.imageUrl)},\n` +
        `    link: ${JSON.stringify(e.link)},\n` +
        `  },`
    )
    .join('\n');

  return (
    `// Generated by \`npm run fetch:pinterest\` (scripts/fetch-pinterest-pins.ts).\n` +
    `// Do not hand-edit — re-run the script to refresh from your Pinterest boards.\n\n` +
    `export interface PinterestQuote {\n` +
    `  id: string;\n` +
    `  /** Quote/wisdom text shown over the image — pin title, description, or alt text. */\n` +
    `  quote: string;\n` +
    `  /** Board the pin came from, shown as a small attribution label. */\n` +
    `  board?: string;\n` +
    `  imageUrl: string;\n` +
    `  /** Link back to the original pin on Pinterest. */\n` +
    `  link?: string;\n` +
    `}\n\n` +
    `export const pinterestQuotes: PinterestQuote[] = [\n${body}\n];\n`
  );
}

async function main() {
  const accessToken = await getAccessToken();
  const [pins, boardNames] = await Promise.all([
    fetchAllPins(accessToken),
    fetchBoardNames(accessToken),
  ]);

  writeFileSync(OUTPUT_PATH, toSourceLiteral(pins, boardNames), 'utf-8');
  console.log(`\nWrote ${pins.length} pins to data/pinterest-quotes.ts`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
