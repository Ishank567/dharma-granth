async function testLines(name, url, abbrev, sampleLine) {
  const res = await fetch(url);
  const text = await res.text();
  const body = text.slice(text.indexOf('# Text') + 6);
  const lines = body.split(/\r?\n/);
  
  // Find first 5 lines with abbrev
  const matches = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`${abbrev}_`)) {
      matches.push({ idx: i, line: lines[i].trimEnd() });
      if (matches.length >= 5) break;
    }
  }
  
  // Test the marker detection
  function lineEndsWithVerseMarker(line) {
    const idx = line.lastIndexOf(`${abbrev}_`);
    if (idx < 0) return false;
    const after = line.slice(idx + abbrev.length + 1);
    return /^[0-9,.\\*@:]+(?:cd\/|ab\/|\/)?\s*$/.test(after);
  }
  
  console.log(`\n=== ${name} (abbrev: ${abbrev}) ===`);
  console.log('Sample lines containing abbrev:');
  for (const m of matches) {
    const end = m.line.slice(-40);
    const hasMarker = lineEndsWithVerseMarker(m.line);
    console.log(`  ${hasMarker ? 'OK' : 'XX'} | ${end}`);
  }
  
  // Count total lines that should match
  let totalMatch = 0;
  for (const line of lines) {
    if (lineEndsWithVerseMarker(line)) totalMatch++;
  }
  console.log(`Total matching lines: ${totalMatch}`);
}

async function main() {
  await testLines('brahmand', 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_brahmANDapurANa.txt', 'bndp');
  await testLines('kurma', 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_kUrmapurANa.txt', 'kūrmp');
  await testLines('agni', 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_agnipurANa.txt', 'ap');
  await testLines('garuda', 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_garuDapurANa.txt', 'garp');
  await testLines('vayu', 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_revAkhANDa-of-the-vAyupurANa-rkv.txt', 'rkv');
}
main();
