// Builds the site logo assets from the master artwork (assets/logo-source.webp):
//   public/logo.png           full logo (emblem + wordmark), 512×512, for Schema.org
//   public/logo-mark.webp     emblem only (sage, book, halo), for the site header
//   public/logo-splash.webp   the same emblem at 320px, for the splash screen
//   assets/logo-emblem.png    the emblem at full resolution, for app icons and
//                             the share image (npm run og:build -- --brand-only)
// Run: node scripts/build-logo.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(ROOT, 'assets/logo-source.webp');

// The emblem sits above the wordmark; everything below this line is text.
const EMBLEM_BOTTOM = 0.66;

const src = sharp(SOURCE);
const { width, height } = await src.metadata();

// Trim the cream margin around the emblem to find its bounding box.
const emblemRegion = await sharp(SOURCE)
  .extract({ left: 0, top: 0, width, height: Math.round(height * EMBLEM_BOTTOM) })
  .toBuffer();
const { info } = await sharp(emblemRegion).trim({ threshold: 30 }).toBuffer({ resolveWithObject: true });
const box = {
  left: -(info.trimOffsetLeft ?? 0),
  top: -(info.trimOffsetTop ?? 0),
  width: info.width,
  height: info.height,
};

// Square crop centred on the emblem, with a little breathing room.
const side = Math.round(Math.max(box.width, box.height) * 1.08);
const cx = box.left + box.width / 2;
const cy = box.top + box.height / 2;
const crop = {
  left: Math.max(0, Math.round(cx - side / 2)),
  top: Math.max(0, Math.round(cy - side / 2)),
  width: Math.min(side, width),
  height: Math.min(side, height),
};

mkdirSync(resolve(ROOT, 'public'), { recursive: true });

await sharp(SOURCE)
  .extract(crop)
  .resize(160, 160)
  .webp({ quality: 90 })
  .toFile(resolve(ROOT, 'public/logo-mark.webp'));

// Full-resolution emblem as PNG (satori can't read WebP): the source for the
// home-screen icons and share image in scripts/generate-og-images.ts.
await sharp(SOURCE)
  .extract(crop)
  .png({ compressionLevel: 9 })
  .toFile(resolve(ROOT, 'assets/logo-emblem.png'));

// Larger emblem for the splash screen (shown at ~160px, so 2× density).
await sharp(SOURCE)
  .extract(crop)
  .resize(320, 320)
  .webp({ quality: 88 })
  .toFile(resolve(ROOT, 'public/logo-splash.webp'));

await sharp(SOURCE).resize(512, 512).png({ compressionLevel: 9 }).toFile(resolve(ROOT, 'public/logo.png'));

console.log('emblem box', box, 'crop', crop);
console.log('✓ public/logo-mark.webp  ✓ public/logo-splash.webp  ✓ public/logo.png  ✓ assets/logo-emblem.png');
