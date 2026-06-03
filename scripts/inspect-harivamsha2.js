async function main() {
  const res = await fetch('https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_harivamsha.txt');
  const text = await res.text();
  console.log('File size:', text.length);
  console.log('Has # Text:', text.includes('# Text'));
  
  const idx = text.indexOf('# Text');
  const body = idx >= 0 ? text.slice(idx + 6) : text;
  const lines = body.split(/\r?\n/);
  console.log('Lines after marker:', lines.length);
  
  // Find any line with underscore and digits
  for (let i = 0; i < Math.min(100, lines.length); i++) {
    if (lines[i].includes('_') && /\d/.test(lines[i])) {
      console.log('First match at line', i, ':', lines[i].trimEnd().slice(-40));
      break;
    }
  }
  
  // Show first 10 lines of body
  console.log('\nFirst 10 lines:');
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    console.log(i + ':', lines[i]);
  }
}
main();
