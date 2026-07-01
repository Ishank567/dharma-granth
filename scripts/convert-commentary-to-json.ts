import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

async function main() {
  const srcDir = path.resolve('data/hi-commentary');
  const outDir = path.resolve('public/data/hi-commentary');
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_'));

  for (const file of files) {
    const name = path.basename(file, '.ts');
    const exportName = `${name}Hi`;
    const modulePath = pathToFileURL(path.resolve(srcDir, file)).toString();
    const mod = await import(modulePath);
    const fragment = mod[exportName];
    if (!fragment) {
      console.warn(`No export ${exportName} in ${file}`);
      continue;
    }
    fs.writeFileSync(
      path.join(outDir, `${name}.json`),
      JSON.stringify(fragment),
    );
    console.log(`Converted ${name} -> public/data/hi-commentary/${name}.json`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
