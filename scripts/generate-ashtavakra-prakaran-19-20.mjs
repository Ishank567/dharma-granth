import fs from 'node:fs';

function exportPrakaran(prakaranNo, title, defaultSpeaker) {
  const jsonFile = `data/ashtavakra/chapter-${prakaranNo}.json`;
  if (!fs.existsSync(jsonFile)) {
    throw new Error(`File not found: ${jsonFile}`);
  }
  const raw = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

  const exportedVerses = [];
  const mdLines = [];

  mdLines.push(`# अष्टावक्र गीता — ${title}`);
  mdLines.push(`**टीकाकार:** रायबहादुर बाबू जालिमसिंह`);
  mdLines.push(`**वक्ता:** ${defaultSpeaker}`);
  mdLines.push(`**श्लोक संख्या:** १ से ${raw.verses.length}`);
  mdLines.push(`\n---\n`);

  for (let i = 0; i < raw.verses.length; i++) {
    const v = raw.verses[i];
    const vNum = i + 1;
    let speaker = defaultSpeaker;
    if (v.speaker) {
      if (v.speaker.includes('जनक')) speaker = 'जनक उवाच';
      else if (v.speaker.includes('अष्टावक्र')) speaker = 'अष्टावक्र उवाच';
    }

    const padList = (typeof v.padaccheda === 'string' ? v.padaccheda.split(/,\s*/) : v.padaccheda)
      .map(s => s.replace(/^[।॥\s]+|[।॥\s]+$/g, '').trim())
      .filter(Boolean);

    const sabdartha = (v.wordMeanings || []).map(w => ({
      sanskrit: w.sanskrit.trim(),
      hindi: w.hindi.trim()
    }));

    const bhavartha = (v.bookBasedHindiExplanation || v.literalHindiMeaning || '').trim();

    const citations = [];
    if (v.relatedVerses && v.relatedVerses.length) {
      for (const r of v.relatedVerses) {
        citations.push({
          source: `अष्टावक्र गीता (श्लोक ${r.id})`,
          text: r.reason
        });
      }
    }

    const verseObj = {
      text_title: "Ashtavakra Gita",
      commentator: "रायबहादुर बाबू जालिमसिंह",
      prakaran_number: prakaranNo,
      prakaran_title: title,
      verse_number: vNum,
      speaker: speaker,
      mula_sloka: v.sanskrit,
      padachheda: padList,
      anvaya_sabdartha: sabdartha,
      bhavartha: bhavartha,
      citations: citations
    };

    exportedVerses.push(verseObj);

    // Markdown (Format A)
    mdLines.push(`## श्लोक ${vNum}\n`);
    mdLines.push(`**वक्ता:** ${speaker} ।\n`);
    mdLines.push(`**मूलम् ।**`);
    mdLines.push(v.sanskrit.split('\n').map(l => `> ${l}`).join('  \n'));
    mdLines.push(`\n**पदच्छेदः ।**\n${padList.join(', ')} ।\n`);
    mdLines.push(`**अन्वयः एवं शब्दार्थः ।**`);
    mdLines.push(`| संस्कृत पद | हिन्दी अर्थ |`);
    mdLines.push(`| :--- | :--- |`);
    for (const item of sabdartha) {
      mdLines.push(`| **${item.sanskrit}** | ${item.hindi} |`);
    }
    mdLines.push(`\n**भावार्थः एवं टीका (रायबहादुर बाबू जालिमसिंह) ।**\n${bhavartha}\n`);
    if (citations.length > 0) {
      mdLines.push(`**उद्धरण एवं संदर्भ ।**`);
      for (const c of citations) {
        mdLines.push(`- *${c.source}:* "${c.text}"`);
      }
    }
    mdLines.push(`\n---\n`);
  }

  // Write outputs
  const jsonStr = JSON.stringify(exportedVerses, null, 2);
  fs.writeFileSync(`data/ashtavakra/ashtavakra_prakaran_${prakaranNo}.json`, jsonStr, 'utf8');
  const mdStr = mdLines.join('\n');
  fs.writeFileSync(`docs/ashtavakra/ashtavakra_prakaran_${prakaranNo}.md`, mdStr, 'utf8');
  fs.writeFileSync(`docs/ashtavakra/ashtavakra_prakaran_${prakaranNo}.txt`, mdStr, 'utf8');

  console.log(`Generated Prakaran ${prakaranNo}: ${exportedVerses.length} verses (JSON: ${jsonStr.length} bytes, MD: ${mdStr.length} bytes).`);
}

exportPrakaran(19, 'उन्नीसवाँ प्रकरण (धारणाओं से परे)', 'जनक उवाच');
exportPrakaran(20, 'बीसवाँ प्रकरण (अंतिम मौन)', 'अष्टावक्र उवाच');
