async function main() {
  const urls = [
    { name: 'agni', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_agnipurANa.txt' },
    { name: 'brahmand', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_brahmANDapurANa.txt' },
  ];

  for (const item of urls) {
    try {
      const res = await fetch(item.url);
      const text = await res.text();
      const lines = text.split(/\r?\n/);
      
      const markerLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('//') && /\d/.test(line)) {
          markerLines.push({ idx: i, line: line.slice(-60) });
          if (markerLines.length >= 5) break;
        }
      }
      
      console.log(`\n=== ${item.name} ===`);
      for (const m of markerLines) {
        console.log(`  ${m.idx}: ${m.line}`);
      }
    } catch (e) {
      console.log(`\n=== ${item.name} === ERROR: ${e.message}`);
    }
  }
}
main();
