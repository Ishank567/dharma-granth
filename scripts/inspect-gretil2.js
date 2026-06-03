async function main() {
  const urls = [
    { name: 'agni', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_agnipurANa.txt' },
    { name: 'brahmand', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_brahmANDapurANa.txt' },
    { name: 'kurma', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_kUrmapurANa.txt' },
    { name: 'linga', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_liGgapurANa1-108.txt' },
    { name: 'narada', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_nAradapurANa.txt' },
    { name: 'narasimha', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_narasiMhapurANa.txt' },
    { name: 'vamana', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_vAmanapurANasaromAhAtmya.txt' },
    { name: 'vayu', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_revAkhANDa-of-the-vAyupurANa-rkv.txt' },
    { name: 'brahma', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_brahmapurANa-1-246.txt' },
    { name: 'shiva', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_zivapurANabooks-1-and-7.txt' },
    { name: 'garuda', url: 'https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_garuDapurANa.txt' },
  ];

  for (const item of urls) {
    try {
      const res = await fetch(item.url);
      const text = await res.text();
      const lines = text.split(/\r?\n/);
      
      // Find lines with verse markers
      const markerLines = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('//') && /\d/.test(line)) {
          markerLines.push({ idx: i, line: line.slice(-60) });
          if (markerLines.length >= 5) break;
        }
      }
      
      console.log(`\n=== ${item.name} ===`);
      if (markerLines.length === 0) {
        console.log('  No verse markers found');
        // Show some sample lines from the text section
        const textStart = text.indexOf('# Text');
        if (textStart >= 0) {
          const sample = text.slice(textStart, textStart + 500).split(/\r?\n/).slice(0, 10);
          console.log('  Sample lines:', sample.join('\n  '));
        }
      } else {
        for (const m of markerLines) {
          console.log(`  ${m.idx}: ${m.line}`);
        }
      }
    } catch (e) {
      console.log(`\n=== ${item.name} === ERROR: ${e.message}`);
    }
  }
}
main();
