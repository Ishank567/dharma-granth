/**
 * A verse with no written reading must not grow a shared Gen-Z line or a shared life scene.
 * Run: node .\node_modules\tsx\dist\cli.mjs scripts\test-layered-verse.ts
 */
import assert from 'node:assert/strict';
import { buildLayeredVerseData } from '../lib/layered-verse-engine';

const plain = buildLayeredVerseData('bhagavadgita', 2, 27, {
  number: 27,
  sanskrit: 'जातस्य हि ध्रुवो मृत्युः',
  hindi: 'पैदा हुए की जरूर मृत्यु होगी।',
  translation: 'Death is certain for the born.',
});
assert.equal(plain.isCuratedPedagogical, false);
assert.equal(plain.simpleMeaning.en, '');
assert.equal(plain.simpleMeaning.hi, '');
assert.equal(plain.genZInterpretation.en, '');
assert.equal(plain.genZInterpretation.tagline, '');
assert.equal(plain.whyItMattersToday.length, 0);
assert.equal(plain.realWorldExamples.length, 0);
assert.equal(plain.perspectives.spiritual, '');
assert.equal(plain.dailyExercise.actionStep, '');
assert.equal(plain.keyTakeaway.hi, '');
assert.equal(plain.translation, 'Death is certain for the born.');

const written = buildLayeredVerseData('bhagavadgita', 2, 47, {
  number: 47,
  hindi: 'कर्तव्य-कर्म करने में ही तेरा अधिकार है।',
  translation: 'Your right is to work.',
});
assert.equal(written.isCuratedPedagogical, true);
assert.ok(written.simpleMeaning.hi.length > 20);
assert.ok(written.keyTakeaway.hi.length > 0);
assert.ok(written.whyItMattersToday.length > 0);
assert.ok(written.dailyExercise.actionStepHi && written.dailyExercise.actionStepHi.length > 0);
assert.equal(written.genZInterpretation.en, '');
assert.equal(written.realWorldExamples.length, 0);

console.log('layered verse tests passed');
