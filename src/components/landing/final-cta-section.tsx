'use client';

import { AspectRatio } from '@/components/landing/ui/aspect-ratio';
import { Button } from '@/components/landing/ui/button';
import Image from 'next/image';
import { Card } from '@/components/landing/ui/card';

export function FinalCtaSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="relative">
              <AspectRatio ratio={4 / 3}>
                <Image
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800"
                  alt="Успешный бизнесмен"
                  className="object-cover"
                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50" />
              </AspectRatio>
            </div>
            <div className="p-8 md:p-12 lg:p-16">
              <h2 className="text-4xl font-bold mb-6">Хочешь быть в числе фаворитов?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Присоединяйтесь к сотням успешных компаний, которые уже используют нашу платформу
                для эффективного продвижения в Instagram. Начните свой путь к успеху прямо сейчас!
              </p>
              <Button size="lg" className="w-full md:w-auto bg-primary text-white">
                начать размещение
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
