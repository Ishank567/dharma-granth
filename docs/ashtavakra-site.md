# Ashtavakra Gita website: design system and architecture

Status as of this commit: first slice built and running at `/ashtavakra/`. This document says what exists, what is only specified, and why.

## 1. What is built now

| Area | State |
|---|---|
| Design tokens, light and dark (contemplation) themes | Built (`app/ashtavakra/ashtavakra.css`) |
| Three visual modes, three motion levels, saved on the device | Built (`AshShell.tsx`) |
| Homepage in the specified section order | Built, except audio and concept map (see section 7) |
| 20-chapter "Path of Awareness" explorer | Built; vertical journey, two-column curve on desktop |
| Chapter pages (chapters 1 and 2) | Built |
| Verse pages in the specified 24-part order (chapters 1 to 8: 82 verses) | Built |
| Chapter 1 environment ("mirror from mist") | Built as SVG with a static final state |
| Other chapters | Quiet generic environment; real artwork not yet made |
| Visual explanation cards (sakshi, ocean, ahankara, vairagya, karta) | Built, each with caption and text description |
| Read markers, daily verse, continue reading | Built, local only |
| Skip animation control | Built |

Not built yet (specified below so it can be done in order): word explorer, Sakshi and Contemplation modes, interactive analogies, search, concept map, journal, timeline, audio. Chapters 9 to 20 are not published.

## 2. Source and editorial honesty (comes before any visual work)

- The book names chapters only "पहला प्रकरण", "दूसरा प्रकरण", and so on. The titles, essences, symbols and palettes in `data/ashtavakra/chapters-meta.ts` are **editorial** and are always shown as such.
- Verse counts appear only where a chapter was counted from the pages (1: 20, 2: 25, 3: 14, 4: 6, 5: 4, 6: 4, 7: 5, 8: 4). Others show "श्लोक-संख्या अभी सत्यापित नहीं".
- Every verse carries `verificationStatus`. Where the book's own printing disagrees with itself (1.9, 1.11, 1.20, 2.3, 2.4, 2.11, 2.19) the printed text is kept, flagged "समीक्षा आवश्यक", and the difference is written in the editorial note. Nothing was replaced from outside sources.
- Badges use an icon and words ("✓ सत्यापित", "⚠ समीक्षा आवश्यक"), never colour alone.
- "पुस्तकानुसार हिन्दी भावार्थ" is an original restatement, not a copy, and no Sanskrit scholar has reviewed it. The source-edition section says so, along with the unresolved publication year and rights status.

## 3. "4D-style experiential depth"

A design idea, not a claim about physical space. Depth is layers (atmosphere, symbolic middle, content, sparse foreground). The fourth dimension is **change over time**: a thought line fades, water settles, parted layers reveal a clear mirror.

Layers in code: `.ash-layer-bg` and `.ash-layer-grain` (atmosphere), the chapter SVG (symbolic middle), page content, `.ash-dust` (foreground, six points, behind text).

Quietness: each chapter has `quiet` from 1 to 5. Chapters 1 and 2 may show particles; from chapter 4 the environment draws fewer lines; the last chapters are almost still. The four journey stages on the homepage get visually calmer from stage 1 to stage 4.

## 4. Visual system

- Palette: ivory `#F7F0DF`, saffron `#D7862A`, indigo `#17213F`, maroon `#6D2932`, gold `#B99045`, sandstone `#CFA878`, lotus `#B96873`, teal `#315C59`, midnight `#0D1428`.
- Reading surfaces are parchment or deep indigo, never pure black. Accent text on parchment uses a darker saffron (`#9A4E14`, about 5.3:1 on parchment) so it reaches readable contrast.
- Typography: Noto Sans Devanagari (already bundled by the site). Sanskrit is the largest element (`clamp(1.4rem, 1.05rem + 1.7vw, 2.15rem)`, line-height 2, danda kept with its word using a non-breaking space). Hindi explanation 1.1 to 1.3rem, line-height 2. English is visually secondary.
- Decorative lettering is not used for verses.
- Sacred geometry is 6 percent opacity, never behind long text at higher strength.

## 5. Motion specification

Only `transform` and `opacity` animate.

| Modes | Behaviour |
|---|---|
| Visual: पूर्ण अनुभव (immersive) | Layers, six drifting points, hero blur-to-focus, chapter 1 layers separating over 9 s, breathing current marker |
| Visual: संतुलित (balanced, default) | Static art, gentle 0.5 s rise on content |
| Visual: केवल पाठ (reading) | No environment, no decoration, no motion |
| Motion: पूर्ण / कम / सजावटी गति बंद | Full; reduced (a 0.25 s fade only, no movement or drifting points); none (no animation at all) |

- The operating system's reduced-motion setting always wins and disables animation and transitions.
- On screens 640px and narrower, particles and parallax layers are not rendered.
- Text is never hidden waiting for an animation: reveals start visible-compatible (`both` fill) and are removed entirely when motion is off.
- The final state of every drawing is its static state. Chapter 1's static image already shows the parted layers and the clear mirror.
- A visible "एनिमेशन छोड़ें" control on the hero stops all decorative motion.

Specified, not built: scroll-linked chapter transitions (800 to 1500 ms, skippable), shared-element page transitions, WebGL scenes (hero water, transitions). Rule for any WebGL: static fallback, motion-off fallback, low-power fallback, failure fallback; never on verse cards.

## 6. Accessibility

Built and checked in the browser: one `h1` per page; logical `h2` and `h3`; `lang` attributes (`sa`, `hi`, `en`, `sa-Latn`); skip-to-main already provided by the site; visible focus ring (3px); 44px minimum targets (checked at 375px width); no horizontal overflow at 375px; settings controls are real buttons with `aria-pressed`; decorative SVG is `aria-hidden`; every picture has visible text describing it; print stylesheet shows verses only; the whole scripture text is plain HTML and readable without JavaScript.

Not yet done: a screen-reader pass; 200 percent zoom check; keyboard walkthrough of the future interactive analogies.

## 7. Audio

The site has no audio (removed on 2026-10-08, and not restored here). The brief's audio player, waveform, ambient sound and audio-responsive highlights are therefore **not built**, and the homepage says so plainly. If verified human recordings are added later: no autoplay, ambient sound off by default and remembered locally, transcripts, line-level highlight only (not word-level without timestamps), no flashing.

## 8. Performance plan

- Verse text is server-rendered and shipped as HTML; JSON data stays on the server (the client receives only what pages render).
- Environment art for a chapter loads only on that chapter's page; the homepage loads one hero SVG.
- Chapter and verse pages are statically generated (`generateStaticParams`), one file per verse: 45 verse pages now, a few hundred when all chapters exist, well inside the deploy limits recorded for the site.
- No third-party scripts, no WebGL, no images in this slice.
- Budget to hold when artwork is added: raster art as AVIF/WebP, under 150 KB for mobile, `loading="lazy"` below the fold, reserved dimensions.

## 9. SEO

Per page: Hindi-first title and description, canonical URL, trailing-slash static URLs `/ashtavakra/{chapter}/{verse}/`, breadcrumbs, previous and next links, related-verse links. Text is real HTML (nothing inside canvas). Planned: structured data (Article, FAQPage) and glossary/concept pages.

## 10. Architecture

```
data/ashtavakra/
  chapters-meta.ts          editorial titles, symbols, palettes, status, counted verse totals
  chN-src-*.mjs, chN-chapter.json   hand-written source for a chapter (ch2 onward)
  chapter-N.json            built, validated chapter (published ones imported by lib)
lib/ashtavakra.ts           loader, verse lookup, neighbours, totals, keepDanda
lib/ashtavakra-progress.ts  local read markers (client)
scripts/ashtavakra-compose.mjs / -build.mjs / -art-prompts.ts
app/ashtavakra/
  layout.tsx, AshShell.tsx  scoped wrapper, visual-mode state, settings panel, pre-paint init script
  page.tsx                  homepage
  [chapter]/page.tsx        chapter page
  [chapter]/[verse]/page.tsx verse page
  ChapterPath.tsx, VerseBits.tsx (client), VerseView.tsx, visuals.tsx
  ashtavakra.css            tokens, themes, modes, motion
```

Publishing a chapter: compose and build it (`ashtavakra-compose.mjs N`, `ashtavakra-build.mjs N`), import `chapter-N.json` in `lib/ashtavakra.ts`, add N to `PUBLISHED` in `chapters-meta.ts`. Content is never hard-coded in visual components.

## 11. Source-verification workflow

1. Render pages to images; read them; zoom into doubtful lines.
2. Record the printed Sanskrit exactly; note printed-text disagreements instead of repairing them.
3. Write the original Hindi restatement of the commentary; add the required safety statements (the build script checks them per verse).
4. `ashtavakra-build.mjs` validates order, completeness, labels, summary length and safety statements.
5. A named reviewer should check flagged verses against the original pages before any "reviewed" label is shown. None is recorded yet.

## 12. States and fallbacks

- Animation off or failed: static SVG, all text present.
- Unpublished chapter: shown as "अभी तैयार नहीं" with no link and no invented content.
- Storage blocked: settings and read markers apply for the visit; the verse page says when a marker could not be saved.
- No JavaScript: all scripture and explanation text is present; only the saved-mode, read markers and daily rotation need script.

## 13. Next steps, in order

1. Compose chapter 3 and publish; continue chapters 4 to 20 (each needs the same page-by-page reading).
2. Real artwork for chapter 1, then the others, from `art-prompts.md`.
3. Word explorer (verified words only), then Sakshi and Contemplation modes.
4. Search and concept map with a list alternative.
5. Screen-reader, zoom and keyboard passes; then performance measurement on a low-end phone.

## 14. QA checklist

- [ ] Every published verse present, in order, none duplicated
- [ ] Flagged verses visibly flagged
- [ ] Modern examples labelled and separate from translation
- [ ] Reading mode shows no decoration
- [ ] Reduced motion removes all animation
- [ ] 375px: no overflow, targets 44px
- [ ] Contrast checked in light and dark
- [ ] Print shows verses only
- [ ] No audio claims anywhere
