'use client';

import { PublicSelectorTabs } from '@/components/publics/PublicSelectorTabs';
import { LandingHero } from '@/components/publics/LandingHero';
import { HeroSlider } from '@/components/publics/HeroSlider';
import { LandingHeader } from '@/components/publics/LandingHeader';
import { ContentUploadSection } from '@/components/publics/ContentUploadSection';
import { LandingAudience } from '@/components/publics/LandingAudience';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <div className="p-6">
        <HeroSlider />
        <LandingHero />
        <div className="w-full max-w-6xl mx-auto p-8 bg-blue-100 rounded-lg">
          <PublicSelectorTabs />
        </div>
        <div className="w-full max-w-6xl mx-auto mt-12 mb-12">
          <ContentUploadSection />
        </div>
      </div>
      <LandingAudience />
    </div>
  );
}
