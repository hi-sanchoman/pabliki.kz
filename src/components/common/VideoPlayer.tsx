'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  className?: string;
}

export function VideoPlayer({ videoUrl, thumbnailUrl, className = '' }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgSrc, setImgSrc] = useState(thumbnailUrl);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      {!isPlaying ? (
        <div
          className="relative w-full aspect-video cursor-pointer bg-blue-100 rounded-lg"
          onClick={handlePlayClick}
        >
          <Image
            src={imgSrc}
            alt="Video thumbnail"
            fill
            className="object-cover rounded-lg"
            sizes="100vw"
            onError={() => setImgSrc('https://placehold.co/800x450/e2e8f0/a0aec0?text=Video')}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-full bg-blue-500/80 text-white">
              <Play size={32} fill="white" />
            </div>
          </div>
          {/* Video progress bar (static for design purposes) */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-200/70">
            <div className="h-full w-[35%] bg-blue-500 rounded-r-full"></div>
          </div>
        </div>
      ) : (
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={`${videoUrl}?autoplay=1`}
            title="Video player"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          ></iframe>
        </div>
      )}
    </div>
  );
}
