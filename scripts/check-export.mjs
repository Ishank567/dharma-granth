// Smoke test for the static export in dist/, run after `next build`
// (npm run check:export; wired as postbuild). Guards regressions that were
// each found by hand:
//   • pages server-rendered at opacity:0 (framer `initial`), invisible until
//     hydration — the h1 of every key page must not sit inside such a block;
//   • chapters missing verses (a stale Gita chapter showed 65 of 72) or
//     shipping none in the HTML — every chapter page must carry as many
//     verse cards as its scriptures-full source;
//   • chapters without an exported page (deep links would 404);
//   • course content rendered client-only (the pathways page shipped a spinner);
//   • the splash screen leaking onto deep-link landing pages.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, 'dist');
const SOURCE = join(ROOT, 'public/data/scriptures-full');

const errors = [];
let verseScripts = '';
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
  '/scripture/bhagavadgita/chapter/2/verse/47/',
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

// ── Canary: the most-searched verse's text is in its chapter page's HTML ──
if (!(pageHtml('/scripture/bhagavadgita/chapter/2/') ?? '').includes('कर्मण्येवाधिकारस्ते')) {
  fail('/scripture/bhagavadgita/chapter/2/', 'verse 2.47 (कर्मण्येवाधिकारस्ते) is not in the exported HTML');
}

// ── Verse pages: one per verse of each scripture in VERSE_PAGE_SCRIPTURE_IDS
// (lib/verse-paths.ts), each with its text and structured data ──
{
  const idsSrc = readFileSync(join(ROOT, 'lib/verse-paths.ts'), 'utf8');
  const listSrc = /VERSE_PAGE_SCRIPTURE_IDS\s*=\s*\[([^\]]*)\]/.exec(idsSrc)?.[1] ?? '';
  const ids = [...listSrc.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (ids.length === 0) fail('verse pages', 'could not read VERSE_PAGE_SCRIPTURE_IDS from lib/verse-paths.ts');
  let expected = 0;
  let missing = 0;
  let sample = '';
  for (const id of ids) {
    const path = join(SOURCE, `${id}.json`);
    if (!existsSync(path)) continue;
    const book = JSON.parse(readFileSync(path, 'utf8'));
    for (const chapter of book.chapters ?? []) {
      for (const verse of chapter.verses ?? []) {
        if (!/^[0-9A-Za-z]+(?:[.\-][0-9A-Za-z]+)*$/.test(String(verse.number))) continue;
        expected++;
        const html = pageHtml(`/scripture/${id}/chapter/${chapter.number}/verse/${verse.number}/`);
        if (!html || !html.includes(`id="verse-${verse.number}"`) || !html.includes('"FAQPage"')) {
          missing++;
          sample ||= `${id} ${chapter.number}.${verse.number}`;
        }
      }
    }
  }
  if (missing > 0) fail('verse pages', `${missing}/${expected} verse pages missing or incomplete (first: ${sample})`);
  else verseScripts = `${expected} verse pages across ${ids.length} scriptures`;
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

// ── 2 & 3. Every source chapter has an exported page carrying all its verses ──
// (Chapter pages render their verses at build time, so crawlers see the text;
// a stale or missing verse would show up as a count mismatch here.)
let chaptersChecked = 0;
let inlined = 0;
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
    const pagePath = join(DIST, 'scripture', id, 'chapter', String(chapter.number), 'index.html');
    if (!existsSync(pagePath)) {
      fail(ref, 'chapter page was not exported');
      continue;
    }
    const want = chapter.verses?.length ?? 0;
    const html = readFileSync(pagePath, 'utf8');
    const got = new Set(html.match(/<article[^>]*\bid="verse-[^"]+"/g) ?? []).size;
    if (want > 0 && got === want) {
      inlined++;
    } else if (want > 0 && got > 0) {
      fail(ref, `page HTML has ${got} verse cards, source has ${want}`);
    } else if (want > 0) {
      // A few parvas are too large for one HTML file; they still load a shard.
      const shardPath = join(DIST, 'data/scriptures-full', id, `ch-${chapter.number}.json`);
      if (!existsSync(shardPath)) {
        fail(ref, 'no verses in the page HTML and no shard to load them from');
      } else {
        const shardVerses = JSON.parse(readFileSync(shardPath, 'utf8')).chapter?.verses?.length ?? 0;
        if (shardVerses !== want) fail(ref, `shard has ${shardVerses} verses, source has ${want} (stale shard?)`);
      }
    }
  }
}

{
  const gita2 = pageHtml('/scripture/bhagavadgita/chapter/2/') ?? '';
  const mentions = gita2.split('कर्मण्येवाधिकारस्ते').length - 1;
  if (mentions < 1) {
    fail('/scripture/bhagavadgita/chapter/2/', 'Sanskrit of 2.47 is missing from the server HTML');
  }
}

if (errors.length > 0) {
  console.error(`✗ Export check failed (${errors.length}):`);
  for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
  if (errors.length > 40) console.error(`  … and ${errors.length - 40} more`);
  process.exit(1);
}
console.log(
  `✓ Export check passed: ${KEY_PAGES.length} key pages visible; ${inlined}/${chaptersChecked} chapter pages ` +
    `carry all their verses in HTML, the rest load a matching shard; ${verseScripts}.`,
);
