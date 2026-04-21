import { NextRequest, NextResponse } from 'next/server';
import { getTotalVerseCount, getVerseById, getInterpretation, saveInterpretation } from '@/app/lib/db';
import { generateInterpretation } from '@/app/lib/gemini';
import { getGuidedCourseContextForVerse } from '@/app/lib/guidedCourses';
import { createOfflineInterpretation } from '@/app/lib/offlineInterpretation';
import {
  InterpretationValidationError,
  buildInterpretationInput,
  createInterpretationApiResponse,
  type InterpretationApiResponse,
  type InterpretationFallbackReason,
} from '@/app/lib/interpretationUtils';
import type { Verse, Interpretation } from '@/app/lib/types';

type DebugMode = 'force-offline' | 'force-ai-upgrade';

// Simple rate limiting
const requestTimes: number[] = [];
const RATE_LIMIT = 10; // max requests per minute
const WINDOW_MS = 60_000;

function isRateLimited(): boolean {
  const now = Date.now();
  while (requestTimes.length > 0 && requestTimes[0]! < now - WINDOW_MS) {
    requestTimes.shift();
  }
  return requestTimes.length >= RATE_LIMIT;
}

function markAiAttempt() {
  requestTimes.push(Date.now());
}

function buildResponse(
  interpretation: Interpretation,
  status: InterpretationApiResponse['status'],
  fallbackReason?: InterpretationFallbackReason
) {
  return NextResponse.json(
    createInterpretationApiResponse(interpretation, status, fallbackReason)
  );
}

function getFallbackReason(error: unknown): InterpretationFallbackReason {
  if (error instanceof InterpretationValidationError) {
    return 'invalid_ai_output';
  }

  return 'ai_error';
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const verseId = requestBody?.verseId;
    const debugMode: DebugMode | undefined =
      process.env.NODE_ENV !== 'production' &&
      (requestBody?.debugMode === 'force-offline' || requestBody?.debugMode === 'force-ai-upgrade')
        ? (requestBody.debugMode as DebugMode)
        : undefined;

    if (!verseId || typeof verseId !== 'number') {
      return NextResponse.json({ error: 'श्लोक की पहचान संख्या आवश्यक है' }, { status: 400 });
    }

    // Check cache first
    const cached = getInterpretation(verseId) as Interpretation | undefined;
    if (cached && cached.source !== 'offline' && !debugMode) {
      return buildResponse(cached, 'cached');
    }

    const hasAiKey = Boolean(process.env.GOOGLE_GEMINI_API_KEY);
    const aiRateLimited = hasAiKey && isRateLimited();

    if (cached?.source === 'offline' && (!hasAiKey || aiRateLimited)) {
      return buildResponse(cached, 'fallback', hasAiKey ? 'rate_limited' : 'missing_api_key');
    }

    // Get verse
    const verse = getVerseById(verseId) as Verse | undefined;
    if (!verse) {
      return NextResponse.json({ error: 'श्लोक नहीं मिला' }, { status: 404 });
    }

    const courseContext = verse.book_slug
      ? getGuidedCourseContextForVerse(
          verse.book_slug,
          verse.verse_number,
          getTotalVerseCount(verse.book_id)
        )
      : undefined;

    const interpretationInput = buildInterpretationInput(verse, courseContext);

    const persistInterpretation = (
      payload: {
        shabdarth: string;
        bhavarth: string;
        simple_example: string;
        guided_learning: string;
        scientific_temperament: string;
        modern_relevance: string;
        next_curiosity: string;
      },
      source: Interpretation['source']
    ) => {
      saveInterpretation(
        verseId,
        payload.shabdarth,
        payload.bhavarth,
        payload.guided_learning,
        payload.scientific_temperament,
        payload.modern_relevance,
        source,
        payload.simple_example,
        payload.next_curiosity
      );

      return getInterpretation(verseId) as Interpretation;
    };

    const getOrCreateOfflineInterpretation = (forceRefresh = false) => {
      if (cached?.source === 'offline' && !forceRefresh) {
        return cached;
      }

      const offline = createOfflineInterpretation(interpretationInput);
      return persistInterpretation(offline, 'offline');
    };

    if (debugMode === 'force-offline') {
      return buildResponse(getOrCreateOfflineInterpretation(true), 'fallback');
    }

    if (debugMode === 'force-ai-upgrade') {
      const baseInterpretation = cached?.source === 'offline'
        ? cached
        : getOrCreateOfflineInterpretation(true);

      const simulatedAi = persistInterpretation(
        {
          shabdarth: baseInterpretation.shabdarth,
          bhavarth: baseInterpretation.bhavarth,
          simple_example: baseInterpretation.simple_example,
          guided_learning: baseInterpretation.guided_learning,
          scientific_temperament: baseInterpretation.scientific_temperament,
          modern_relevance: baseInterpretation.modern_relevance,
          next_curiosity: baseInterpretation.next_curiosity,
        },
        'ai'
      );

      return buildResponse(simulatedAi, cached?.source === 'offline' ? 'upgraded' : 'generated');
    }

    // If AI is unavailable or throttled, fall back to the local interpreter.
    if (!hasAiKey) {
      return buildResponse(getOrCreateOfflineInterpretation(), 'fallback', 'missing_api_key');
    }

    if (aiRateLimited) {
      return buildResponse(getOrCreateOfflineInterpretation(), 'fallback', 'rate_limited');
    }

    try {
      // Generate interpretation
      markAiAttempt();
      const result = await generateInterpretation(interpretationInput);

      // Save to cache
      persistInterpretation(result, 'ai');
    } catch (error) {
      console.error('Interpretation AI error:', error);
      return buildResponse(
        getOrCreateOfflineInterpretation(),
        'fallback',
        getFallbackReason(error)
      );
    }

    // Return the saved interpretation
    const saved = getInterpretation(verseId) as Interpretation;
    return buildResponse(saved, cached?.source === 'offline' ? 'upgraded' : 'generated');
  } catch (error) {
    console.error('Interpretation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'व्याख्या उत्पन्न करने में त्रुटि' },
      { status: 500 }
    );
  }
}
