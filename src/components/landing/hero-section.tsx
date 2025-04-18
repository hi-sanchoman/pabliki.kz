'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/landing/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

const stats = [
  { number: '1 100', label: 'новостных пабликов' },
  { number: '140', label: 'млн подписчиков' },
  { number: '80', label: 'городов и населенных пунктов по РК' },
];

const slides = [
  {
    image: '/landing/rich_man.png',
    title: 'Размести свой контент в популярных пабликах по всему Казахстану',
    description: 'Самая большая база пабликов Instagram по всей Республике Казахстан',
  },
  {
    image: '/landing/rich_man.png',
    title: 'Охватите миллионную аудиторию',
    description: 'Эффективное продвижение вашего бренда через популярные паблики',
  },
  {
    image: '/landing/rich_man.png',
    title: 'Таргетированная реклама по городам',
    description: 'Выбирайте регионы и города для максимального охвата целевой аудитории',
  },
];

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div key={index} className="embla__slide relative min-h-[600px] w-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div className="absolute inset-0 bg-black/40" />
              </div>

              <div className="container relative py-24">
                <div className="mx-auto max-w-3xl text-center text-white">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-white">
                    {slide.title}
                  </h1>
                  <p className="mt-6 text-xl text-white">{slide.description}</p>

                  <div className="mt-10 grid gap-6 sm:grid-cols-3">
                    {stats.map((stat, i) => (
                      <div key={i} className="flex flex-col">
                        <dt className="text-4xl font-bold tracking-tight text-white">
                          {stat.number}
                        </dt>
                        <dd className="text-base text-white/70">{stat.label}</dd>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10">
                    <Button size="lg" className="text-lg bg-primary text-white">
                      Запусти рекламную компанию за несколько кликов
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </Button>
    </div>
  );
}
