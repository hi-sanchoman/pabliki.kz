'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CarouselSlide {
  id: number | string;
  content: ReactNode;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number; // Time in ms between auto transitions (0 to disable)
  className?: string;
}

export function Carousel({ slides, autoPlayInterval = 5000, className = '' }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlayInterval > 0);

  const slideCount = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Handle auto play
  useEffect(() => {
    if (!isAutoPlaying || autoPlayInterval <= 0) return;

    const intervalId = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(intervalId);
  }, [isAutoPlaying, autoPlayInterval, nextSlide]);

  // Pause auto play on hover
  const pauseAutoPlay = () => setIsAutoPlaying(false);
  const resumeAutoPlay = () => setIsAutoPlaying(autoPlayInterval > 0);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full flex-shrink-0">
            {slide.content}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 border-0 rounded-full h-10 w-10 shadow-md z-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 border-0 rounded-full h-10 w-10 shadow-md z-10"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-blue-600 w-6' : 'bg-white/60 hover:bg-white/80'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
