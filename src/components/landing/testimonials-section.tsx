'use client';

import { Card, CardContent } from '@/components/landing/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/landing/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/landing/ui/carousel';
import Image from 'next/image';

const testimonials = [
  {
    name: 'ДМИТРИЙ КАЗАНЦЕВ',
    role: 'Founder & CEO',
    company: 'KAZANTSEV GROUP',
    image: '/dmitry-1.jpg',
    logo: '/kazantsev-group.svg',
    quote:
      'ДМИТРИЙ КАЗАНЦЕВ, РЕКОМЕНДУЕТ! Дмитрием Казанцевым является самым выдающимся экспертом в области налогов и финансов, а также по оптимизации и развитию бизнеса. На регулярной основе сервис Pabliki.kz тестировался на собственном бизнесе и показал отличные показатели ERR и CTR что в последствии привели к высоким результатам развития бренда.',
  },
  {
    name: 'ДМИТРИЙ КАЗАНЦЕВ',
    role: 'Marketing Director',
    company: 'KMF',
    image: '/dmitry-2.jpg',
    logo: '/kmf.svg',
    quote:
      'ДМИТРИЙ КАЗАНЦЕВ, РЕКОМЕНДУЕТ! Дмитрием Казанцевым является самым выдающимся экспертом в области налогов и финансов, а также по оптимизации и развитию бизнеса. На регулярной основе сервис Pabliki.kz тестировался на собственном бизнесе и показал отличные показатели ERR и CTR что в последствии привели к высоким результатам развития бренда.',
  },
  {
    name: 'ДМИТРИЙ КАЗАНЦЕВ',
    role: 'CEO',
    company: 'dizzy',
    image: '/dmitry-3.jpg',
    logo: '/dizzy.svg',
    quote:
      'ДМИТРИЙ КАЗАНЦЕВ, РЕКОМЕНДУЕТ! Дмитрием Казанцевым является самым выдающимся экспертом в области налогов и финансов, а также по оптимизации и развитию бизнеса. На регулярной основе сервис Pabliki.kz тестировался на собственном бизнесе и показал отличные показатели ERR и CTR что в последствии привели к высоким результатам развития бренда.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-16">ОТЗЫВЫ И РЕКОМЕНДАЦИИ</h2>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        <div className="text-sm font-medium">{testimonial.company}</div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <Image
                        src={testimonial.logo}
                        alt={testimonial.company}
                        className="h-8 w-auto"
                        width={120}
                        height={32}
                      />
                    </div>
                    <blockquote className="text-muted-foreground">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
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
