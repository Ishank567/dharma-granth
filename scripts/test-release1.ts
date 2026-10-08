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

  console.log('release1: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
