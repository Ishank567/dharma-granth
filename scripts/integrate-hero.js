const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Add HeroSection import
const heroImport = `import { HeroSection } from "@/app/components/HeroSection";`;

// Find the ScienceSpiritualityInfographic import line and add after it
pageContent = pageContent.replace(
  /(import { ScienceSpiritualityInfographic } from "@\/app\/components\/ScienceSpiritualityInfographic";)/,
  `$1\n${heroImport}`
);

// Replace the hero section
const heroSection = `      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection />`;

// Replace the old hero section (from {/* ── Hero comment to {/* ── Featured Verse comment)
pageContent = pageContent.replace(
  /{\/\* ── Hero ────.*?{\/\* ── Featured Verse ────/s,
  `${heroSection}\n\n      {/* ── Featured Verse ────`
);

fs.writeFileSync(pagePath, pageContent);
console.log('✓ HeroSection integrated into page.tsx');
