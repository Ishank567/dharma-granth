import { NextRequest, NextResponse } from 'next/server';
import { getVerseDetail } from '@/app/lib/content';
import { getGuidedCourseContextForVerse } from '@/app/lib/guidedCourses';
import { generateInterpretation } from '@/app/lib/gemini';
import { createOfflineInterpretation } from '@/app/lib/offlineInterpretation';
import {
  getInflight,
  registerInflight,
  isRateLimitedNow,
  markRateLimited,
  persistInterpretation,
} from '@/app/lib/interpretationCache';
import {
  buildInterpretationInput,
  createInterpretationApiResponse,
  InterpretationValidationError,
  type InterpretationFallbackReason,
  type InterpretationGenerationInput,
  type InterpretationPayload,
  type InterpretationRequestStatus,
} from '@/app/lib/interpretationUtils';
import type { Interpretation } from '@/app/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type DebugMode = 'force-offline' | 'force-ai-upgrade';

interface Body {
  verseId?: number;
  bookSlug?: string;
  debugMode?: DebugMode;
}

function toInterpretation(
  verseId: number,
  payload: InterpretationPayload,
  source: Interpretation['source']
): Interpretation {
  return {
    id: verseId,
    verse_id: verseId,
    shabdarth: payload.shabdarth,
    bhavarth: payload.bhavarth,
    simple_example: payload.simple_example,
    guided_learning: payload.guided_learning,
    scientific_temperament: payload.scientific_temperament,
    modern_relevance: payload.modern_relevance,
    next_curiosity: payload.next_curiosity,
    source,
    created_at: new Date().toISOString(),
  };
}

function classifyError(err: unknown): InterpretationFallbackReason {
  if (err instanceof InterpretationValidationError) return 'invalid_ai_output';
  const msg = err instanceof Error ? err.message.toLowerCase() : '';
  if (msg.includes('api key') || msg.includes('api_key_invalid') || msg.includes('सेट नहीं')) {
    return 'missing_api_key';
  }
  if (msg.includes('429') || msg.includes('rate') || msg.includes('quota')) return 'rate_limited';
  return 'ai_error';
}

function shouldCooldown(reason: InterpretationFallbackReason) {
  // Rate-limited keys need to cool off. When every configured key is
  // invalid/expired we also classify as 'missing_api_key' from the error
  // message; same treatment avoids hammering Gemini with known-dead keys.
  return reason === 'rate_limited' || reason === 'missing_api_key';
}

async function runGemini(
  bookSlug: string,
  verseId: number,
  input: InterpretationGenerationInput
): Promise<Interpretation> {
  const existing = getInflight(bookSlug, verseId);
  if (existing) return existing;

  const promise = (async () => {
    const payload = await generateInterpretation(input);
    const interpretation = toInterpretation(verseId, payload, 'ai');
    persistInterpretation(bookSlug, verseId, interpretation);
    return interpretation;
  })();

  registerInflight(bookSlug, verseId, promise);
  return promise;
}

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { verseId, bookSlug, debugMode } = body;
  if (typeof verseId !== 'number' || !bookSlug) {
    return NextResponse.json({ error: 'verseId and bookSlug are required' }, { status: 400 });
  }

  const detail = getVerseDetail(bookSlug, verseId);
  if (!detail) {
    return NextResponse.json({ error: 'Verse not found' }, { status: 404 });
  }

  const { verse, book } = detail;

  // If a valid AI-baked interpretation already exists (from a prior successful
  // call that we wrote back to disk), return it immediately. 'offline' baked
  // results are treated as upgrade candidates and still trigger a Gemini try.
  const baked = detail.interpretation;
  const bakedIsAi = baked && (baked.source === 'ai' || baked.source === 'manual');
  if (bakedIsAi && debugMode !== 'force-offline' && debugMode !== 'force-ai-upgrade') {
    const interpretation: Interpretation = {
      id: baked.id,
      verse_id: baked.verse_id,
      shabdarth: baked.shabdarth ?? '',
      bhavarth: baked.bhavarth ?? '',
      simple_example: baked.simple_example ?? '',
      guided_learning: baked.guided_learning ?? '',
      scientific_temperament: baked.scientific_temperament ?? '',
      modern_relevance: baked.modern_relevance ?? '',
      next_curiosity: baked.next_curiosity ?? '',
      source: (baked.source as Interpretation['source']) || 'ai',
      created_at: baked.created_at ?? new Date().toISOString(),
    };
    return NextResponse.json(createInterpretationApiResponse(interpretation, 'cached'));
  }

  const courseContext = getGuidedCourseContextForVerse(
    bookSlug,
    verse.verse_number,
    book.verses.length
  );

  const input = buildInterpretationInput(
    {
      id: verse.id,
      verse_number: verse.verse_number,
      original_text: verse.original_text,
      transliteration: verse.transliteration ?? '',
      translation_hindi: verse.translation_hindi ?? '',
      translation_english: verse.translation_english ?? '',
      book_title: book.title_hindi || book.title,
      book_slug: bookSlug,
    },
    courseContext
  );

  const hasApiKey = !!(process.env.GOOGLE_GEMINI_API_KEY_2 || process.env.GOOGLE_GEMINI_API_KEY);

  const returnOffline = (reason: InterpretationFallbackReason) => {
    const offline = createOfflineInterpretation(input);
    const interpretation = toInterpretation(verse.id, offline, 'offline');
    return NextResponse.json(
      createInterpretationApiResponse(interpretation, 'fallback', reason)
    );
  };

  if (debugMode === 'force-offline') return returnOffline('ai_error');
  if (!hasApiKey) return returnOffline('missing_api_key');
  if (isRateLimitedNow()) return returnOffline('rate_limited');

  try {
    const interpretation = await runGemini(bookSlug, verse.id, input);
    const status: InterpretationRequestStatus =
      debugMode === 'force-ai-upgrade' ? 'upgraded' : 'generated';
    return NextResponse.json(createInterpretationApiResponse(interpretation, status));
  } catch (err) {
    const reason = classifyError(err);
    if (shouldCooldown(reason)) markRateLimited();
    return returnOffline(reason);
  }
}
