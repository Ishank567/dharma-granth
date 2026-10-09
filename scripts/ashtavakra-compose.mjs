// Composes data/ashtavakra/chN-src-*.mjs (compact hand-written verse content) into the full
// schema JSON (chN-verses-all.json) and records which safety statements each verse needs
// (chN-chapter.json -> safetyTopics) for scripts/ashtavakra-build.mjs to verify.
// Usage: node scripts/ashtavakra-compose.mjs 2
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const N = process.argv[2] ?? '2';
const dir = 'data/ashtavakra';

export const STATEMENTS = {
  doer: 'सर्वोच्च चिंतन-स्तर पर आत्मा को अकर्ता कहा गया है; व्यावहारिक स्तर पर हर व्यक्ति अपने निर्णयों, आचरण और उनके परिणामों के लिए उत्तरदायी रहता है।',
  detach: 'वैराग्य का अर्थ मानसिक निर्भरता और बाध्यकारी लगाव से मुक्ति है; इसका अर्थ देखभाल, कर्तव्य, संबंध या नैतिक उत्तरदायित्व छोड़ देना नहीं है।',
  body: 'आत्मा के शरीर तक सीमित न होने की पहचान का अर्थ स्वास्थ्य, सुरक्षा, विश्राम या आवश्यक उपचार की उपेक्षा को उचित ठहराना नहीं है।',
  world: 'यह शिक्षा जगत् की स्वतंत्र और स्थायी सत्ता पर प्रश्न उठाती है; यह व्यावहारिक अनुभव को नकारती नहीं, और दुख की उपेक्षा करने की अनुमति नहीं देती।',
  desire: 'तृष्णा से मुक्ति का अर्थ निष्क्रिय, भावशून्य या सार्थक कार्यों के प्रति उदासीन हो जाना नहीं है।',
  care: 'यदि जीवन से निराशा या स्वयं को हानि पहुँचाने के विचार आएँ, तो इस ग्रंथ को उसका उत्तर न मानें; किसी विश्वसनीय व्यक्ति, चिकित्सक या अपने क्षेत्र की सहायता-सेवा से तुरंत संपर्क करें।',
  ethics: 'ज्ञानी के लिए विधि-निषेध का अधिकार न होने की बात पुस्तक की दार्शनिक दृष्टि है; यह किसी को नैतिक, कानूनी या सामाजिक ज़िम्मेदारियों की अनदेखी की अनुमति नहीं देती।',
};
// Short needles the build script looks for in the combined philosophical + misunderstanding text.
export const NEEDLES = {
  doer: 'व्यावहारिक स्तर पर हर व्यक्ति', detach: 'देखभाल, कर्तव्य, संबंध', body: 'स्वास्थ्य, सुरक्षा, विश्राम',
  world: 'जगत् की स्वतंत्र और स्थायी सत्ता', desire: 'निष्क्रिय, भावशून्य', care: 'सहायता-सेवा', ethics: 'नैतिक, कानूनी',
};

const MAP = [['ā', 'aa'], ['ī', 'ee'], ['ū', 'oo'], ['ṝ', 'ri'], ['ṛ', 'ri'], ['ḷ', 'li'], ['ṅ', 'ng'], ['ñ', 'ny'], ['ṭ', 't'], ['ḍ', 'd'], ['ṇ', 'n'], ['ś', 'sh'], ['ṣ', 'sh'], ['ṃ', 'm'], ['ḥ', 'h'], ['c', 'ch']];
const pronounce = (iast) => {
  let s = iast.replace(/ch/g, 'chh').replace(/\|\|/g, '').replace(/\|/g, '').replace(/\s+\d+\s*$/gm, '');
  s = s.replace(/c(?!h)/g, 'ch');
  for (const [a, b] of MAP) if (a !== 'c') s = s.split(a).join(b);
  return s.replace(/['’]/g, '').replace(/[ \t]+/g, ' ').trim();
};

const files = fs.readdirSync(dir).filter((f) => f.startsWith(`ch${N}-src-`)).sort();
let rows = [];
for (const f of files) rows = rows.concat((await import(pathToFileURL(path.resolve(dir, f)).href)).default);
rows.sort((a, b) => a.id - b.id);

const chapter = JSON.parse(fs.readFileSync(path.join(dir, `ch${N}-chapter.json`), 'utf8'));
const title = chapter.chapterTitleBook;
const out = [];
const topicsMap = {};

for (const r of rows) {
  const id = `${N}.${r.id}`;
  const topics = r.topics ?? [];
  let phil = r.phil.map((p, i) => `${i + 1}. ${p}`).join('\n');
  let mis = r.mis;
  const notIn = (s) => !(phil + '\n' + mis).includes(s);
  const extra = [];
  for (const t of topics) if (STATEMENTS[t] && notIn(NEEDLES[t])) extra.push(STATEMENTS[t]);
  if (extra.length) phil += '\n\n' + extra.join('\n');
  topicsMap[id] = topics;
  out.push({
    scripture: 'Ashtavakra Gita', chapterNumber: String(N), chapterTitleHindi: title, chapterTitleEnglish: `Chapter ${N} (${title})`,
    verseNumber: id, speaker: r.speaker ?? 'जनक',
    sanskrit: r.sk, iast: r.iast, simplePronunciation: `${pronounce(r.iast)}  (सरल रोमन उच्चारण-सहायता; शास्त्रीय रूप से सटीक नहीं)`,
    padaccheda: r.pad,
    wordMeanings: r.wm.map(([sanskrit, hindi]) => ({ sanskrit, hindi })),
    literalHindiMeaning: r.lit, bookBasedHindiExplanation: r.book, simpleHindiExplanation: r.simple,
    philosophicalExplanationHindi: phil, analogyHindi: r.analogy, modernExampleHindi: r.modern, messageForTodayHindi: r.msg,
    commonMisunderstandingHindi: mis, practicalApplicationHindi: r.app, reflectionQuestionHindi: r.q, shortPracticeHindi: r.prac,
    oneLineSummaryHindi: r.one, englishTranslation: r.en, simpleEnglishExplanation: r.enx,
    themes: r.themes, searchTags: r.tags, relatedVerses: r.rel.map(([vid, reason]) => ({ id: vid, reason })),
    sourcePage: r.page, verificationStatus: r.status, editorialNotes: r.notes,
  });
}
fs.writeFileSync(path.join(dir, `ch${N}-verses-all.json`), JSON.stringify(out, null, 2) + '\n');
chapter.safetyTopics = { statements: NEEDLES, byVerse: topicsMap };
fs.writeFileSync(path.join(dir, `ch${N}-chapter.json`), JSON.stringify(chapter, null, 2) + '\n');
console.log(`composed ${out.length} verses for chapter ${N}`);
