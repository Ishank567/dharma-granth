import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, '..');
const DATA_PATH = join(PROJECT_ROOT, 'public', 'data', 'scriptures-full', 'katha.json');
const OUTPUT_ROOT = join(PROJECT_ROOT, 'public', 'pinterest', 'katha');
const BACKGROUND_DIR = join(OUTPUT_ROOT, 'backgrounds');
const VERSE_DIR = join(OUTPUT_ROOT, 'verses');
const RENDER_DIR = join(OUTPUT_ROOT, '.render');
const VIEWPORT = { width: 1080, height: 1620 };

const CANONICAL_VERSE_LIMITS = new Map([
  [1, 29],
  [2, 25],
  [3, 17],
  [4, 15],
  [5, 15],
  [6, 18],
]);

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

function findChrome() {
  const chrome = chromeCandidates.find((candidate) => existsSync(candidate));
  if (!chrome) {
    throw new Error('Chrome or Edge was not found. Set CHROME_PATH to a Chromium-based browser executable.');
  }
  return chrome;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function cleanText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function pickFontSizes({ sanskrit, translation }) {
  const mantraLength = [...sanskrit].length;
  const translationLength = [...translation].length;

  return {
    mantra: mantraLength > 170 ? 43 : mantraLength > 135 ? 48 : mantraLength > 100 ? 54 : 60,
    translation: translationLength > 230 ? 33 : translationLength > 180 ? 36 : translationLength > 130 ? 39 : 42,
  };
}

function verseRows(data) {
  const rows = [];

  for (const chapter of data.chapters) {
    const limit = CANONICAL_VERSE_LIMITS.get(chapter.number);
    if (!limit) continue;

    for (const verse of chapter.verses) {
      if (verse.number > limit) continue;

      rows.push({
        globalIndex: rows.length + 1,
        chapter: chapter.number,
        verse: verse.number,
        reference: `${chapter.number}.${verse.number}`,
        title: data.title,
        titleSanskrit: data.titleSanskrit,
        sanskrit: cleanText(verse.sanskrit),
        transliteration: cleanText(verse.transliteration),
        translation: cleanText(verse.translation),
        hindi: cleanText(verse.hindi),
        background: `backgrounds/valli-${String(chapter.number).padStart(2, '0')}.png`,
      });
    }
  }

  return rows;
}

function posterHtml(row) {
  const sizes = pickFontSizes(row);
  const background = `../${row.background.replaceAll('\\', '/')}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=${VIEWPORT.width}, initial-scale=1">
  <title>${escapeHtml(row.title)} ${escapeHtml(row.reference)}</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      width: ${VIEWPORT.width}px;
      height: ${VIEWPORT.height}px;
      margin: 0;
      overflow: hidden;
      background: #090807;
    }
    body {
      font-family: Georgia, "Times New Roman", serif;
      color: #fff9ee;
      letter-spacing: 0;
    }
    .poster {
      position: relative;
      width: ${VIEWPORT.width}px;
      height: ${VIEWPORT.height}px;
      overflow: hidden;
      background-image: url("${background}");
      background-size: cover;
      background-position: center;
      isolation: isolate;
    }
    .poster::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
      background:
        radial-gradient(circle at 50% 28%, rgba(5, 7, 10, 0.18), rgba(5, 7, 10, 0.72) 66%, rgba(4, 4, 5, 0.86) 100%),
        linear-gradient(180deg, rgba(4, 5, 8, 0.36), rgba(4, 5, 8, 0.2) 42%, rgba(4, 5, 8, 0.76));
    }
    .content {
      position: absolute;
      inset: 82px 76px 72px;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: stretch;
      text-align: center;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 28px;
      color: rgba(255, 249, 238, 0.92);
      text-shadow: 0 2px 18px rgba(0, 0, 0, 0.72);
    }
    .book {
      font-family: "Nirmala UI", Mangal, Kokila, Georgia, serif;
      font-size: 40px;
      line-height: 1.12;
      font-weight: 650;
      text-align: left;
    }
    .chapter {
      font-family: Calibri, Arial, sans-serif;
      font-size: 27px;
      line-height: 1.18;
      text-transform: uppercase;
      text-align: right;
      color: rgba(255, 248, 232, 0.82);
    }
    .middle {
      max-height: 1120px;
      margin: 54px 0 42px;
      padding: 74px 70px 68px;
      border: 1px solid rgba(255, 241, 205, 0.22);
      border-radius: 30px;
      background:
        linear-gradient(180deg, rgba(10, 12, 16, 0.64), rgba(10, 12, 16, 0.49)),
        radial-gradient(circle at 50% 0%, rgba(255, 220, 160, 0.16), rgba(255, 220, 160, 0) 52%);
      box-shadow:
        0 28px 90px rgba(0, 0, 0, 0.48),
        inset 0 1px 0 rgba(255, 255, 255, 0.13);
      text-shadow: 0 2px 16px rgba(0, 0, 0, 0.74);
    }
    .mantra {
      font-family: "Nirmala UI", Mangal, Kokila, "Arial Unicode MS", serif;
      font-size: ${sizes.mantra}px;
      line-height: 1.44;
      font-weight: 650;
      overflow-wrap: break-word;
    }
    .divider {
      width: 170px;
      height: 1px;
      margin: 46px auto 42px;
      background: linear-gradient(90deg, transparent, rgba(255, 230, 174, 0.92), transparent);
    }
    .translation {
      font-size: ${sizes.translation}px;
      line-height: 1.38;
      color: rgba(255, 247, 230, 0.92);
      overflow-wrap: break-word;
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 28px;
      font-family: Calibri, Arial, sans-serif;
      color: rgba(255, 249, 238, 0.9);
      text-shadow: 0 2px 16px rgba(0, 0, 0, 0.76);
    }
    .label {
      font-size: 31px;
      line-height: 1.1;
      text-align: left;
    }
    .ref {
      font-size: 58px;
      line-height: 0.96;
      font-weight: 700;
      text-align: right;
    }
  </style>
</head>
<body>
  <article class="poster">
    <div class="content">
      <header class="top">
        <div class="book">${escapeHtml(row.titleSanskrit)}</div>
        <div class="chapter">Valli ${row.chapter}<br>Verse ${row.verse}</div>
      </header>
      <main class="middle" id="middle">
        <div class="mantra" id="mantra">${escapeHtml(row.sanskrit)}</div>
        <div class="divider"></div>
        <div class="translation" id="translation">${escapeHtml(row.translation)}</div>
      </main>
      <footer class="bottom">
        <div class="label">${escapeHtml(row.title)}</div>
        <div class="ref">${escapeHtml(row.reference)}</div>
      </footer>
    </div>
  </article>
  <script>
    async function fitText() {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const middle = document.getElementById('middle');
      const mantra = document.getElementById('mantra');
      const translation = document.getElementById('translation');
      let mantraSize = parseFloat(getComputedStyle(mantra).fontSize);
      let translationSize = parseFloat(getComputedStyle(translation).fontSize);
      let attempts = 0;
      while (middle.scrollHeight > middle.clientHeight && attempts < 34) {
        mantraSize *= 0.966;
        translationSize *= 0.966;
        mantra.style.fontSize = mantraSize + 'px';
        translation.style.fontSize = translationSize + 'px';
        attempts += 1;
      }
      document.body.dataset.ready = 'true';
    }
    window.addEventListener('load', () => {
      fitText();
      setTimeout(fitText, 120);
    });
  </script>
</body>
</html>`;
}

function galleryHtml(rows) {
  const items = rows
    .map(
      (row) => `<a class="item" href="verses/${row.filename}"><img src="verses/${row.filename}" alt="${escapeHtml(row.title)} ${escapeHtml(row.reference)}"><span>${escapeHtml(row.reference)}</span></a>`,
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Katha Upanishad Pinterest Images</title>
  <style>
    body { margin: 0; background: #111; color: #f8efe0; font-family: Calibri, Arial, sans-serif; letter-spacing: 0; }
    header { padding: 28px 32px 12px; }
    h1 { margin: 0 0 6px; font-size: 32px; font-weight: 700; }
    p { margin: 0; color: #cfc4b0; font-size: 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 18px; padding: 24px 32px 40px; }
    .item { color: inherit; text-decoration: none; display: grid; gap: 8px; }
    img { width: 100%; border-radius: 8px; display: block; box-shadow: 0 14px 42px rgba(0, 0, 0, 0.42); }
    span { font-size: 14px; color: #d8ccb7; }
  </style>
</head>
<body>
  <header>
    <h1>Katha Upanishad Pinterest Images</h1>
    <p>119 canonical verse posters generated from the local Katha Upanishad data.</p>
  </header>
  <main class="grid">
${items}
  </main>
</body>
</html>`;
}

function ensureBackgrounds() {
  for (let chapter = 1; chapter <= 6; chapter += 1) {
    const background = join(BACKGROUND_DIR, `valli-${String(chapter).padStart(2, '0')}.png`);
    if (!existsSync(background)) {
      throw new Error(`Missing background image: ${background}`);
    }
  }
}

function renderPoster({ chromePath, htmlPath, outputPath }) {
  const userDataDir = join(RENDER_DIR, 'chrome-profile');
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${userDataDir}`,
    '--force-device-scale-factor=1',
    `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
    '--virtual-time-budget=2500',
    `--screenshot=${outputPath}`,
    pathToFileURL(htmlPath).href,
  ];

  execFileSync(chromePath, args, { stdio: 'ignore' });
}

function main() {
  const chromePath = findChrome();
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  const rows = verseRows(data);

  if (rows.length !== 119) {
    throw new Error(`Expected 119 canonical verses, found ${rows.length}.`);
  }

  ensureBackgrounds();
  mkdirSync(VERSE_DIR, { recursive: true });
  mkdirSync(RENDER_DIR, { recursive: true });

  for (const row of rows) {
    const padded = String(row.globalIndex).padStart(3, '0');
    row.filename = `katha-${padded}-c${String(row.chapter).padStart(2, '0')}v${String(row.verse).padStart(2, '0')}.png`;
    const htmlPath = join(RENDER_DIR, `${row.filename}.html`);
    const outputPath = join(VERSE_DIR, row.filename);
    writeFileSync(htmlPath, posterHtml(row), 'utf8');
    renderPoster({ chromePath, htmlPath, outputPath });
    process.stdout.write(`Rendered ${row.filename}\n`);
  }

  const manifest = rows.map((row) => ({
    index: row.globalIndex,
    chapter: row.chapter,
    verse: row.verse,
    reference: row.reference,
    file: `verses/${row.filename}`,
    background: row.background,
    sanskrit: row.sanskrit,
    transliteration: row.transliteration,
    translation: row.translation,
    hindi: row.hindi,
  }));

  writeFileSync(join(OUTPUT_ROOT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  writeFileSync(join(OUTPUT_ROOT, 'index.html'), galleryHtml(rows), 'utf8');
  rmSync(RENDER_DIR, { recursive: true, force: true });

  console.log(`Done: ${rows.length} posters saved to ${VERSE_DIR}`);
}

main();
