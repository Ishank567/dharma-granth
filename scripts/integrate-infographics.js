const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../app/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Add imports
const importSection = `import { StatsInfographic } from "@/app/components/StatsInfographic";
import { ThreePillarsInfographic } from "@/app/components/ThreePillarsInfographic";
import { ScienceSpiritualityInfographic } from "@/app/components/ScienceSpiritualityInfographic";`;

// Find the NityaKarmaKriya import line and add after it
pageContent = pageContent.replace(
  /(import { NityaKarmaKriya } from "@\/app\/components\/NityaKarmaKriya";)/,
  `$1\n${importSection}`
);

// Replace stats section
const statsSection = `      {/* ── Stats ─────────────────────────────────────────────────── */}
      <StatsInfographic stats={[
        {
          value: ${typeof realVerses !== 'undefined' ? 'realVerses' : '0'},
          label: "Verses Explained",
          icon: <BookOpen className="w-5 h-5" />,
          color: "text-saffron-700 bg-gradient-to-br from-saffron-50 to-amber-50",
          border: "border-saffron-200",
          trend: "+12%"
        },
        {
          value: ${typeof realChapters !== 'undefined' ? 'realChapters' : '0'},
          label: "Chapters Live",
          icon: <Scroll className="w-5 h-5" />,
          color: "text-emerald-700 bg-gradient-to-br from-emerald-50 to-green-50",
          border: "border-emerald-200",
          trend: "+8%"
        },
        {
          value: ${typeof realScriptures !== 'undefined' ? 'realScriptures' : '0'},
          label: "Scriptures Indexed",
          icon: <Flame className="w-5 h-5" />,
          color: "text-indigo-700 bg-gradient-to-br from-indigo-50 to-blue-50",
          border: "border-indigo-200",
          trend: "+5%"
        },
        {
          value: ${typeof cataloged !== 'undefined' ? 'cataloged' : '0'},
          label: "In the Library",
          icon: <TreePine className="w-5 h-5" />,
          color: "text-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50",
          border: "border-amber-200",
          trend: "+15%"
        },
      ]} />`;

// Replace the old stats section (between Stats comment and Panchang comment)
pageContent = pageContent.replace(
  /{\/\* ── Stats ────.*?{\/\* ── Panchang Calendar ────/s,
  `${statsSection}\n\n      {/* ── Panchang Calendar ────`
);

// Replace Three Pillars section
const threePillarsSection = `      {/* ── Three Pillars ─────────────────────────────────────────── */}
      <ThreePillarsInfographic />`;

pageContent = pageContent.replace(
  /{\/\* ── Three Pillars ────.*?{\/\* ── Science Meets Spirituality Banner ────/s,
  `${threePillarsSection}\n\n      {/* ── Science Meets Spirituality Banner ────`
);

// Replace Science meets Spirituality section
const scienceSection = `      {/* ── Science Meets Spirituality ─────────────────────── */}
      <ScienceSpiritualityInfographic />`;

pageContent = pageContent.replace(
  /{\/\* ── Science Meets Spirituality Banner ────.*?{\/\* ── Featured Texts ────/s,
  `${scienceSection}\n\n      {/* ── Featured Texts ────`
);

fs.writeFileSync(pagePath, pageContent);
console.log('✓ Infographic components integrated into page.tsx');
