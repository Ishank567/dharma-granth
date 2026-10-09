/**
 * Privacy-first event tracking. There is no network transport here: events
 * are handed to a sink only if the deployment installs one
 * (`window.__dharmaAnalytics`), and never when the browser sends Do Not Track
 * or the reader has turned it off. The shape is enforced in code:
 *
 *  - only the events below exist;
 *  - each event accepts only its named properties;
 *  - a property value must be a number, a boolean, or a short identifier made
 *    of letters, digits and : . _ - (so a sentence, a note, a reflection or a
 *    journal line cannot get through, whatever a caller passes).
 */

export type AnalyticsEvent =
  | 'search_completed'
  | 'search_no_result'
  | 'verse_opened'
  | 'mode_selected'
  | 'explanation_mode_selected'
  | 'simple_meaning_opened'
  | 'commentary_opened'
  | 'continue_reading_selected'
  | 'verse_saved'
  | 'collection_created'
  | 'journey_started'
  | 'lesson_completed'
  | 'recommendation_opened'
  | 'recommendation_hidden'
  | 'feedback_submitted'
  | 'source_panel_opened'
  | 'correction_submitted'
  | 'download_completed'
  | 'offline_content_opened';

/** The only properties each event may carry. */
export const EVENT_PROPERTIES: Record<AnalyticsEvent, readonly string[]> = {
  search_completed: ['resultCount', 'intent'],
  search_no_result: ['intent'],
  verse_opened: ['scriptureId', 'chapter', 'verse'],
  mode_selected: ['mode'],
  explanation_mode_selected: ['mode'],
  simple_meaning_opened: ['scriptureId'],
  commentary_opened: ['scriptureId', 'commentator'],
  continue_reading_selected: ['scriptureId'],
  verse_saved: ['scriptureId', 'collectionId'],
  collection_created: [],
  journey_started: ['journeyId'],
  lesson_completed: ['journeyId', 'lessonId'],
  recommendation_opened: ['kind'],
  recommendation_hidden: ['kind'],
  feedback_submitted: ['rating'],
  source_panel_opened: ['scriptureId'],
  correction_submitted: ['kind'],
  download_completed: ['kind'],
  offline_content_opened: ['kind'],
};

export type SafeValue = string | number | boolean;
const SAFE_ID = /^[A-Za-z0-9:._-]{1,48}$/;

export interface CleanEvent {
  name: AnalyticsEvent;
  props: Record<string, SafeValue>;
}

/** Returns the event reduced to what is allowed, or null for an unknown event. */
export function cleanEvent(name: string, props: Record<string, unknown> = {}): CleanEvent | null {
  const allowed = EVENT_PROPERTIES[name as AnalyticsEvent];
  if (!allowed) return null;
  const out: Record<string, SafeValue> = {};
  for (const key of allowed) {
    const v = props[key];
    if (typeof v === 'number' && Number.isFinite(v)) out[key] = v;
    else if (typeof v === 'boolean') out[key] = v;
    else if (typeof v === 'string' && SAFE_ID.test(v)) out[key] = v;
  }
  return { name: name as AnalyticsEvent, props: out };
}

const OFF_KEY = 'dharma.analytics.off';

export function analyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.localStorage.getItem(OFF_KEY) === '1') return false;
    const nav = window.navigator as Navigator & { msDoNotTrack?: string };
    if (nav.doNotTrack === '1' || nav.msDoNotTrack === '1') return false;
  } catch {
    return false;
  }
  return true;
}

export function setAnalyticsEnabled(on: boolean): void {
  try {
    if (on) window.localStorage.removeItem(OFF_KEY);
    else window.localStorage.setItem(OFF_KEY, '1');
  } catch {
    // Storage blocked: nothing is stored either way.
  }
}

type Sink = (event: CleanEvent) => void;

/** Record an event. Safe to call anywhere; does nothing unless a sink exists and tracking is allowed. */
export function track(name: AnalyticsEvent, props: Record<string, unknown> = {}): void {
  if (!analyticsEnabled()) return;
  const event = cleanEvent(name, props);
  if (!event) return;
  const sink = (window as unknown as { __dharmaAnalytics?: Sink }).__dharmaAnalytics;
  try {
    sink?.(event);
    window.dispatchEvent(new CustomEvent('dharma:analytics', { detail: event }));
  } catch {
    // Analytics must never break reading.
  }
}
