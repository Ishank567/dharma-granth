# Disabled routes

Two `opengraph-image.tsx` files were temporarily moved here to unblock
`next build` under `output: 'export'`. Both were untracked WIP that never
built successfully on the slice-e1-courses branch.

## `opengraph-image.tsx.bak` (was `app/opengraph-image.tsx`)

The root OG image. Fails at static export with
`TypeError: Invalid URL` from `@vercel/og`'s `fileURLToPath` call when it
tries to load its default Inter font. This is a known interaction between
`@vercel/og`, Windows file paths, and Next's static export pipeline.

To re-enable: either pass an explicit `fonts: [...]` array to `ImageResponse`
(loading a `.ttf`/`.otf` from `public/`), or replace with a static `.png` in
`public/opengraph-image.png` and set `<meta property="og:image">` in the root
layout manually.

## `scripture-id/opengraph-image.tsx.bak` (was `app/scripture/[id]/opengraph-image.tsx`)

The per-scripture OG image. Confirmed Next 14.2 bug: the build worker
returns empty `prerenderRoutes` for dynamic-segment `opengraph-image.tsx`
files under `output: 'export'`, regardless of what `generateStaticParams`
returns — including hardcoded `[{ id: 'bhagavadgita' }]`. The error reports
"missing generateStaticParams" but the function is present and correct.

To re-enable when Next ships a fix (or you upgrade to a version that
resolves this):

```bash
mv .disabled-routes/scripture-id/opengraph-image.tsx.bak \\
   "app/scripture/[id]/opengraph-image.tsx"
```

Alternative: pre-generate the per-scripture OG PNGs at build time with a
script in `scripts/` and place them under `public/og/<id>.png`, then
reference them from `generateMetadata` in `app/scripture/[id]/page.tsx`.
That avoids the metadata-route machinery entirely.
