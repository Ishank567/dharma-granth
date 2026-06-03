async function main() {
  const res = await fetch('https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext/sa_viSNupurANa-crit.txt');
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < 80; i++) {
    console.log(`${String(i+1).padStart(3)}: ${lines[i]}`);
  }
}
main();
