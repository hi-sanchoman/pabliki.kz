'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/landing/ui/button';
import { AspectRatio } from '@/components/landing/ui/aspect-ratio';
import Image from 'next/image';

const cases = [
  {
    title: 'KIA',
    type: 'Stories',
    image: '/landing/public_demo.png',
    className: 'translate-y-4',
  },
  {
    title: 'DIZZY',
    type: 'Reels',
    image: '/landing/public_demo.png',
    className: '-translate-y-6',
  },
  {
    title: 'TAS GROUP',
    type: 'Post',
    image: '/landing/public_demo.png',
    className: 'translate-y-8',
  },
  {
    title: 'WOW-Qoldau',
    type: 'Stories',
    image: '/landing/public_demo.png',
    className: '-translate-y-4',
  },
  {
    title: 'Доктор ОСТ',
    type: 'Carousel',
    image: '/landing/public_demo.png',
    className: 'translate-y-6',
  },
  {
    title: 'Синдром сухого глаза',
    type: 'Stories',
    image: '/landing/public_demo.png',
    className: '-translate-y-8',
  },
  {
    title: 'Греция - Черногория',
    type: 'Post',
    image: '/landing/public_demo.png',
    className: 'translate-y-4',
  },
  {
    title: 'Аутизм',
    type: 'Stories',
    image: '/landing/public_demo.png',
    className: '-translate-y-6',
  },
  {
    title: 'К 30 годам',
    type: 'Reels',
    image: '/landing/public_demo.png',
    className: 'translate-y-8',
  },
  {
    title: 'Green Market',
    type: 'Post',
    image: '/landing/public_demo.png',
    className: '-translate-y-4',
  },
  {
    title: 'Fitness Club',
    type: 'Stories',
    image: '/landing/public_demo.png',
    className: 'translate-y-6',
  },
  {
    title: 'Beauty Salon',
    type: 'Post',
    image: '/landing/public_demo.png',
    className: '-translate-y-8',
  },
  {
    title: 'Coffee Shop',
    type: 'Reels',
    image: '/landing/public_demo.png',
    className: 'translate-y-4',
  },
  {
    title: 'Restaurant',
    type: 'Stories',
    image: '/landing/public_demo.png',
    className: '-translate-y-6',
  },
  {
    title: 'Tech Store',
    type: 'Post',
    image: '/landing/public_demo.png',
    className: 'translate-y-8',
  },
];

export function CaseStudiesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-50" />

      <div className="container relative">
        <h2 className="text-4xl font-bold text-center mb-16">НАШИ КЕЙСЫ ПО РАЗМЕЩЕНИЯМ</h2>

        {/* Floating Posts Grid */}
        <div className="grid grid-cols-5 gap-y-16 mb-16 -mx-2">
          {cases.map((case_, index) => (
            <div
              key={index}
              className={`transform transition-all duration-500 hover:scale-105 ${case_.className} w-[200px] mx-auto`}
            >
              <AspectRatio ratio={9 / 16} className="rounded-lg overflow-hidden shadow-md">
                <Image
                  src={case_.image}
                  alt={`${case_.title} - ${case_.type}`}
                  className="w-full h-full object-cover"
                  fill
                />
              </AspectRatio>
            </div>
          ))}
        </div>

        {/* Price Download Button */}
        <div className="text-center mb-24">
          <Button
            size="lg"
            variant="primary"
            className="bg-blue-500 hover:bg-blue-600 text-white gap-2"
            asChild
          >
            <a href="/price.pdf" download>
              <Download className="w-4 h-4" />
              Скачать прайс
            </a>
          </Button>
        </div>

        {/* Rich Man CTA Section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-400 text-white p-12 h-[300px]">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">ХОЧЕШЬ БЫТЬ В ЧИСЛЕ ФАВОРИТОВ?</h3>
              <p className="text-lg text-blue-50">
                Начни свое размещение и получай результат, который обеспечит твой успех!
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                начать размещение
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center justify-center">
              <Image
                src="/landing/rich_man.png"
                alt="Успешный предприниматель"
                className="h-[120%] object-contain"
                width={300}
                height={360}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
