'use client';

import { SiteHeader } from '@/components/landing/site-header';
import { HeroSection } from '@/components/landing/hero-section';
import { LaunchSection } from '@/components/landing/launch-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { CoverageMapSection } from '@/components/landing/coverage-map-section';
import { ThemedSelections } from '@/components/landing/themed-selections';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { AdvantagesSection } from '@/components/landing/advantages-section';
import { TrustedBySection } from '@/components/landing/trusted-by-section';
import { WorkStagesSection } from '@/components/landing/work-stages-section';
import { CaseStudiesSection } from '@/components/landing/case-studies-section';
import { ContentUploadSection } from '@/components/landing/content-upload-section';
import { NewsSection } from '@/components/landing/news-section';
import { FooterSection } from '@/components/landing/footer-section';
import { FinalCtaSection } from '@/components/landing/final-cta-section';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col landing-page" style={{ backgroundColor: 'white' }}>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <LaunchSection />
        <ContentUploadSection />
        <FeaturesSection />
        <CoverageMapSection />
        <ThemedSelections />
        <TestimonialsSection />
        <AdvantagesSection />
        <TrustedBySection />
        <WorkStagesSection />
        <CaseStudiesSection />
        <FinalCtaSection />
        <NewsSection />
        <FooterSection />
      </main>
    </div>
  );
}
