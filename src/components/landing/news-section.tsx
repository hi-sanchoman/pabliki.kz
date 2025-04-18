'use client';

import { Button } from '@/components/landing/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/landing/ui/carousel';
import { Card, CardContent } from '@/components/landing/ui/card';
import { AspectRatio } from '@/components/landing/ui/aspect-ratio';
import Image from 'next/image';

const news = [
  {
    title: 'YouTube запустил новый тариф Premium Lite...',
    excerpt:
      'YouTube запустил новый тариф Premium Lite, который является самым дешевым в его линейке подписок. Тариф Premium за $12 в месяц обеспечивает полное отсутствие рекламы, включая...',
    image:
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800',
    date: '12 марта 2024',
  },
  {
    title: 'Французская рекламная группа Publicis по итогам 2024 года...',
    excerpt:
      'Французская рекламная группа Publicis по итогам 2024 года заняла первое место среди крупнейших рекламных компаний мира, обогнав своих конкурентов и укрепив позиции на глобальном рынке...',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800',
    date: '10 марта 2024',
  },
  {
    title: 'Gruppa Russ поддержат социальные инициативы государства через рекламу',
    excerpt:
      'Gruppa Russ разработала концепцию продвижения, основанную на базовых ценностях и приоритетах, таких как «Дружить по-russки» и «Любить по-russki». В результате ...',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800',
    date: '8 марта 2024',
  },
];

export function NewsSection() {
  return (
    <section className="py-24">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-16">НОВОЕ В МИРЕ РЕКЛАМЫ</h2>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {news.map((item, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-0">
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        fill
                      />
                    </AspectRatio>
                    <div className="p-6 space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                        <h3 className="font-bold text-xl line-clamp-2">{item.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{item.excerpt}</p>
                      </div>
                      <Button variant="link" className="p-0 h-auto font-semibold">
                        Читать далее
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
