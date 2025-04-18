'use client';

import { Carousel, CarouselSlide } from '@/components/common/Carousel';
import { landingConstants } from '@/constants/landing';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export function HeroSlider() {
  const slides: CarouselSlide[] = landingConstants.slider.map((slide) => ({
    id: slide.id,
    content: (
      <div className="relative w-full aspect-[21/9] flex items-center justify-center bg-blue-100 rounded-lg">
        {/* Background image */}
        <Image
          src={slide.imageUrl}
          alt={slide.title}
          fill
          className="object-contain"
          sizes="100vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/hero-section-phone-image2.png';
          }}
        />
        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 md:px-16 text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 max-w-2xl drop-shadow-lg">
            {slide.title}
          </h2>
          <p className="text-lg md:text-xl mb-6 max-w-xl drop-shadow-lg">{slide.description}</p>
          <div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Начать сейчас
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    ),
  }));

  return (
    <section className="w-full bg-white py-8 mb-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black w-full max-w-6xl mx-auto">
        Размести свой контент в популярных пабликах по всему Казахстану
      </h1>
      <div className="w-full max-w-6xl mx-auto bg-white p-8">
        <div className="rounded-lg overflow-hidden shadow-md">
          <Carousel slides={slides} autoPlayInterval={6000} className="rounded-lg" />
        </div>
      </div>
    </section>
  );
}
