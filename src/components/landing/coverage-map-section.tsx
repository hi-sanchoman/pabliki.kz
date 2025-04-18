'use client';

import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { AspectRatio } from '@/components/landing/ui/aspect-ratio';
import { Card, CardContent } from '@/components/landing/ui/card';
import Image from 'next/image';

const cities = [
  { name: 'Астана', x: 53, y: 40, followers: '2.1M' },
  { name: 'Алматы', x: 75, y: 75, followers: '3.5M' },
  { name: 'Шымкент', x: 65, y: 85, followers: '1.8M' },
  { name: 'Караганда', x: 45, y: 45, followers: '1.2M' },
  { name: 'Актобе', x: 20, y: 45, followers: '900K' },
  { name: 'Атырау', x: 15, y: 55, followers: '750K' },
  { name: 'Павлодар', x: 65, y: 30, followers: '650K' },
  { name: 'Усть-Каменогорск', x: 80, y: 35, followers: '800K' },
  { name: 'Семей', x: 73, y: 32, followers: '700K' },
  { name: 'Костанай', x: 35, y: 25, followers: '550K' },
];

function CityMarker({
  name,
  x,
  y,
  followers,
}: {
  name: string;
  x: number;
  y: number;
  followers: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const spring = useSpring({
    scale: isHovered ? 1 : 0,
    config: { tension: 300 },
  });

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {/* Compact Circle */}
      <div className="relative">
        <div className="w-12 h-12 bg-primary/70 rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium backdrop-blur-sm">
          {followers}
        </div>

        {/* Expanded Card */}
        <animated.div
          style={{
            transform: spring.scale.to((s) => `scale(${s})`),
            transformOrigin: 'center center',
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-popover/95 backdrop-blur-sm text-popover-foreground rounded-lg shadow-lg p-4 whitespace-nowrap text-center min-w-[140px] z-50"
        >
          <div className="text-sm font-medium mb-1">{name}</div>
          <div className="text-xl font-bold mb-1">{followers}</div>
          <div className="text-xs text-muted-foreground/80">подписчиков</div>
        </animated.div>
      </div>
    </div>
  );
}

export function CoverageMapSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-16">Покрытие аудитории по Казахстану</h2>
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden">
            <CardContent className="p-8">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src="/landing/kaz_map.svg"
                  alt="Карта Казахстана"
                  className="w-full h-full object-contain"
                  fill
                />
                <div className="absolute inset-0">
                  {cities.map((city) => (
                    <CityMarker key={city.name} {...city} />
                  ))}
                </div>
              </AspectRatio>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
