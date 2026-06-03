const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Find and replace the hero section
const oldHeroStart = '      {/* ── Hero ──────────────────────────────────────────────────── */}';
const oldHeroEnd = '      </section>';

const startIndex = pageContent.indexOf(oldHeroStart);
const endIndex = pageContent.indexOf(oldHeroEnd, startIndex) + oldHeroEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  const before = pageContent.substring(0, startIndex);
  const after = pageContent.substring(endIndex);
  const newContent = before + '      <HeroSection />' + after;
  fs.writeFileSync(pagePath, newContent);
  console.log('✓ Hero section replaced with HeroSection component');
} else {
  console.log('✗ Could not find hero section to replace');
}
