'use client';

import { Button } from '@/components/landing/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/landing/ui/carousel';
import { Card, CardContent, CardFooter } from '@/components/landing/ui/card';
import { AspectRatio } from '@/components/landing/ui/aspect-ratio';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/landing/ui/dialog';
import { useState } from 'react';
import Image from 'next/image';

const packages = [
  {
    city: 'Алматы',
    image: '/almaty.jpg',
    publicCount: 22,
    subscribers: '8 560 000',
    price: '1 280 000',
  },
  {
    city: 'Астана',
    image: '/astana.jpg',
    publicCount: 18,
    subscribers: '4 625 000',
    price: '860 000',
  },
  {
    city: 'Шымкент',
    image: '/shymkent.jpg',
    publicCount: 15,
    subscribers: '2 850 000',
    price: '420 000',
  },
  {
    city: 'Караганда',
    image: '/karaganda.jpg',
    publicCount: 12,
    subscribers: '1 950 000',
    price: '380 000',
  },
  {
    city: 'Актобе',
    image: '/aktobe.jpg',
    publicCount: 10,
    subscribers: '1 450 000',
    price: '320 000',
  },
];

const allPackages = [
  ...packages,
  {
    city: 'Тараз',
    image:
      'https://images.unsplash.com/photo-1578950435899-d1c1bf932ab2?auto=format&fit=crop&w=800',
    publicCount: 8,
    subscribers: '980 000',
    price: '280 000',
  },
  {
    city: 'Павлодар',
    image:
      'https://images.unsplash.com/photo-1578950435898-d1c1bf932ab1?auto=format&fit=crop&w=800',
    publicCount: 7,
    subscribers: '850 000',
    price: '260 000',
  },
  // Add more packages here...
];

export function ThemedSelections() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-24">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-4">
          ЛУЧШИЕ ПОДБОРКИ РАЗМЕЩЕНИЙ К ПРАЗДНИКУ НАУРЫЗ
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
          Мы подготовили для Вас актуальную подборку размещений по всем основным городам Республики
          Казахстан данная подборка актуальна для размещений любого типа бизнеса акцентированная под
          тематику праздника
        </p>

        <div className="relative">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {packages.map((pkg, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card>
                    <CardContent className="p-0">
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={pkg.image}
                          alt={`${pkg.city} - Наурыз`}
                          className="w-full h-full object-cover rounded-t-lg"
                          fill
                        />
                      </AspectRatio>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-4">г. {pkg.city}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Количество пабликов:</span>
                            <span className="font-medium">{pkg.publicCount} ПАБЛИКОВ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Подписчиков:</span>
                            <span className="font-medium">{pkg.subscribers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Стоимость:</span>
                            <span className="font-medium">{pkg.price} ₸</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button className="w-full" size="lg">
                        ОТКРЫТЬ
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="mt-12 text-center">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                СМОТРЕТЬ БОЛЬШЕ ПРЕДЛОЖЕНИЙ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-8">
                  ТЕМАТИЧЕСКИЕ ПАКЕТНЫЕ ПРЕДЛОЖЕНИЯ ДЛЯ РАЗМЕЩЕНИЯ В ПОПУЛЯРНЫХ ПАБЛИКАХ ПО ГОРОДАМ
                  РК
                </DialogTitle>
                <p className="text-muted-foreground mb-8">
                  Мы подготовили для Вас актуальную подборку размещений по всем основным городам
                  Республики Казахстан данная подборка актуальна для размещений любого типа бизнеса
                  акцентированная под тематику праздника
                </p>
              </DialogHeader>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPackages.map((pkg, index) => (
                  <Card key={index}>
                    <CardContent className="p-0">
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={pkg.image}
                          alt={`${pkg.city} - Наурыз`}
                          className="w-full h-full object-cover rounded-t-lg"
                          fill
                        />
                      </AspectRatio>
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-4">г. {pkg.city}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Количество пабликов:</span>
                            <span className="font-medium">{pkg.publicCount} ПАБЛИКОВ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Подписчиков:</span>
                            <span className="font-medium">{pkg.subscribers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Стоимость:</span>
                            <span className="font-medium">{pkg.price} ₸</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button className="w-full" size="lg">
                        ОТКРЫТЬ
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
