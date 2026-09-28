// Smoke test for the static export in dist/, run after `next build`
// (npm run check:export; wired as postbuild). Guards regressions that were
// each found by hand:
//   • pages server-rendered at opacity:0 (framer `initial`), invisible until
//     hydration — the h1 of every key page must not sit inside such a block;
//   • chapter shards drifting from their source (a stale Gita chapter showed
//     65 of 72 verses) — every shard must match its scriptures-full chapter;
//   • chapters without an exported page (deep links would 404);
//   • course content rendered client-only (the pathways page shipped a spinner);
//   • the splash screen leaking onto deep-link landing pages.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, 'dist');
const SOURCE = join(ROOT, 'public/data/scriptures-full');

const errors = [];
const fail = (scope, msg) => errors.push(`[${scope}] ${msg}`);

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// ── 1. Key pages: exported, have an h1, and it is not server-rendered hidden ──
const KEY_PAGES = [
  '/',
  '/scriptures/',
  '/scripture/bhagavadgita/',
  '/scripture/bhagavadgita/chapter/2/',
  '/learn/',
  '/learn/pathways/',
  '/practice/',
  '/concepts/',
  '/dictionary/',
  '/topics/',
  '/characters/',
  '/festivals/',
  '/rituals/',
  '/locations/',
  '/timelines/',
  // Personal pages: data is client-side, but the header must still export.
  '/dashboard/',
  '/collections/',
  '/bookmarks/',
];
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['script', 'style']);
const HIDDEN_STYLE = /opacity:\s*0(?![.\d])/;

/** Returns the reason the first <h1> is hidden, '' if visible, or null if there is no h1. */
function firstH1Visibility(html) {
  const stack = [];
  const tag = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = tag.exec(html))) {
    const [, closing, rawName, attrs, selfClosing] = m;
    const name = rawName.toLowerCase();
    if (closing) {
      const i = stack.map((e) => e.name).lastIndexOf(name);
      if (i !== -1) stack.length = i;
      continue;
    }
    if (name === 'h1') {
      const hidden = stack.find((e) => e.hidden);
      return hidden ? `inside <${hidden.name} style="${hidden.style}">` : '';
    }
    if (RAW_TEXT.has(name)) {
      const end = html.indexOf(`</${name}`, tag.lastIndex);
      tag.lastIndex = end === -1 ? html.length : end;
      continue;
    }
    if (VOID.has(name) || selfClosing) continue;
    const style = /\bstyle="([^"]*)"/.exec(attrs)?.[1] ?? '';
    stack.push({ name, style, hidden: HIDDEN_STYLE.test(style) });
  }
  return null;
}

const pageHtml = (route) => {
  const file = join(DIST, route, 'index.html');
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
};

for (const route of KEY_PAGES) {
  const html = pageHtml(route);
  if (html === null) {
    fail(route, 'page was not exported');
    continue;
  }
  const visibility = firstH1Visibility(html);
  if (visibility === null) fail(route, 'no <h1> in the exported HTML (content rendered client-only?)');
  else if (visibility) fail(route, `<h1> is server-rendered hidden, ${visibility}`);
}

// ── Splash screen is home-only (readers arriving from search go straight in) ──
for (const route of KEY_PAGES) {
  const hasSplash = /class="splash"/.test(pageHtml(route) ?? '');
  if (route === '/' && !hasSplash) fail(route, 'home page is missing the splash screen');
  if (route !== '/' && hasSplash) fail(route, 'splash screen should only be on the home page');
}

// ── 4. Pathways ship their course content, not just a shell ──
{
  const html = pageHtml('/learn/pathways/') ?? '';
  const steps = (html.match(/id="pathway-steps-/g) ?? []).length;
  const stepTitles = (html.match(/<h4\b/g) ?? []).length;
  if (steps === 0 || stepTitles === 0) {
    fail('/learn/pathways/', `pathway steps missing from the exported HTML (${steps} panels, ${stepTitles} step titles)`);
  }
}

// ── 2 & 3. Every source chapter has a matching shard and an exported page ──
let chaptersChecked = 0;
for (const file of readdirSync(SOURCE).filter((f) => f.endsWith('.json'))) {
  const id = file.replace(/\.json$/, '');
  let source;
  try {
    source = JSON.parse(readFileSync(join(SOURCE, file), 'utf8'));
  } catch (err) {
    fail(id, `source JSON unreadable: ${err.message}`);
    continue;
  }
  for (const chapter of source.chapters ?? []) {
    chaptersChecked++;
    const ref = `${id} ch${chapter.number}`;
    const shardPath = join(DIST, 'data/scriptures-full', id, `ch-${chapter.number}.json`);
    if (!existsSync(shardPath)) {
      fail(ref, 'chapter shard missing from dist (run npm run shard:scriptures before building)');
    } else {
      const shard = JSON.parse(readFileSync(shardPath, 'utf8'));
      const want = chapter.verses?.length ?? 0;
      const got = shard.chapter?.verses?.length ?? 0;
      if (got !== want) fail(ref, `shard has ${got} verses, source has ${want} (stale shard?)`);
    }
    if (!existsSync(join(DIST, 'scripture', id, 'chapter', String(chapter.number), 'index.html'))) {
      fail(ref, 'chapter page was not exported');
    }
  }
}

if (errors.length > 0) {
  console.error(`✗ Export check failed (${errors.length}):`);
  for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
  if (errors.length > 40) console.error(`  … and ${errors.length - 40} more`);
  process.exit(1);
}
console.log(`✓ Export check passed: ${KEY_PAGES.length} key pages visible, ${chaptersChecked} chapters match their shards and pages.`);
