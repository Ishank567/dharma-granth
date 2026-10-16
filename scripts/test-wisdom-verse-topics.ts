import assert from 'node:assert/strict';
import { wisdomTopics } from '@/data/wisdom-for-life';
import { libraryLocation } from '@/lib/wisdom-links';
import { coveredVerses, wisdomTopicsForVerse } from '@/lib/wisdom-verse-topics';
import { hasVersePages } from '@/lib/verse-paths';

// Gita 2.47 is cited under two topics; each link opens that topic's verse card.
const gita = wisdomTopicsForVerse('bhagavadgita', 2, '47');
assert.equal(gita.length, 2);
assert.notEqual(gita[0].slug, gita[1].slug);
assert.match(gita[0].href, /^\/wisdom-for-life\/[a-z0-9-]+\/#verse-.+$/);

// A range citation (Gita 2.62–63) is found from both verses.
assert.ok(wisdomTopicsForVerse('bhagavadgita', 2, '62').length >= 1);
assert.ok(wisdomTopicsForVerse('bhagavadgita', 2, '63').length >= 1);
assert.equal(wisdomTopicsForVerse('bhagavadgita', 2, '64').length, 0);

// Every citation with a verse page finds its own topic from that page.
let linked = 0;
for (const topic of wisdomTopics) {
  for (const v of topic.verses) {
    if (!hasVersePages(v.scriptureId)) continue;
    const { chapter } = libraryLocation(v);
    for (const verse of coveredVerses(v)) {
      const found = wisdomTopicsForVerse(v.scriptureId, chapter, verse);
      assert.ok(found.some((t) => t.slug === topic.slug), `${v.referenceDisplay} (${verse}) misses ${topic.slug}`);
      linked++;
    }
  }
}
console.log(`wisdom-verse-topics: all assertions passed (${linked} verse pages link to their topic)`);
