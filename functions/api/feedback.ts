/**
 * Cloudflare Pages Function for /api/feedback. All logic lives in
 * lib/feedback-server.ts so it can be tested. Needs a KV binding named
 * FEEDBACK and (to read results) a secret named EDITORIAL_TOKEN; see
 * docs/feedback-collection.md. Without them, posting returns 503 and the
 * reader's choice is kept on the device only.
 */
import { handleFeedback, type Env } from '../../lib/feedback-server';

export const onRequest = (context: { request: Request; env: Env }) => handleFeedback(context.request, context.env);
