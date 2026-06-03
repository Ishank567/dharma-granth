const tests = [
  '1,1.1 //',
  '1,1.1//',
  '1.1 //',
  '1.002cd/',
  '1,mang.1 //',
];

const regex = /^[0-9,.\\*@:]+(?:(?:cd|ab)?\/?\/?)?\s*$/;

for (const t of tests) {
  console.log(`'${t}' => ${regex.test(t)}`);
}

// Also test with the actual bndp line
const line = 'namo rajastamaḥsattvatrirūpāya svayaṃbhuve // bndp_1,1.1 //';
const abbrev = 'bndp';
const idx = line.lastIndexOf(`${abbrev}_`);
const after = line.slice(idx + abbrev.length + 1);
console.log(`\nFull line: ${line}`);
console.log(`After abbrev: '${after}'`);
console.log(`Regex test: ${regex.test(after)}`);

// Test kurma
const line2 = 'tato jayamudīrayet // kūrmp_1,mang.1 //';
const abbrev2 = 'kūrmp';
const idx2 = line2.lastIndexOf(`${abbrev2}_`);
const after2 = line2.slice(idx2 + abbrev2.length + 1);
console.log(`\nFull line: ${line2}`);
console.log(`After abbrev: '${after2}'`);
console.log(`Regex test: ${regex.test(after2)}`);

// Test garuda
const line3 = 'yaṃ sarvagaṃ vanda ekam // garp_1,1.1 //';
const abbrev3 = 'garp';
const idx3 = line3.lastIndexOf(`${abbrev3}_`);
const after3 = line3.slice(idx3 + abbrev3.length + 1);
console.log(`\nFull line: ${line3}`);
console.log(`After abbrev: '${after3}'`);
console.log(`Regex test: ${regex.test(after3)}`);
