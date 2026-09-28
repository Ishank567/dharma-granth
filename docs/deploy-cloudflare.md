# Deploying to Cloudflare Pages

The site outgrew GitHub Pages: with every chapter's verses in the HTML and a
page per verse, the export is ~1.3 GB, over GitHub Pages' 1 GB site limit.
Cloudflare Pages has no total-size limit (it allows 20,000 files and 25 MiB
per file, which `npm run build` checks), serves `public/_headers` (HSTS,
CSP, caching), and has edge locations across India.

The build still runs in GitHub Actions
(`.github/workflows/deploy-cloudflare.yml`) and uploads the result with
`wrangler`. Until the two secrets below exist, that workflow builds and checks
but does not deploy — the live site stays on GitHub Pages, untouched.

Nothing here changes the live site until step 5 (the domain switch).

## 1. Cloudflare account and project

1. Sign up at <https://dash.cloudflare.com> (the free plan is enough).
2. Create the Pages project **`dharma-granth`** (the name the workflow uses):
   - **Workers & Pages → Create → Pages → Upload assets**, name it
     `dharma-granth`, and upload any small folder to create it; or
   - from this repo: `npx wrangler login`, then
     `npx wrangler pages project create dharma-granth --production-branch=master`.
3. Note your **Account ID** (Workers & Pages overview, right-hand sidebar).

## 2. API token

1. **My Profile → API Tokens → Create Token → Create Custom Token.**
2. Permissions: **Account · Cloudflare Pages · Edit**. Account resources:
   your account. No zone permissions needed.
3. Create it and copy the token (shown once).

## 3. GitHub secrets

In the GitHub repo: **Settings → Secrets and variables → Actions → New
repository secret**, add:

| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | the token from step 2 |
| `CLOUDFLARE_ACCOUNT_ID` | the Account ID from step 1 |

## 4. First deploy (on the preview domain)

Push to `master`, or run **Actions → Deploy Cloudflare Pages → Run workflow**.
The first build takes ~15 minutes (it draws ~1,200 verse share images; later
builds reuse them from cache).

Check the preview at **<https://dharma-granth.pages.dev>**:

```bash
curl -sI https://dharma-granth.pages.dev/ | grep -iE "strict-transport|content-security|x-content-type"
curl -s https://dharma-granth.pages.dev/scripture/bhagavadgita/chapter/2/ | grep -c "कर्मण्येवाधिकारस्ते"
curl -s https://dharma-granth.pages.dev/scripture/bhagavadgita/chapter/2/verse/47/ | grep -c FAQPage
```

Expect the three headers, and a count of 1 or more for the other two. Open a
few pages in a browser and check the console shows no "Content Security
Policy" errors.

## 5. Move dharmagranth.in to Cloudflare

1. **Add the domain to Cloudflare** (if it isn't already): Websites → Add a
   site → `dharmagranth.in` → Free. Cloudflare copies the existing DNS
   records. At your registrar, change the nameservers to the two Cloudflare
   shows. Wait for the domain to show **Active** (minutes to a few hours).
2. **Attach it to Pages:** Workers & Pages → `dharma-granth` → Custom domains →
   **Set up a custom domain** → `dharmagranth.in`, then again for
   `www.dharmagranth.in`. Cloudflare replaces the GitHub Pages DNS records
   (the `185.199.108–111.153` A records and the `*.github.io` CNAME) with its
   own; if it asks, confirm removing the old ones.
3. **SSL/TLS → Overview:** mode **Full**. **Edge Certificates:** turn on
   **Always Use HTTPS**.
4. Verify with the step 4 commands against `https://dharmagranth.in`.

## 6. Retire GitHub Pages

Once `dharmagranth.in` serves from Cloudflare:

1. GitHub repo **Settings → Pages**: set the source to **None**.
2. Delete `.github/workflows/deploy.yml` (already manual-only) and
   `public/CNAME` (only GitHub Pages reads it).
3. In Google Search Console, resubmit `https://dharmagranth.in/sitemap.xml`.

## Optional

- **Web Analytics:** Workers & Pages → `dharma-granth` → Metrics → enable
  Web Analytics. The CSP in `public/_headers` already allows its script.
- **HSTS preload:** `_headers` sends HSTS without `preload` on purpose.
  Add `preload` and submit at <https://hstspreload.org> only once every
  subdomain is permanently HTTPS — it is hard to undo.

## Rollback

Workers & Pages → `dharma-granth` → Deployments → pick an earlier deployment
→ **Rollback**. (Pointing DNS back to GitHub Pages is not an option: the
current export is too large for it.)

## Limits the build enforces

`npm run build` fails before deploy if the export has more than 20,000 files
or any file over 25 MiB (`scripts/prune-export.mjs`). It also prunes files no
page needs (chapter data already inlined, full-book JSON, unlinked `.zip`
archives). Test the production build locally, with `_headers` applied:

```bash
npm run build
npm run serve:dist
```
