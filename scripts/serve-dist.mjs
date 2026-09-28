// Serve the static export in dist/ like a static host would (directory
// index.html, trailing slashes, 404.html), for testing production builds:
//   npm run build && node scripts/serve-dist.mjs   → http://localhost:4173
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'dist');
const PORT = Number(process.env.PORT) || 4173;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.mp3': 'audio/mpeg',
};

function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const file = join(ROOT, clean);
  if (!file.startsWith(ROOT)) return null;
  if (existsSync(file) && statSync(file).isFile()) return file;
  const index = join(file, 'index.html');
  if (existsSync(index)) return index;
  if (existsSync(`${file}.html`)) return `${file}.html`;
  return null;
}

createServer((req, res) => {
  const url = req.url ?? '/';
  // Directory URLs without a slash redirect, as GitHub Pages does.
  const pathOnly = url.split('?')[0];
  if (!pathOnly.endsWith('/') && !extname(pathOnly) && existsSync(join(ROOT, pathOnly, 'index.html'))) {
    res.writeHead(301, { Location: `${pathOnly}/` });
    res.end();
    return;
  }
  const file = resolveFile(url);
  const status = file ? 200 : 404;
  const target = file ?? join(ROOT, '404.html');
  res.writeHead(status, {
    'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  createReadStream(target).pipe(res);
}).listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
