/**
 * Unit tests for Release 1 logic that runs without a browser.
 * Run: npm run test:release1
 */
import assert from 'node:assert/strict';

// A minimal browser-like storage so the local-first modules can run in Node.
class MemoryStorage {
  private m = new Map<string, string>();
  get length() { return this.m.size; }
  key(i: number) { return Array.from(this.m.keys())[i] ?? null; }
  getItem(k: string) { return this.m.has(k) ? (this.m.get(k) as string) : null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
}
const storage = new MemoryStorage();
(globalThis as unknown as { window: unknown }).window = { localStorage: storage, dispatchEvent: () => true };

async function main() {
  const history = await import('../lib/reading-history');

  /* ── Reading history ── */
  const visit = (id: string, chapter = 1) => ({ scriptureId: id, scriptureTitle: id, chapterId: chapter, chapterTitle: `Chapter ${chapter}`, totalChapters: 18 });

  history.recordChapterVisit(visit('bhagavadgita', 2));
  history.updateLastVerse('bhagavadgita', 2, '47');
  assert.equal(history.readRecentChapters()[0].verseId, '47', 'reading position is stored');

  history.setHistoryPaused(true);
  assert.equal(history.isHistoryPaused(), true);
  history.recordChapterVisit(visit('ishavasya'));
  history.updateLastVerse('bhagavadgita', 2, '48');
  assert.equal(history.readRecentChapters().length, 1, 'paused history records nothing new');
  assert.equal(history.readRecentChapters()[0].verseId, '47', 'paused history does not move the position');
  history.setHistoryPaused(false);
  assert.equal(history.isHistoryPaused(), false);

  history.recordChapterVisit(visit('ishavasya'));
  const exported = history.exportHistory();
  assert.ok(!/note/i.test(exported), 'export holds chapters and positions only');
  assert.equal(history.clearHistory(), 2);
  assert.equal(history.readRecentChapters().length, 0);
  assert.equal(history.importHistory(exported), 2, 'export then import round-trips');
  assert.equal(history.readRecentChapters().length, 2);

  assert.throws(() => history.importHistory('{"format":"something-else","version":1,"visits":[]}'), /Not a Dharma Granth/);
  assert.throws(() => history.importHistory('not json'));
  const before = history.readRecentChapters().length;
  const messy = JSON.stringify({ format: history.HISTORY_EXPORT_FORMAT, version: 1, visits: [{ scriptureId: '../x', scriptureTitle: 'x', chapterId: 1, chapterTitle: 'c', readAt: 'now' }, { nope: true }] });
  assert.equal(history.importHistory(messy), 0, 'malformed entries are dropped');
  assert.equal(history.readRecentChapters().length, before);

  /* ── Collections ── */
  const col = await import('../lib/verse-collections');
  let st = col.emptyState();
  assert.deepEqual(st.collections.map((c) => c.name), ['Read Later', 'Favourites', 'Study Carefully', 'Daily Reflection', 'Share Later']);
  const v1 = { scriptureId: 'bhagavadgita', chapterId: 2, verseId: 47 };
  const v2 = { scriptureId: 'ishavasya', chapterId: 1, verseId: 1 };
  assert.equal(col.collectionOf(st, v1), 'read-later', 'unassigned saved verses are in Read Later');

  const made = col.createCollection(st, '  Exam week  ');
  assert.ok(made.id && !made.error);
  st = made.state;
  assert.equal(st.collections.at(-1)?.name, 'Exam week');
  assert.ok(col.createCollection(st, 'exam WEEK').error, 'names are unique ignoring case');
  assert.ok(col.createCollection(st, '   ').error);
  assert.equal(col.createCollection(st, 'x'.repeat(80)).state.collections.at(-1)?.name.length, col.MAX_NAME);

  st = col.moveVerse(st, v1, made.id!);
  st = col.moveVerse(st, v2, 'favourites');
  assert.equal(col.collectionOf(st, v1), made.id);
  assert.equal(col.collectionOf(st, v2), 'favourites');
  assert.equal(col.moveVerse(st, v1, 'no-such-collection'), st, 'moving to an unknown collection changes nothing');

  assert.ok(col.renameCollection(st, 'read-later', 'Later').error, 'built-ins keep their names');
  const renamed = col.renameCollection(st, made.id!, 'Revision');
  assert.equal(renamed.state.collections.find((c) => c.id === made.id)?.name, 'Revision');
  assert.ok(col.renameCollection(st, made.id!, 'Favourites').error, 'rename cannot collide');

  assert.ok(col.deleteCollection(st, 'favourites').error, 'built-ins cannot be deleted');
  const removed = col.deleteCollection(renamed.state, made.id!);
  assert.equal(col.collectionOf(removed.state, v1), 'read-later', 'deleting a collection moves its verses to Read Later');
  assert.equal(removed.state.collections.length, 5);

  const saved = [
    { ...v1, scriptureTitle: 'Bhagavad Gita', chapterTitle: 'Sankhya Yoga', sanskrit: 'कर्मण्येवाधिकारस्ते', translation: 'You have the right to work alone' },
    { ...v2, scriptureTitle: 'Isha Upanishad', chapterTitle: 'Isha', sanskrit: 'ईशा वास्यमिदं', translation: 'All this is pervaded by the Lord' },
  ];
  const note = (v: { verseId: number | string }) => (String(v.verseId) === '1' ? 'my private reminder about Isha' : undefined);
  assert.equal(col.filterSaved(saved, st, { query: 'right to work' }).length, 1);
  assert.equal(col.filterSaved(saved, st, { query: 'REMINDER' }, note).length, 1, 'search includes the private note');
  assert.equal(col.filterSaved(saved, st, { scriptureId: 'ishavasya' }).length, 1);
  assert.equal(col.filterSaved(saved, st, { collectionId: 'favourites' }).length, 1);
  assert.equal(col.filterSaved(saved, st, { query: 'kharma-not-there' }).length, 0);

  // Export leaves private notes out unless they are explicitly passed.
  const plain = col.buildExport(saved, st);
  assert.ok(!plain.includes('private reminder') && !('notes' in JSON.parse(plain)));
  const withNotes = col.buildExport(saved, st, [{ scriptureId: 'ishavasya', chapterId: 1, verseId: 1, text: 'private', updatedAt: 'x' }]);
  assert.equal(col.parseExport(withNotes).notes.length, 1);
  assert.equal(col.parseExport(plain).saved.length, 2);
  assert.equal(col.parseExport(plain).state.assign[col.verseKey(v2)], 'favourites', 'export then import keeps assignments');
  assert.throws(() => col.parseExport('{"format":"other","version":1}'), /Not a Dharma Granth/);
  assert.equal(col.sanitize({ collections: [{ id: 'bad id!', name: 'x' }, { id: 'ok-1', name: 'Fine' }], assign: { 'bhagavadgita:2:47': 'missing' } }).collections.length, 6);
  assert.deepEqual(col.sanitize(null), col.emptyState());

  /* ── Analytics policy ── */
  const an = await import('../lib/analytics');
  assert.equal(an.cleanEvent('not_an_event', {}), null, 'unknown events are dropped');
  const saved1 = an.cleanEvent('verse_saved', { scriptureId: 'bhagavadgita', collectionId: 'read-later', note: 'my private thought', text: 'secret' });
  assert.deepEqual(saved1?.props, { scriptureId: 'bhagavadgita', collectionId: 'read-later' }, 'properties not on the allowlist are dropped');
  assert.deepEqual(an.cleanEvent('verse_saved', { scriptureId: 'I felt anxious today about my exam' })?.props, {}, 'sentences are dropped even in an allowed property');
  assert.deepEqual(an.cleanEvent('feedback_submitted', { rating: 'partly', reasons: ['Language was difficult'] })?.props, { rating: 'partly' });
  assert.deepEqual(an.cleanEvent('collection_created', { name: 'Grief and my mother' })?.props, {}, 'collection names are never sent');
  assert.deepEqual(an.cleanEvent('search_completed', { resultCount: 12, intent: 'about', query: 'verses about my anger' })?.props, { resultCount: 12, intent: 'about' }, 'search text is never sent');
  assert.deepEqual(an.cleanEvent('search_completed', { resultCount: Number.NaN })?.props, {});
  for (const [name, allowed] of Object.entries(an.EVENT_PROPERTIES)) {
    for (const p of allowed) assert.ok(!/note|text|reflection|journal|query|name|voice|recording|japa/i.test(p), `${name}.${p} could carry private text`);
  }
  // No sink and no tracking unless allowed.
  const seen: unknown[] = [];
  (globalThis as unknown as { window: Record<string, unknown> }).window.__dharmaAnalytics = (e: unknown) => seen.push(e);
  (globalThis as unknown as { window: Record<string, unknown> }).window.navigator = { doNotTrack: '1' };
  (globalThis as unknown as { window: Record<string, unknown> }).window.CustomEvent = class {} as unknown;
  an.track('verse_opened', { scriptureId: 'bhagavadgita', chapter: 2, verse: '47' });
  assert.equal(seen.length, 0, 'Do Not Track is respected');
  (globalThis as unknown as { window: Record<string, unknown> }).window.navigator = { doNotTrack: null };
  (globalThis as unknown as { CustomEvent: unknown }).CustomEvent = class { constructor(public type: string, public init: unknown) {} };
  an.track('verse_opened', { scriptureId: 'bhagavadgita', chapter: 2, verse: '47' });
  assert.equal(seen.length, 1);
  an.setAnalyticsEnabled(false);
  an.track('verse_opened', { scriptureId: 'bhagavadgita' });
  assert.equal(seen.length, 1, 'the reader can turn tracking off');

  console.log('release1: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
