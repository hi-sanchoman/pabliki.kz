'use client';

import { VideoPlayer } from '@/components/common/VideoPlayer';
import { landingConstants } from '@/constants/landing';
import { Card, CardContent } from '@/components/ui/card';

export function LandingHero() {
  const { title, description, videoUrl, videoThumbnail } = landingConstants.hero;

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 p-8 bg-blue-100 rounded-lg">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <VideoPlayer videoUrl={videoUrl} thumbnailUrl={videoThumbnail} className="lg:order-1" />

        <Card className="bg-white shadow-sm border-0 lg:order-2 rounded-lg">
          <CardContent className="p-6">
            <p className="text-xl md:text-2xl leading-relaxed text-slate-800">{description}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
