async function main() {
  const res = await fetch('https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_harivamsha.txt');
  const text = await res.text();
  const body = text.slice(text.indexOf('# Text') + 6);
  const lines = body.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.includes('_') && /\d/.test(line) && line.includes('//')) {
      console.log('Sample: ' + line.slice(-50));
      break;
    }
  }
}
main();
