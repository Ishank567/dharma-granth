/**
 * Pre-generate per-scripture OG share images as static PNGs.
 *
 * Why this exists: Next 14.2 has a bug with `app/.../opengraph-image.tsx`
 * under `output: 'export'` — the build worker returns empty prerenderRoutes
 * regardless of what generateStaticParams returns. So we sidestep the
 * metadata-route machinery and pre-bake PNGs at build time using the same
 * underlying engine (satori) that @vercel/og uses.
 *
 * Output:
 *   public/og/<scriptureId>.png        1200 x 630 share image
 *   public/og/thumb/<scriptureId>.webp 720px card thumbnail (~15 KB vs ~220 KB)
 *   public/og-default.png              site-wide share image / JSON-LD logo
 *   public/icons/*, public/favicon.svg app icons for tabs, home screens, manifest
 *
 * Run: npm run og:build
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
// @ts-expect-error — wawoff2 ships no types
import wawoff2 from "wawoff2";
import { scriptureCatalog } from "../data/scripture-meta";
import type { ScriptureMeta } from "../data/types";

const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/og");
const THUMB_DIR = resolve(OUT_DIR, "thumb");
const ICON_DIR = resolve(ROOT, "public/icons");
const FONT_CACHE = resolve(ROOT, "scripts/.fonts");

// Library cards are at most ~360 CSS px wide; 720 covers 2x screens.
const THUMB_WIDTH = 720;

const WIDTH = 1200;
const HEIGHT = 630;

// SIL Open Font License — permissive, fine to embed in distributed images.
// Satori needs static TTF instances. @fontsource ships .woff2 only, so we
// decode each one to TTF at script time and cache the result on disk.
const FONTS = [
  {
    cacheName: "NotoSans-Regular.ttf",
    woff2: "node_modules/@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff2",
    family: "Noto Sans",
    weight: 400 as const,
  },
  {
    cacheName: "NotoSans-Bold.ttf",
    woff2: "node_modules/@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff2",
    family: "Noto Sans",
    weight: 700 as const,
  },
  {
    cacheName: "NotoSansDevanagari-Bold.ttf",
    woff2: "node_modules/@fontsource/noto-sans-devanagari/files/noto-sans-devanagari-devanagari-700-normal.woff2",
    family: "Noto Sans Devanagari",
    weight: 700 as const,
  },
];

interface SatoriFont {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal";
}

async function woff2ToTtf(woff2Buffer: Buffer): Promise<Buffer> {
  const ttfUint8 = (await wawoff2.decompress(woff2Buffer)) as Uint8Array;
  return Buffer.from(ttfUint8);
}

async function loadFont(spec: (typeof FONTS)[number]): Promise<Buffer> {
  const cachePath = resolve(FONT_CACHE, spec.cacheName);
  if (existsSync(cachePath)) return readFileSync(cachePath);

  const woff2Path = resolve(ROOT, spec.woff2);
  if (!existsSync(woff2Path)) {
    throw new Error(`Missing source woff2 at ${woff2Path}. Did npm install run?`);
  }
  mkdirSync(FONT_CACHE, { recursive: true });
  const ttf = await woff2ToTtf(readFileSync(woff2Path));
  writeFileSync(cachePath, ttf);
  return ttf;
}

async function loadFonts(): Promise<SatoriFont[]> {
  const out: SatoriFont[] = [];
  for (const f of FONTS) {
    const data = await loadFont(f);
    out.push({ name: f.family, data, weight: f.weight, style: "normal" });
  }
  return out;
}

function categoryAccent(category: ScriptureMeta["category"]): { from: string; to: string; label: string } {
  switch (category) {
    case "veda":
      return { from: "#7c2d12", to: "#ea580c", label: "Veda" };
    case "upanishad":
      return { from: "#1e3a8a", to: "#3b82f6", label: "Upanishad" };
    case "itihasa":
      return { from: "#9a3412", to: "#f59e0b", label: "Itihasa" };
    case "purana":
      return { from: "#7e22ce", to: "#c084fc", label: "Purana" };
    case "smriti":
      return { from: "#374151", to: "#9ca3af", label: "Smriti" };
    case "tantra":
      return { from: "#831843", to: "#ec4899", label: "Tantra" };
    case "stotra":
      return { from: "#92400e", to: "#fbbf24", label: "Stotra" };
    default:
      return { from: "#1f2937", to: "#6b7280", label: "Scripture" };
  }
}

function shortDescription(s: string, maxLen = 180): string {
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

function ogTemplate(meta: ScriptureMeta) {
  const accent = categoryAccent(meta.category);
  const titleFontSize = meta.titleSanskrit.length > 18 ? 56 : 72;

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 22,
                    opacity: 0.85,
                    letterSpacing: 8,
                    textTransform: "uppercase",
                    marginBottom: 28,
                  },
                  children: `Dharma Granth · ${accent.label}`,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: titleFontSize,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    maxWidth: 1040,
                  },
                  children: meta.title,
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 44,
                    marginTop: 24,
                    opacity: 0.92,
                    fontFamily: "Noto Sans Devanagari",
                  },
                  children: meta.titleSanskrit,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 24,
                    opacity: 0.88,
                    lineHeight: 1.4,
                    maxWidth: 1040,
                    marginBottom: 24,
                  },
                  children: shortDescription(meta.description),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 22,
                    opacity: 0.75,
                    letterSpacing: 2,
                  },
                  children: "Verse by verse · Sanskrit · Hindi · English",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderOne(meta: ScriptureMeta, fonts: SatoriFont[]): Promise<void> {
  const svg = await satori(ogTemplate(meta) as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
  writeFileSync(resolve(OUT_DIR, `${meta.id}.png`), png);
  await sharp(png)
    .resize({ width: THUMB_WIDTH })
    .webp({ quality: 75, effort: 6 })
    .toFile(resolve(THUMB_DIR, `${meta.id}.webp`));
}

/* ── Site-wide brand assets ─────────────────────────────────────────── */

const BRAND_FROM = "#c2410c";
const BRAND_TO = "#f59e0b";

function defaultOgTemplate() {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "64px 88px",
        background: `linear-gradient(135deg, #7c2d12 0%, ${BRAND_FROM} 45%, ${BRAND_TO} 100%)`,
        color: "white",
        fontFamily: "Noto Sans",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              fontFamily: "Noto Sans Devanagari",
              fontSize: 260,
              fontWeight: 700,
              lineHeight: 1,
              opacity: 0.95,
              marginRight: 72,
            },
            children: "ॐ",
          },
        },
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              // No Devanagari title line: satori doesn't shape conjuncts
              // (र्म, ग्र render with a visible halant), so ॐ carries it.
              { type: "div", props: { style: { fontSize: 84, fontWeight: 700, lineHeight: 1.05 }, children: "Dharma Granth" } },
              {
                type: "div",
                props: {
                  style: { fontSize: 28, marginTop: 36, opacity: 0.9, lineHeight: 1.4, maxWidth: 640 },
                  children: "Hindu scriptures, verse by verse — Sanskrit, Hindi and English. Free and ad-free.",
                },
              },
            ],
          },
        },
      ],
    },
  };
}

/**
 * ॐ on a saffron tile. `padding` is the inset as a fraction of the size;
 * maskable icons need the glyph inside the central 80% safe zone.
 */
function iconTemplate(size: number, { rounded, padding }: { rounded: boolean; padding: number }) {
  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${BRAND_FROM} 0%, ${BRAND_TO} 100%)`,
        borderRadius: rounded ? size * 0.22 : 0,
        color: "white",
        fontFamily: "Noto Sans Devanagari",
        fontWeight: 700,
        // Devanagari ॐ sits high in its em box (visual centre ~36% down);
        // top padding shifts the centred content down to the optical middle.
        fontSize: size * (1 - padding * 2) * 0.9,
        lineHeight: 1,
        paddingTop: size * 0.28 * (1 - padding * 2),
      },
      children: "ॐ",
    },
  };
}

async function renderSvg(tree: unknown, width: number, height: number, fonts: SatoriFont[]): Promise<string> {
  return satori(tree as Parameters<typeof satori>[0], { width, height, fonts });
}

function svgToPng(svg: string, width: number): Buffer {
  return new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
}

async function renderBrandAssets(fonts: SatoriFont[]): Promise<void> {
  mkdirSync(ICON_DIR, { recursive: true });

  const ogSvg = await renderSvg(defaultOgTemplate(), WIDTH, HEIGHT, fonts);
  writeFileSync(resolve(ROOT, "public/og-default.png"), svgToPng(ogSvg, WIDTH));
  console.log("  ✓ og-default.png");

  // Satori emits glyphs as paths, so the SVG favicon needs no font at runtime.
  const faviconSvg = await renderSvg(iconTemplate(64, { rounded: true, padding: 0.1 }), 64, 64, fonts);
  writeFileSync(resolve(ROOT, "public/favicon.svg"), faviconSvg);
  console.log("  ✓ favicon.svg");

  const pngIcons: Array<{ file: string; size: number; rounded: boolean; padding: number }> = [
    { file: "icon-32.png", size: 32, rounded: true, padding: 0.08 },
    { file: "icon-192.png", size: 192, rounded: true, padding: 0.1 },
    { file: "icon-512.png", size: 512, rounded: true, padding: 0.1 },
    // Full-bleed: iOS and Android mask these themselves.
    { file: "apple-touch-icon.png", size: 180, rounded: false, padding: 0.14 },
    { file: "icon-maskable-512.png", size: 512, rounded: false, padding: 0.2 },
  ];
  for (const icon of pngIcons) {
    const svg = await renderSvg(iconTemplate(icon.size, icon), icon.size, icon.size, fonts);
    writeFileSync(resolve(ICON_DIR, icon.file), svgToPng(svg, icon.size));
    console.log(`  ✓ icons/${icon.file}`);
  }
}

async function main(): Promise<void> {
  mkdirSync(THUMB_DIR, { recursive: true });
  console.log(`[og] loading fonts...`);
  const fonts = await loadFonts();
  console.log(`[og] rendering ${scriptureCatalog.length} OG images + thumbnails to ${OUT_DIR}`);
  for (const meta of scriptureCatalog) {
    await renderOne(meta, fonts);
    process.stdout.write(`  ✓ ${meta.id}\n`);
  }
  console.log(`[og] rendering brand assets`);
  await renderBrandAssets(fonts);
  console.log(`[og] done.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
