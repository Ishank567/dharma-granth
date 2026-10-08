# Clarity feedback collection (optional)

Readers can answer "Was this explanation clear?" on any simplified explanation. By default the answer stays in their browser. A reader can tick **Also share my answers anonymously with the editors**; only then is anything sent.

## What is sent, and what is stored

Sent: a verse reference such as `bhagavadgita:2:47`, a rating (`yes`, `partly`, `no`) and fixed reason ids (`language`, `example`, `long`, `context`, `source`, `textual`, `other`). Nothing else: no text, no account, no identifier.

Stored: one counter per verse, rating and reason (`fb:<verse>:r:<rating>`, `fb:<verse>:w:<reason>`). The collector never reads or stores the caller's address, user agent or cookies. Sharing is off when the browser sends Do Not Track. Counts are approximate (concurrent submissions can lose an increment) and describe only readers who chose to share.

Clarity feedback is separate from correction reports, which go to GitHub issues.

## Deploying the collector

The collector is a Cloudflare Pages Function (`functions/api/feedback.ts`; logic in `lib/feedback-server.ts`, tested by `npm run test:release1`).

1. Create a KV namespace (Workers & Pages, KV) and bind it to the Pages project as `FEEDBACK` (Settings, Functions, KV namespace bindings).
2. Add a secret named `EDITORIAL_TOKEN` (Settings, Environment variables, encrypted) with a long random value. Without it, the read endpoint does not exist.
3. Deploy with `wrangler pages deploy dist` from the repository root, so the `functions` folder is included.
4. Open `/editorial`, enter the token under "Clarity feedback shared by readers", and load.

Until these are set, a share attempt gets a 503 and the reader is told nothing was sent. The CSP already allows requests to the site's own origin.

## Limits

- No rate limiting is built in. A determined person could inflate counts. Put Cloudflare rate limiting on `/api/feedback` if that matters.
- Verified here by unit tests against an in-memory store; not run against a live Cloudflare deployment.
