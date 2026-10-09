// Builds data/ashtavakra/chapter-N.json and docs/ashtavakra/chapter-N.md from the
// hand-written parts, and checks the editorial rules (completeness, order, labels).
// Usage: node scripts/ashtavakra-build.mjs [chapterNumber]
import fs from 'node:fs';
import path from 'node:path';

const chapterNo = process.argv[2] ?? '1';
const dir = 'data/ashtavakra';
const parts = fs.readdirSync(dir).filter((f) => f.startsWith(`ch${chapterNo}-verses-`) && f.endsWith('.json')).sort((a, b) => (parseInt(a.split('-')[2]) || 0) - (parseInt(b.split('-')[2]) || 0));
const verses = parts.flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
const chapter = JSON.parse(fs.readFileSync(path.join(dir, `ch${chapterNo}-chapter.json`), 'utf8'));

const REQUIRED = ['scripture', 'chapterNumber', 'chapterTitleHindi', 'chapterTitleEnglish', 'verseNumber', 'speaker', 'sanskrit', 'iast', 'simplePronunciation', 'padaccheda', 'wordMeanings', 'literalHindiMeaning', 'bookBasedHindiExplanation', 'simpleHindiExplanation', 'philosophicalExplanationHindi', 'analogyHindi', 'modernExampleHindi', 'messageForTodayHindi', 'commonMisunderstandingHindi', 'practicalApplicationHindi', 'reflectionQuestionHindi', 'shortPracticeHindi', 'oneLineSummaryHindi', 'englishTranslation', 'simpleEnglishExplanation', 'themes', 'searchTags', 'relatedVerses', 'sourcePage', 'verificationStatus', 'editorialNotes'];
const problems = [];
const seen = new Set();
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

verses.forEach((v, i) => {
  const id = v.verseNumber;
  for (const k of REQUIRED) {
    const val = v[k];
    if (val === undefined || val === null || (typeof val === 'string' && !val.trim()) || (Array.isArray(val) && val.length === 0 && k !== 'relatedVerses')) problems.push(`${id}: empty ${k}`);
  }
  if (seen.has(id)) problems.push(`${id}: duplicate`);
  seen.add(id);
  if (id !== `${chapterNo}.${i + 1}`) problems.push(`${id}: out of sequence (expected ${chapterNo}.${i + 1})`);
  if (!/[ऀ-ॿ]/.test(v.sanskrit)) problems.push(`${id}: sanskrit has no Devanagari`);
  const dev = String(i + 1).replace(/[0-9]/g, (d) => '०१२३४५६७८९'[d]);
  if (!v.sanskrit.includes(`॥ ${dev} ॥`)) problems.push(`${id}: verse number not in sanskrit text`);
  if (words(v.oneLineSummaryHindi) > 25) problems.push(`${id}: one-line summary over 25 words (${words(v.oneLineSummaryHindi)})`);
  if (!v.analogyHindi.includes('यह उदाहरण श्लोक का शाब्दिक अनुवाद नहीं, बल्कि उसकी शिक्षा को समझाने का माध्यम है।')) problems.push(`${id}: analogy disclaimer missing`);
  if (!v.modernExampleHindi.includes('आधुनिक उदाहरण')) problems.push(`${id}: modern example not labelled`);
  if (!['verified', 'review-required'].includes(v.verificationStatus)) problems.push(`${id}: bad verificationStatus`);
  const hindiLen = v.bookBasedHindiExplanation.length + v.simpleHindiExplanation.length;
  if (v.simpleEnglishExplanation.length > hindiLen) problems.push(`${id}: English explanation longer than Hindi explanation`);
  // Responsibility statements the brief requires when a verse touches these topics.
  const text = `${v.philosophicalExplanationHindi} ${v.commonMisunderstandingHindi}`;
  if (chapter.safetyTopics) {
    for (const t of chapter.safetyTopics.byVerse[id] ?? []) {
      const needle = chapter.safetyTopics.statements[t];
      if (needle && !text.includes(needle)) problems.push(`${id}: ${t} safety statement missing`);
    }
  } else {
    const needs = [[/अकर्ता|कर्ता/, 'व्यावहारिक स्तर पर हर व्यक्ति', 'non-doership'], [/वैराग्य|असंग/, 'देखभाल, कर्तव्य, संबंध', 'detachment'], [/देह|शरीर/, 'स्वास्थ्य, सुरक्षा, विश्राम', 'body']];
    const topicOf = { '1.6': 0, '1.8': 0, '1.12': 0, '1.2': 1, '1.5': 1, '1.13': 1, '1.3': 2, '1.4': 2, '1.14': 2, '1.17': 2, '1.18': 2, '1.19': 2 };
    if (id in topicOf) { const [, needle, name] = needs[topicOf[id]]; if (!text.includes(needle)) problems.push(`${id}: ${name} safety statement missing`); }
    if (['1.10', '1.16', '1.18'].includes(id) && !text.includes('जगत् की स्वतंत्र और स्थायी सत्ता')) problems.push(`${id}: world-unreality statement missing`);
    if (['1.2', '1.12', '1.17'].includes(id) && !text.includes('निष्क्रिय, भावशून्य')) problems.push(`${id}: desirelessness statement missing`);
  }
});

const first = verses[0]?.verseNumber, last = verses.at(-1)?.verseNumber;
if (verses.length !== chapter.verseRange.count) problems.push(`count ${verses.length} != declared ${chapter.verseRange.count}`);
if (first !== chapter.verseRange.first || last !== chapter.verseRange.last) problems.push(`range ${first}..${last} != declared`);
const flagged = verses.filter((v) => v.verificationStatus === 'review-required').map((v) => v.verseNumber);

// ---- merged JSON ----
const merged = { ...chapter, verses };
fs.writeFileSync(path.join(dir, `chapter-${chapterNo}.json`), JSON.stringify(merged, null, 2) + '\n');

// ---- readable markdown ----
const L = [];
const e = chapter.end, h = chapter.hero;
L.push(`# अष्टावक्र गीता: अध्याय ${chapterNo}`, '', `स्रोत स्थिति: ${chapter.sourceStatus}`, '', `> ${chapter.source.rightsNote}`, '');
L.push(`# अध्याय ${chapterNo}: ${chapter.chapterTitleBook}`, '', `**${chapter.chapterTitleEditorialLabel}:** ${chapter.chapterTitleEditorial}`, '');
L.push('## Hero Section', '', `- अध्याय संख्या: ${chapterNo}`, `- अध्याय शीर्षक: ${chapter.chapterTitleBook}`, `- एक पंक्ति में सार: ${h.oneLineSummary}`, `- मुख्य संस्कृत शब्द: ${h.keySanskritTerms.join(', ')}`, `- प्रमुख विषय: ${h.mainTopics.join(', ')}`, `- अनुमानित पठन समय: ${h.estimatedReadingTime}`, `- श्लोकों की कुल संख्या: ${h.totalVerses} (${first} से ${last})`, `- बटन: ${h.buttons.start} | ऑडियो: ${h.buttons.audio}`, `- पिछला: ${h.previousChapter} | अगला: ${h.nextChapter}`, '');
L.push('## अध्याय का परिचय', '', chapter.introduction, '', '## केंद्रीय प्रश्न', '', chapter.centralQuestion, '', '## अध्याय की मुख्य शिक्षा', '', chapter.mainTeaching, '', '## प्रमुख अवधारणाएँ', '');
chapter.concepts.forEach((c) => L.push(`- **${c.term}:** ${c.definition}`));
L.push('', '## पढ़ने से पहले समझें', '');
chapter.beforeYouRead.forEach((b) => L.push(`- ${b}`));
L.push('', '## श्लोक-दर-श्लोक व्याख्या', '');
for (const v of verses) {
  const wm = v.wordMeanings.map((w) => `- ${w.sanskrit}:\n  ${w.hindi}`).join('\n\n');
  const rel = v.relatedVerses.map((r) => `- श्लोक ${r.id}: ${r.reason}`).join('\n');
  L.push(`# श्लोक ${v.verseNumber}`, '', `वक्ता: ${v.speaker}`, '', '## मूल संस्कृत', '', v.sanskrit.split('\n').map((x) => `> ${x}`).join('  \n'), '', '## IAST लिप्यंतरण', '', v.iast.split('\n').map((x) => `${x}`).join('  \n'), '', '## सरल उच्चारण', '', v.simplePronunciation, '', '## पदच्छेद', '', v.padaccheda, '', '## प्रमुख शब्दार्थ', '', wm, '', '## शाब्दिक हिन्दी अर्थ', '', v.literalHindiMeaning, '', '## पुस्तकानुसार हिन्दी भावार्थ', '', v.bookBasedHindiExplanation, '', '## सरल हिन्दी में समझें', '', v.simpleHindiExplanation, '', '## गहरी दार्शनिक व्याख्या', '', v.philosophicalExplanationHindi, '', '## उदाहरण से समझें', '', v.analogyHindi, '', '## आज की जिंदगी से उदाहरण', '', v.modernExampleHindi, '', '## आज की पीढ़ी के लिए संदेश', '', v.messageForTodayHindi, '', '## सामान्य गलतफहमी', '', v.commonMisunderstandingHindi, '', '## जीवन में प्रयोग', '', v.practicalApplicationHindi, '', '## आत्मचिंतन प्रश्न', '', v.reflectionQuestionHindi, '', '## छोटा अभ्यास', '', v.shortPracticeHindi, '', '## एक पंक्ति में सार', '', v.oneLineSummaryHindi, '', '## English Translation', '', v.englishTranslation, '', '## Simple English Explanation', '', v.simpleEnglishExplanation, '', '## संबंधित विषय', '', v.themes.join(', '), '', '## खोज टैग', '', v.searchTags.join(', '), '', '## संबंधित श्लोक', '', rel, '', `**स्रोत-पृष्ठ:** ${v.sourcePage}  |  **सत्यापन स्थिति:** ${v.verificationStatus}`, '', `**संपादकीय टिप्पणी:** ${v.editorialNotes}`, '', '---', '');
}
L.push('# अध्याय का सरल सार', '', e.simpleSummary, '', '# अध्याय की दार्शनिक यात्रा', '', e.philosophicalJourney, '', '# पाँच प्रमुख शिक्षाएँ', '');
e.fiveTeachings.forEach((t, i) => L.push(`${i + 1}. ${t.teaching} (श्लोक ${t.verses.join(', ')})`));
L.push('', '# प्रमुख संस्कृत शब्द', '');
e.keyTerms.forEach((k) => L.push(`- ${k.term} (glossary: ${k.glossary})`));
L.push('', `_${e.glossaryNote}_`, '', '# आधुनिक जीवन में उपयोग', '');
Object.entries(e.modernLife).forEach(([k, v]) => L.push(`- **${k}:** ${v}`));
L.push('', '# सामान्य गलतफहमियाँ', '');
e.misunderstandings.forEach((m) => L.push(`- ${m}`));
L.push('', '# तीन आत्मचिंतन प्रश्न', '');
e.reflectionQuestions.forEach((q, i) => L.push(`${i + 1}. ${q}`));
L.push('', '# संक्षिप्त चिंतन अभ्यास', '', e.fiveMinutePractice, '', '# अध्याय संबंध', '', `- पिछला प्रकरण: ${e.chapterRelation.previous}`, `- अगला प्रकरण: ${e.chapterRelation.next}`, '', '# Frequently Asked Questions', '');
e.faqs.forEach((f) => L.push(`**${f.q}**`, '', f.a, ''));
L.push('# SEO सामग्री', '', `- SEO title: ${e.seo.title}`, `- Meta description: ${e.seo.metaDescription}`, `- URL slug: ${e.seo.slug}`, `- Primary keyword: ${e.seo.primaryKeyword}`, `- Secondary keywords: ${e.seo.secondaryKeywords.join('; ')}`, `- Social title: ${e.seo.socialTitle}`, `- Social description: ${e.seo.socialDescription}`, `- Structured data (सुझाव): ${e.seo.structuredDataSuggestion}`, '', '# Navigation', '');
Object.entries(e.navigation).forEach(([k, v]) => L.push(`- ${k}: ${v}`));
fs.mkdirSync('docs/ashtavakra', { recursive: true });
fs.writeFileSync(`docs/ashtavakra/chapter-${chapterNo}.md`, L.join('\n') + '\n');

console.log(`verses: ${verses.length} (${first}..${last}); flagged review-required: ${flagged.join(', ') || 'none'}`);
if (problems.length) { console.log('PROBLEMS:'); problems.forEach((p) => console.log(' - ' + p)); process.exit(1); }
console.log('All checks passed.');
