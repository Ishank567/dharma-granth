const Sanscript = require('@indic-transliteration/sanscript');

function itxToDevanagari(itx) {
  return (
    Sanscript.t(itx, "itrans", "devanagari")
      .replace(/\s*\n\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

function normalizeItxLine(itx) {
  return itx.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}

function cleanItx(raw) {
  let body = raw;
  const beginIdx = body.indexOf("\\begin{document}");
  if (beginIdx >= 0) {
    body = body.slice(beginIdx + "\\begin{document}".length);
  }
  const endIdx = body.indexOf("\\end{document}");
  if (endIdx >= 0) {
    body = body.slice(0, endIdx);
  }
  
  body = body.replace(/\\(section|centerline|chapter|engtitle|itxtitle|title)\{(.*?)\}/g, '$2');
  
  return body
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trimStart();
      if (trimmed.startsWith("%")) return false;
      if (trimmed.startsWith("\\")) return false;
      if (trimmed.startsWith("#")) return false;
      return true;
    })
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function cleanVerseId(raw) {
  return raw.replace(/\\(?!,)/g, "").replace(/,/g, ".").replace(/\s+/g, "").trim();
}

async function testTaittiriya() {
  console.log('\nTesting Taittiriya Upanishad Custom Parser with lowercase cleanup...');
  const res = await fetch('https://sanskritdocuments.org/doc_upanishhat/taitaccent.itx');
  const raw = await res.text();
  const body = cleanItx(raw);
  
  const valliNames = ["Shikshā Valli", "Brahmananda Valli", "Bhrigu Valli"];
  const valliSanskrit = ["शिक्षावल्ली", "ब्रह्मानन्दवल्ली", "भृगुवल्ली"];
  
  const rawVallis = [];
  let remaining = body;
  
  const split1 = remaining.split(/iti\s+shIkShAvallI\s+samAptA/gi);
  if (split1.length > 1) {
    rawVallis.push(split1[0]);
    remaining = split1[1];
    
    const split2 = remaining.split(/iti\s+brahmAnandavallI\s+samAptA/gi);
    if (split2.length > 1) {
      rawVallis.push(split2[0]);
      rawVallis.push(split2[1]);
    } else {
      rawVallis.push(remaining);
    }
  } else {
    rawVallis.push(body);
  }
  
  const chapters = [];
  let totalVerses = 0;
  
  for (let i = 0; i < rawVallis.length; i++) {
    const valliBody = rawVallis[i].trim();
    const verses = [];
    const verseRegex = /(?:\.\.|\|\|)\s*([\d\\.,\s]+?)\s*(?:\.\.|\|\|)/g;
    let lastIdx = 0;
    let m;
    verseRegex.lastIndex = 0;
    while ((m = verseRegex.exec(valliBody)) !== null) {
      const idStr = cleanVerseId(m[1]);
      const asNum = Number(idStr);
      const id = Number.isInteger(asNum) && !idStr.includes(".") ? asNum : idStr;
      const text = valliBody.slice(lastIdx, m.index).trim();
      
      if (text.length > 0) {
        const cleanText = text
          .split(/\n/)
          .map(line => line.trim())
          .filter(line => {
            const l = line.toLowerCase();
            return !l.startsWith("iti") && 
                   !l.includes("anuvaka") && 
                   !l.includes("..") && 
                   !l.includes("##") && 
                   !l.includes("titles") && 
                   !l.includes("valli") && 
                   !l.includes("taittiriya");
          })
          .join(" ");
        
        if (cleanText.length > 3) {
          verses.push({
            number: verses.length + 1,
            sanskrit: itxToDevanagari(cleanText),
            transliteration: normalizeItxLine(cleanText)
          });
        }
      }
      lastIdx = m.index + m[0].length;
    }
    
    if (verses.length > 0) {
      chapters.push({
        number: chapters.length + 1,
        title: valliNames[i] ?? `Valli ${i + 1}`,
        titleSanskrit: valliSanskrit[i],
        verses
      });
      totalVerses += verses.length;
    }
  }
  
  console.log(`  Split result: found ${chapters.length} chapters`);
  console.log(`  Total verses: ${totalVerses}`);
  chapters.forEach(c => {
    console.log(`    Chapter ${c.number}: ${c.title} — ${c.verses.length} verses`);
  });
  
  if (chapters.length > 0 && chapters[0].verses.length > 0) {
    console.log(`  First verse in Shikshā Valli:`, chapters[0].verses[0]);
  }
}

async function main() {
  await testTaittiriya();
}

main();
