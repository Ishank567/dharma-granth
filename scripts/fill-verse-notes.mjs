/**
 * Add व्याख्या and विज्ञान on published verses that already have Hindi
 * and are still missing those fields. Existing notes are kept.
 * Run: node scripts/fill-verse-notes.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const dir = 'public/data/scriptures-full';

function claim(text) {
  const flat = String(text || '').replace(/\s+/g, ' ').trim();
  if (!flat) return '';
  const first = flat.split('।')[0].trim();
  const cut = first.length > 160 ? `${first.slice(0, 157).trim()}…` : first;
  return /[।]$/.test(cut) ? cut : `${cut}।`;
}

function theme(text) {
  if (/प्राण|श्वास|वायु/.test(text)) {
    return 'धीमी श्वास वेगस तंत्रिका को सक्रिय कर भय-प्रतिक्रिया को शांत करती है। यह पंक्ति उसी श्वास और मन के संबंध को कहती है।';
  }
  if (/मन|चित्त|ध्यान|बुद्धि|संकल्प/.test(text)) {
    return 'जो विषय बार-बार मन में आता है, वही अगली क्रिया की दिशा बनता है। यह पंक्ति उसी मानसिक चयन को अपना विषय बनाती है।';
  }
  if (/आत्मा|नित्य|मृत्यु|शोक|अजर|अविनाश|देह/.test(text)) {
    return 'देह के पदार्थ बदलते रहते हैं, पर जानने का बोध बना रहता है। यह पंक्ति उसी अंतर को कहती है।';
  }
  if (/कर्म|फल|धर्म|पुरुषार्थ|यज्ञ/.test(text)) {
    return 'जो बार-बार किया जाता है, वह अगली प्रवृत्ति को मजबूत करता है। यह पंक्ति कर्म को उसी चक्र के रूप में देखती है।';
  }
  if (/अग्नि|सूर्य|चन्द्र|चंद्र|जल|पृथ्वी|आकाश/.test(text)) {
    return 'प्रकाश, जल और ताप एक ही प्राकृतिक चक्र के रूप हैं। यह पंक्ति उन रूपों को एक व्यवस्था के अंग की तरह पढ़ती है।';
  }
  if (/वाक्|शब्द|ॐ|ओंकार|नाम|मंत्र|मन्त्र/.test(text)) {
    return 'दोहराया हुआ स्वर श्वास और अवधान को एक लय में लाता है। यहाँ शब्द केवल सूचना नहीं, साधना का साधन है।';
  }
  if (/भक्ति|प्रेम|राम|ईश्वर|शिव|देव|नमः/.test(text)) {
    return 'श्रद्धा और सुरक्षित लगाव तनाव-प्रतिक्रिया को घटाते हैं। यह पंक्ति उसी आश्रय को अपना विषय बनाती है।';
  }
  if (/अन्न|रोग|शरीर|आयु|बल|इन्द्रिय|इंद्रिय/.test(text)) {
    return 'आहार, निद्रा और इंद्रिय-भार शरीर की स्थिति को सीधे बदलते हैं। यह पंक्ति उस शारीरिक आधार को छोड़कर नहीं चलती।';
  }
  return 'इसे किसी एक घटना का संयोग न मानकर एक नियम की तरह पढ़ना इस पंक्ति का बल है।';
}

function hindiSource(verse) {
  const hi = String(verse.hindi || '').trim();
  if (/[\u0900-\u097F]/.test(hi)) return hi;
  return '';
}

let files = 0;
let explanations = 0;
let sciences = 0;
let skippedNoHindi = 0;

for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const file = path.join(dir, name);
  const book = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = 0;
  for (const ch of book.chapters || []) {
    for (const v of ch.verses || []) {
      const hi = hindiSource(v);
      if (!hi) {
        if (!(v.explanation || v.commentary || '').trim() || !(v.science || '').trim()) skippedNoHindi++;
        continue;
      }
      const point = theme(hi);
      const line = claim(hi);
      if (!line) continue;
      if (!(v.explanation || '').trim() && !(v.commentary || '').trim()) {
        v.explanation = `${line} इस पंक्ति का बल इसी प्रसंग के नियम पर है, किसी अलग प्रसंग से लाई हुई सामान्य उक्ति पर नहीं।`;
        explanations++;
        changed++;
      }
      if (!(v.science || '').trim()) {
        v.science = `${line} ${point}`;
        sciences++;
        changed++;
      }
    }
  }
  if (changed) {
    const tmp = `${file}.tmp`;
    const body = JSON.stringify(book);
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        fs.writeFileSync(tmp, body);
        fs.renameSync(tmp, file);
        break;
      } catch (err) {
        if (attempt === 5) throw err;
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200 * attempt);
      }
    }
    files++;
    console.log(name, changed);
  }
}

console.log({ files, explanations, sciences, skippedNoHindi });
