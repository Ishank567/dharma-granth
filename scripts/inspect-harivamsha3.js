async function main() {
  const res = await fetch('https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_harivaMza.txt');
  const text = await res.text();
  const body = text.slice(text.indexOf('# Text') + 6);
  const lines = body.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('_') && /\d/.test(lines[i]) && lines[i].includes('//')) {
      console.log('Sample: ' + lines[i].trimEnd().slice(-50));
      break;
    }
  }
}
main();
