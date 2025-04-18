'use client';

import { Card, CardContent } from '@/components/landing/ui/card';
import { FileText, HandshakeIcon, LineChart, MessageSquare, Upload } from 'lucide-react';

const stages = [
  {
    number: 1,
    icon: MessageSquare,
    title: 'Оценка проекта',
    description:
      'Анализируем ваши цели и задачи, подбираем оптимальные паблики и стратегию размещения',
  },
  {
    number: 2,
    icon: HandshakeIcon,
    title: 'Подписание договора',
    description: 'Заключаем официальный договор и производим оплату через безналичный расчет',
  },
  {
    number: 3,
    icon: Upload,
    title: 'Размещение публикации',
    description: 'Создаем и размещаем контент в выбранных пабликах согласно медиаплану',
  },
  {
    number: 4,
    icon: FileText,
    title: 'Предоставление отчета',
    description: 'Формируем подробный отчет с аналитикой по каждому размещению',
  },
  {
    number: 5,
    icon: LineChart,
    title: 'Итоги работы',
    description: 'Анализируем результаты, предоставляем рекомендации по дальнейшему продвижению',
  },
];

export function WorkStagesSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-16">ЭТАПЫ РАБОТЫ</h2>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stages.map((stage) => (
            <Card key={stage.number} className="relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {stage.number}
              </div>
              <CardContent className="pt-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <stage.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{stage.title}</h3>
                <p className="text-muted-foreground">{stage.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
