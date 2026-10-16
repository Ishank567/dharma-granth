/**
 * The guide must copy library lines and must not invent a verse.
 * Run: node .\node_modules\tsx\dist\cli.mjs scripts\test-copilot.ts
 */
import assert from 'node:assert/strict';
import { answerQuestion } from '../lib/copilot';
import { getWisdomTopic } from '../data/wisdom-for-life';
import { concepts } from '../data/concepts';

function topicLines(slug: string) {
  const topic = getWisdomTopic(slug);
  assert.ok(topic, slug);
  return topic;
}

const anxiety = answerQuestion('What does the Gita say about anxiety?');
const anxietyHi = answerQuestion('गीता चिंता पर क्या कहती है?');
const stress = topicLines('stress-and-worry');
assert.equal(anxiety.kind, 'topic');
assert.equal(anxiety.pageHref, '/wisdom-for-life/stress-and-worry/');
assert.equal(anxietyHi.pageHref, anxiety.pageHref);
assert.equal(anxiety.verses[0].sanskrit, stress.verses[0].sanskritDevanagari.trim());
assert.equal(anxiety.verses[0].hindi, stress.verses[0].literalTranslationHi);
assert.equal(anxiety.contextHi, stress.traditionalContextOverview.bodyHi);

const anger = answerQuestion('How do I control anger?');
const angerTopic = topicLines('anger');
assert.equal(anger.pageHref, '/wisdom-for-life/anger/');
assert.ok(anger.verses[0].sanskrit.includes('ध्यायतो विषयान्पुंसः'));
assert.equal(anger.verses[0].sanskrit, angerTopic.verses[0].sanskritDevanagari.trim());
assert.equal(anger.dailyHi, angerTopic.reflections[0].dailyPracticeHi);

const outcomes = answerQuestion('How can I stop worrying about outcomes?');
const duty = topicLines('duty-and-decision-making');
assert.equal(outcomes.pageHref, '/wisdom-for-life/duty-and-decision-making/');
assert.ok(outcomes.verses.some((verse) => verse.sanskrit.includes('कर्मण्येवाधिकारस्ते')));
assert.equal(outcomes.verses[0].sanskrit, duty.verses[0].sanskritDevanagari.trim());

const dharma = answerQuestion('What is Dharma?');
const dharmaConcept = concepts.find((item) => item.id === 'dharma');
assert.equal(dharma.kind, 'concept');
assert.equal(dharma.pageHref, '/concepts/dharma/');
assert.equal(dharma.contextHi, dharmaConcept?.description);
assert.equal(dharma.verses.length, 0);

const karma = answerQuestion('What is Karma Yoga?');
assert.equal(karma.pageHref, '/concepts/karma-yoga/');
assert.ok(karma.contextHi.includes('भगवद्गीता 2.47'));

const failure = answerQuestion('I am facing failure');
assert.equal(failure.pageHref, '/wisdom-for-life/failure-and-setbacks/');
assert.ok(failure.verses[0].sanskrit.includes('कर्मण्येवाधिकारस्ते'));
assert.equal(answerQuestion('I failed').pageHref, failure.pageHref);

const death = answerQuestion('What does the Gita say about death?');
assert.equal(death.pageHref, '/wisdom-for-life/death/');
assert.ok(death.verses[0].sanskrit.includes('जातस्य हि ध्रुवो मृत्यु'));

const grief = answerQuestion('I am in grief');
assert.equal(grief.pageHref, '/wisdom-for-life/grief-and-loss/');

const empty = answerQuestion('xyzzy plugh');
assert.equal(empty.kind, 'empty');
assert.equal(empty.verses.length, 0);
assert.equal(answerQuestion(' ').kind, 'empty');

console.log('copilot tests passed');
