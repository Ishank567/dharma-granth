import type { Metadata } from 'next';
import { HeroSection } from '@/app/components/HeroSection';
import { SplashScreen } from '@/app/components/SplashScreen';
import { ContinueReading } from '@/app/components/ContinueReading';
import { VerseOfTheDaySection } from '@/app/components/VerseOfTheDaySection';
import { LifeSituationsSection } from '@/app/components/LifeSituationsSection';
import { FeaturedScripturesSection } from '@/app/components/FeaturedScripturesSection';
import { CategoryExploreSection } from '@/app/components/CategoryExploreSection';
import { SadhanaPreviewSection } from '@/app/components/SadhanaPreviewSection';
import { PanchangPreviewSection } from '@/app/components/PanchangPreviewSection';
import { Experience3DSection } from '@/app/components/Experience3DSection';
import { SiteFooter } from '@/app/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Dharma Granth — Calm, Bilingual Digital Scripture Library',
  description:
    'A tranquil, ad-free digital sanctuary of Hindu scriptures — Bhagavad Gita, Upanishads, Vedas, and Puranas with authentic Sanskrit, Hindi bhavarth, and English commentary.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-dharma-bg text-dharma-text selection:bg-amber-200 selection:text-amber-900">
      {/* Visual Splash / Orientation for first-time direct visitors */}
      <SplashScreen />

      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CONTINUE READING / START HERE */}
      <ContinueReading />

      {/* 3. VERSE OF THE DAY */}
      <VerseOfTheDaySection />

      {/* 4. BROWSE BY LIFE SITUATION */}
      <LifeSituationsSection />

      {/* 5. FEATURED SCRIPTURES */}
      <FeaturedScripturesSection />

      {/* 6. EXPLORE BY CATEGORY */}
      <CategoryExploreSection />

      {/* 7. SADHANA PREVIEW */}
      <SadhanaPreviewSection />

      {/* 8. PANCHANG PREVIEW */}
      <PanchangPreviewSection />

      {/* 9. 3D EXPERIENCE */}
      <Experience3DSection />
    </main>
    {/* Site Footer with sources, methodology, and quiet contemplation */}
    <SiteFooter />
  </>
  );
}
