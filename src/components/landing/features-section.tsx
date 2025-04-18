'use client';

import { BarChart3, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import { AspectRatio } from '@/components/landing/ui/aspect-ratio';

const features = [
  {
    title: 'Подбираем под вашу целевую аудиторию',
    description:
      'Размещаем Вашу публикацию в нужных Вам городах и на нужную аудиторию на выбор, учитываем русскоязычные и казахскоязычные регионы и города по Вашему пожеланию. Мы предлагаем полный спектр услуг по планированию, созданию и размещению контента в Instagram.',
    image: '/targeting.jpg',
  },
  {
    title: 'Предоставляем отчеты по размещениям',
    description:
      'Предоставляем аналитический отчет со статистикой по размещению во всех выбранных информационных CRM таблицах. Детальная аналитика поможет оценить эффективность вашей рекламной кампании.',
    image: '/analytics.jpg',
  },
  {
    title: 'Официально работаем по договору',
    description:
      'Предоставляем все необходимые закрывающие документы. Работаем официально с юридическими и физическими лицами, обеспечивая полную прозрачность всех операций.',
    image: '/contract.jpg',
  },
  {
    title: 'Гарантированное размещение',
    description:
      'Обеспечиваем размещение вашего контента в выбранных пабликах с гарантией публикации. Наша система мониторинга отслеживает каждое размещение для обеспечения качества услуг.',
    image: '/guarantee.jpg',
  },
];

const stats = [
  {
    number: '920+',
    label: 'Публикаций по РК',
    icon: BarChart3,
  },
  {
    number: '68млн',
    label: 'Общая аудитория',
    icon: Users,
  },
  {
    number: '24ч',
    label: 'Скорость размещения',
    icon: Clock,
  },
  {
    number: '100%',
    label: 'Официально',
    icon: BarChart3,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          {features.map((feature, index) => (
            <div key={index} className="space-y-4">
              <div className="relative rounded-lg overflow-hidden">
                <AspectRatio ratio={16 / 9}>
                  <Image src={feature.image} alt={feature.title} className="object-cover" fill />
                </AspectRatio>
              </div>
              <h3 className="text-2xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-muted to-background" />
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-bold">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Профессиональная аналитика для вашего бизнеса</h2>
            <p className="text-lg text-muted-foreground">
              Получайте детальные отчеты о результатах рекламных кампаний, включая охват аудитории,
              вовлеченность и конверсии. Наша платформа предоставляет все необходимые инструменты
              для анализа эффективности ваших размещений.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-muted to-background -rotate-3 rounded-2xl" />
            <div className="relative bg-card rounded-xl shadow-lg overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <Image src="/dashboard.jpg" alt="Dashboard" className="object-cover" fill />
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
