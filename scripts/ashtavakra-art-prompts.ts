// Writes docs/ashtavakra/art-prompts.md: one image prompt per chapter, built from
// data/ashtavakra/chapters-meta.ts so the artwork brief cannot drift from the site data.
// Usage: npx tsx scripts/ashtavakra-art-prompts.ts
import fs from 'node:fs';
import { CHAPTERS } from '../data/ashtavakra/chapters-meta';

const out: string[] = [
  '# Ashtavakra Gita: chapter artwork prompts',
  '',
  'One prompt per chapter, generated from `data/ashtavakra/chapters-meta.ts`. Chapter titles and symbols are editorial.',
  'Artwork must contain no text, letters, numbers, logos, watermarks, random Sanskrit or photographic portraits. Any wording is real page text, never part of the image.',
  'Compositions are wide, centred and mobile-safe. Later chapters are visually quieter by design.',
  '',
];
for (const c of CHAPTERS) {
  out.push(
    `## Chapter ${c.number}: ${c.title} (quietness ${c.quiet} of 5)`,
    '',
    '```',
    `Create a premium symbolic spiritual illustration for Chapter ${c.number} of the Ashtavakra Gita.`,
    '',
    'Central concept:',
    c.essence,
    '',
    'Primary symbol:',
    c.symbol,
    '',
    'Visual transformation:',
    c.visualTransition,
    '',
    'Style:',
    'Elegant Indian philosophical visual language, refined manuscript texture, subtle sacred geometry, softly cinematic lighting, layered atmospheric depth, contemplative minimalism, timeless composition.',
    c.quiet >= 4 ? 'Keep the composition very still and spacious, with minimal geometry and almost no motion cues.' : 'A little visible movement is welcome (waves, thought lines), but never crowded.',
    '',
    'Palette:',
    `${c.paletteNames} (${c.palette.join(', ')})`,
    '',
    'Composition:',
    'Wide responsive website hero composition. Keep the primary symbol visually centred. Fill the entire frame with meaningful visual detail. No empty or unfinished space. Maintain mobile-safe central composition.',
    '',
    'Do not include text, letters, numbers, logos, watermarks, random Sanskrit, crowded ornament, exaggerated supernatural effects, or photorealistic portraits.',
    '```',
    '',
  );
}
fs.writeFileSync('docs/ashtavakra/art-prompts.md', out.join('\n'));
console.log(`wrote ${CHAPTERS.length} prompts`);
