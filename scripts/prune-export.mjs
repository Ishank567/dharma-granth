// Remove files from the static export that no deployed page needs, keeping
// the site under GitHub Pages' 1 GB limit. Run after `next build` (postbuild),
// after check-export.
//
// dist/data/scriptures-full/ (~400 MB) holds the full-book JSONs and the
// per-chapter shards. Chapter pages carry their verses in the HTML (read at
// build time from public/data/scriptures-full), so:
//   • full-book JSONs are never fetched by the browser → removed;
//   • a chapter's shard is removed when its page already carries its verses,
//     and kept for the few giant chapters that still load client-side.
// The copies in public/ stay: the build and the data scripts read them.
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');
const DATA = join(DIST, 'data/scriptures-full');

function sizeOf(path) {
  const st = statSync(path);
  if (!st.isDirectory()) return st.size;
  return readdirSync(path).reduce((sum, name) => sum + sizeOf(join(path, name)), 0);
}

function remove(path) {
  const bytes = sizeOf(path);
  rmSync(path, { recursive: true, force: true });
  return bytes;
}

let freed = 0;
let kept = 0;
if (existsSync(DATA)) {
  for (const name of readdirSync(DATA)) {
    const path = join(DATA, name);
    if (!statSync(path).isDirectory()) {
      freed += remove(path); // full-book JSON
      continue;
    }
    for (const file of readdirSync(path)) {
      const match = /^ch-(\d+)\.json$/.exec(file);
      if (!match) {
        freed += remove(join(path, file)); // manifest.json etc.
        continue;
      }
      const page = join(DIST, 'scripture', name, 'chapter', match[1], 'index.html');
      const inlined = existsSync(page) && readFileSync(page, 'utf8').includes('id="verse-');
      if (inlined) freed += remove(join(path, file));
      else kept++;
    }
    if (readdirSync(path).length === 0) rmSync(path, { recursive: true, force: true });
  }
}

const total = sizeOf(DIST);
console.log(
  `✓ Export pruned: freed ${(freed / 1024 / 1024).toFixed(0)} MB, kept ${kept} shard(s) for client-loaded chapters; ` +
    `dist is ${(total / 1024 / 1024).toFixed(0)} MB.`,
);
// GitHub Pages rejects sites over 1 GB; fail the build before deploy does.
if (total > 1000 * 1024 * 1024) {
  console.error('✗ dist exceeds 1000 MB — GitHub Pages would reject the deploy.');
  process.exit(1);
}
