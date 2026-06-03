async function main() {
  const res = await fetch('https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_brahmANDapurANa.txt');
  const text = await res.text();
  
  const textMarker = "# Text";
  const textStart = text.indexOf(textMarker);
  const body = textStart >= 0 ? text.slice(textStart + textMarker.length) : text;
  const lines = body.split(/\r?\n/);
  
  const abbrev = 'bndp';
  const verseMarkerRegex = new RegExp(`(?:(?:^|[^/])//\\s*)?${abbrev}_[0-9,\\.\\*@:]+(?:cd/|ab/|/)?\\s*$`);
  
  let matchCount = 0;
  let firstMatches = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (verseMarkerRegex.test(line)) {
      matchCount++;
      if (firstMatches.length < 10) {
        firstMatches.push({ idx: i, line: line.slice(-50) });
      }
    }
  }
  
  console.log(`Total matching lines: ${matchCount}`);
  console.log('First 10 matches:');
  for (const m of firstMatches) {
    console.log(`  ${m.idx}: ${m.line}`);
  }
  
  // Also test line 65 from our earlier inspection
  const testLine = 'namo rajastamaḥsattvatrirūpāya svayaṃbhuve // bndp_1,1.1 //';
  console.log('\nTest line:', testLine);
  console.log('Matches:', verseMarkerRegex.test(testLine));
  console.log('Replace result:', testLine.replace(verseMarkerRegex, '').trimEnd());
}
main();
