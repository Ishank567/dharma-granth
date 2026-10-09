/**
 * Chapter explorer metadata for the 20 prakaranas of the Ashtavakra Gita.
 *
 * What is source and what is editorial:
 *  - The BOOK names chapters only by ordinal ("पहला प्रकरण", "दूसरा प्रकरण", ...).
 *  - `title`, `essence`, `symbol` and the palette are EDITORIAL labels from the
 *    project brief, shown as "संपादकीय विषय-शीर्षक". They guide reading and do not
 *    claim to be the book's own chapter titles.
 *  - Verse counts are given only where a chapter has been counted from the
 *    supplied pages. Never estimate one: leave `verifiedVerseCount` undefined.
 *
 * `quiet` runs from 1 (most visual movement) to 5 (almost still). The experience
 * becomes visually quieter as the reader goes deeper.
 */

export type ChapterStatus = 'published' | 'drafting' | 'planned';

export interface AshtavakraChapterMeta {
  number: number;
  /** Ordinal exactly as the book prints it. */
  bookTitle: string;
  /** Editorial subject title (संपादकीय विषय-शीर्षक). */
  title: string;
  essence: string;
  symbol: string;
  /** Plain-text description of the artwork (alt text and prompts). */
  visualTransition: string;
  /** Three palette colours. */
  palette: [string, string, string];
  paletteNames: string;
  quiet: 1 | 2 | 3 | 4 | 5;
  status: ChapterStatus;
  /** Counted from the supplied pages; undefined until a chapter has been counted. */
  verifiedVerseCount?: number;
}

const ORD = ['पहला', 'दूसरा', 'तीसरा', 'चौथा', 'पाँचवाँ', 'छठा', 'सातवाँ', 'आठवाँ', 'नौवाँ', 'दसवाँ', 'ग्यारहवाँ', 'बारहवाँ', 'तेरहवाँ', 'चौदहवाँ', 'पंद्रहवाँ', 'सोलहवाँ', 'सत्रहवाँ', 'अठारहवाँ', 'उन्नीसवाँ', 'बीसवाँ'];

type Row = Omit<AshtavakraChapterMeta, 'bookTitle' | 'status' | 'verifiedVerseCount'>;

const ROWS: Row[] = [
  { number: 1, title: 'आत्मज्ञान का आह्वान', essence: 'जनक के प्रश्न और साक्षी की पहचान।', symbol: 'धुंध से उभरता साफ़ दर्पण', visualTransition: 'देह, भूमिकाओं, विचारों और पहचान की परतें अलग होकर स्थिर जागरूकता दिखाती हैं।', palette: ['#F7F0DF', '#D7862A', '#17213F'], paletteNames: 'हाथीदाँत, केसरिया, गहरा नील', quiet: 1 },
  { number: 2, title: 'आत्मबोध का आश्चर्य', essence: 'जनक का अनुभव-कथन और अपनी चेतना पर आश्चर्य।', symbol: 'शांत जल में प्रतिबिंबित प्रकाशित क्षितिज', visualTransition: 'सीमित दृश्य-क्षेत्र खुलकर विस्तृत हो जाता है।', palette: ['#B99045', '#8FB4D1', '#F7F0DF'], paletteNames: 'स्वर्णिम, आसमानी, हाथीदाँत', quiet: 1 },
  { number: 3, title: 'अनुभूति की परीक्षा', essence: 'गुरु द्वारा लिए गए परीक्षा-प्रश्न: समझ और आचरण का मेल।', symbol: 'आसक्ति के धागों से घिरा रत्न', visualTransition: 'धागे कसते हैं और फिर बिना टूटे दिखाई देने लगते हैं।', palette: ['#6D2932', '#B99045', '#2B3350'], paletteNames: 'गहरा लाल, पुराना सोना, कोयला-नील', quiet: 2 },
  { number: 4, title: 'आत्मज्ञान की महिमा', essence: 'ज्ञानी की स्वतंत्रता और निर्भयता का वर्णन।', symbol: 'अनेक पारदर्शी रूपों से गुज़रता प्रकाश', visualTransition: 'अलग-अलग रूप एक ही प्रकाश को प्रकट करते हैं।', palette: ['#B99045', '#315C59', '#F7F0DF'], paletteNames: 'पुराना सोना, हरित-नील, हाथीदाँत', quiet: 2 },
  { number: 5, title: 'अहंकार का लय', essence: 'पृथक ‘मैं’ की पहचान का शांत होना।', symbol: 'खुले आकाश में घुलता मिट्टी का पात्र', visualTransition: 'पात्र की सीमा पारदर्शी हो जाती है।', palette: ['#CFA878', '#F4EBD4', '#17213F'], paletteNames: 'बलुआ, क्रीम, गहरा नील', quiet: 2 },
  { number: 6, title: 'ग्रहण और त्याग से परे', essence: 'पकड़ने और ठुकराने की बाध्यता से परे दृष्टि।', symbol: 'चलते बादलों वाला खुला आकाश', visualTransition: 'बादल गुज़रते हैं, आकाश अप्रभावित रहता है।', palette: ['#6C7A8C', '#F7F0DF', '#D7862A'], paletteNames: 'नीला-धूसर, हाथीदाँत, मद्धम केसरिया', quiet: 3 },
  { number: 7, title: 'आत्मा का शांत महासागर', essence: 'लहरें बदलती हैं, महासागर एक रहता है।', symbol: 'छोटी लहरों वाला विशाल महासागर', visualTransition: 'दृश्य लहर के स्तर से विशाल सागर की ओर खुलता है।', palette: ['#1E3A5F', '#315C59', '#C9C3A5'], paletteNames: 'गहरा नीला, हरित-नील, रजत-स्वर्ण', quiet: 3 },
  { number: 8, title: 'बंधन और मुक्ति', essence: 'पहचान की पकड़ और उसका ढीला होना।', symbol: 'ढीली बँधी चमकती गाँठ', visualTransition: 'गाँठ को काटा नहीं जाता; दृष्टिकोण बदलने पर वह समझ आती है।', palette: ['#17213F', '#D9A441', '#F7F0DF'], paletteNames: 'नील, अम्बर, हाथीदाँत', quiet: 3 },
  { number: 9, title: 'निर्वेद और विरक्ति', essence: 'बार-बार की खोज से उपजी परिपक्व विरक्ति।', symbol: 'अनंत वृत्ताकार पथ से मिटते पदचिह्न', visualTransition: 'वृत्त खुलकर एक शांत सीधे क्षितिज में बदलता है।', palette: ['#7A5C3E', '#B7B2A4', '#E3CE96'], paletteNames: 'मिट्टी-भूरा, धुंध-धूसर, हल्का सोना', quiet: 3 },
  { number: 10, title: 'तृष्णा से स्वतंत्रता', essence: 'चाह की जकड़ ढीली होने की समझ।', symbol: 'चमकती रेत छोड़ते खुले हाथ', visualTransition: 'रेत तारों जैसी रोशनी बन जाती है, पकड़ी नहीं जाती।', palette: ['#B87333', '#0D1428', '#F7F0DF'], paletteNames: 'ताम्र, अर्धरात्रि-नील, हाथीदाँत', quiet: 4 },
  { number: 11, title: 'शुद्ध चेतना', essence: 'बदलते अनुभवों के बीच स्थिर प्रकाश।', symbol: 'बदलते रूपों को प्रकाशित करता स्थिर दीप', visualTransition: 'वस्तुएँ बदलती हैं, रोशनी वही रहती है।', palette: ['#17213F', '#E3B23C', '#F4EBD4'], paletteNames: 'गहरा नील, ज्योति-सुनहरा, क्रीम', quiet: 4 },
  { number: 12, title: 'सहज आत्मस्थिति', essence: 'अनावश्यक प्रयास छूटने पर सहज स्थिति।', symbol: 'शांत जल के पास रखा पत्थर', visualTransition: 'तरंगें धीरे-धीरे थम जाती हैं।', palette: ['#8A8D8F', '#4F8A86', '#F7F0DF'], paletteNames: 'पत्थर-धूसर, मद्धम हरित-नील, हाथीदाँत', quiet: 4 },
  { number: 13, title: 'सहज सुख', essence: 'बिना पाने की दौड़ के सरल संतोष।', symbol: 'दिन के उजाले में खिला कमल', visualTransition: 'कमल बिना ज़ोर के धीरे खिलता है।', palette: ['#B96873', '#F4EBD4', '#D8B96A'], paletteNames: 'कमल-गुलाबी, क्रीम, हल्का सोना', quiet: 4 },
  { number: 14, title: 'संस्कारों से स्वतंत्रता', essence: 'आदतों और संस्कारों की पकड़ का ढीला होना।', symbol: 'पारदर्शी होती परतदार आकृतियाँ', visualTransition: 'दोहराए जाने वाले पैटर्न ढीले होकर खुला स्थान दिखाते हैं।', palette: ['#4B3F7A', '#C98C9A', '#F7F0DF'], paletteNames: 'बैंगनी-नील, धूसर गुलाबी, हाथीदाँत', quiet: 4 },
  { number: 15, title: 'मुक्त पुरुष की अवस्था', essence: 'मुक्त व्यक्ति का वर्णन, बिना श्रेष्ठता के दावे के।', symbol: 'प्रकाश से बनी पारदर्शी आकृति-रूपी जगह (बिना चित्र के)', visualTransition: 'बाहरी लेबल धीरे-धीरे दूर बहते हैं, जागरूकता बनी रहती है।', palette: ['#FBF6E8', '#17213F', '#D7862A'], paletteNames: 'श्वेत-स्वर्ण, नील, मद्धम केसरिया', quiet: 4 },
  { number: 16, title: 'ज्ञान-संग्रह से परे', essence: 'सूचना जोड़ते जाने की सीमा; अध्ययन का मूल्य बना रहता है।', symbol: 'पांडुलिपियाँ जो खाली, प्रकाशमान जगह में खुलती हैं', visualTransition: 'लिखे पन्ने शांत प्रकाश-बिंदु बन जाते हैं।', palette: ['#EFE3C2', '#1F3A5F', '#B99045'], paletteNames: 'पांडुलिपि-पीला, स्याही-नीला, पुराना सोना', quiet: 5 },
  { number: 17, title: 'मुक्त आचरण', essence: 'सहज आचरण, दिखावे से मुक्त।', symbol: 'पत्थरों के बीच सहज बहती नदी', visualTransition: 'नदी बिना बल या प्रतिरोध के बहती है।', palette: ['#315C59', '#8A8D8F', '#B99045'], paletteNames: 'हरित-नील, पत्थर-धूसर, सोना', quiet: 5 },
  { number: 18, title: 'ज्ञानी की शांति', essence: 'कर्म के बीच भी स्थिर केंद्र।', symbol: 'स्थिर केंद्र वाला विस्तृत परिदृश्य', visualTransition: 'कई गतिविधियाँ एक स्थिर केंद्र के आसपास चलती हैं।', palette: ['#0D1428', '#F7F0DF', '#315C59'], paletteNames: 'अर्धरात्रि-नील, हाथीदाँत, हरित-नील', quiet: 5 },
  { number: 19, title: 'धारणाओं से परे', essence: 'श्रेणियों और आत्म-मापन से परे; व्यवहार में शब्द उपयोगी रहते हैं।', symbol: 'खुले प्रकाश में घुलती ज्यामितीय सीमाएँ', visualTransition: 'नाम क्षण भर दिखते हैं और घुल जाते हैं।', palette: ['#8E86C9', '#F4F1EA', '#1F2A55'], paletteNames: 'हल्का बैंगनी, मोती-श्वेत, गहरा नीला', quiet: 5 },
  { number: 20, title: 'अंतिम मौन', essence: 'संवाद का समापन; संकल्पनाओं से परे मौन।', symbol: 'जहाँ आकाश, प्रकाश और जल एक हो जाते हैं', visualTransition: 'सारी सजावट धीरे-धीरे न्यूनतम हो जाती है।', palette: ['#F7F0DF', '#E3CE96', '#3F6EA8'], paletteNames: 'दीप्त हाथीदाँत, हल्का सोना, अनंत नीला', quiet: 5 },
];

/** Chapters whose content is complete and published on the site. */
const PUBLISHED = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
/** Chapters read and counted from the pages but not yet composed for publishing. */
const DRAFTING = new Set<number>([]);
/** Counts taken from the supplied pages (closing lines checked). */
const COUNTS: Record<number, number> = { 1: 20, 2: 25, 3: 14, 4: 6, 5: 4, 6: 4, 7: 5, 8: 4, 9: 8, 10: 8, 11: 8, 12: 8, 13: 7, 14: 4, 15: 20, 16: 11, 17: 20, 18: 100 };

export const CHAPTERS: AshtavakraChapterMeta[] = ROWS.map((r) => ({
  ...r,
  bookTitle: `${ORD[r.number - 1]} प्रकरण`,
  status: PUBLISHED.has(r.number) ? 'published' : DRAFTING.has(r.number) ? 'drafting' : 'planned',
  verifiedVerseCount: COUNTS[r.number],
}));

export const STATUS_LABEL: Record<ChapterStatus, string> = {
  published: 'उपलब्ध',
  drafting: 'तैयारी में',
  planned: 'अभी तैयार नहीं',
};

export const getChapterMeta = (n: number) => CHAPTERS.find((c) => c.number === n);
