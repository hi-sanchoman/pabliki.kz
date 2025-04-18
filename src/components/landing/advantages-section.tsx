'use client';

import { Eye, TrendingUp, Users, Clock, Target, FileText } from 'lucide-react';

const advantages = [
  {
    icon: Eye,
    title: 'Миллионные охваты и просмотры',
    description: 'Ваш контент увидят тысячи пользователей Instagram по всему Казахстану.',
  },
  {
    icon: TrendingUp,
    title: 'Рост продаж',
    description: 'Привлечение клиентов и новую аудиторию за счёт таргетированного продвижения.',
  },
  {
    icon: Users,
    title: 'Рост подписчиков',
    description: 'Привлекаем реальную и активную аудиторию в ваш Instagram.',
  },
  {
    icon: Clock,
    title: 'Самое быстрое размещение',
    description: 'Всего за 24 часа мы разместим ваш контент в популярных пабликах.',
  },
  {
    icon: Target,
    title: 'Заявки и лиды',
    description: 'Приводим целевых клиентов, готовых к покупке Ваших товаров и услуг.',
  },
  {
    icon: FileText,
    title: 'Отчет и документы',
    description:
      'Предоставляем аналитический отчет по размещениям, а также закрывающие документы для Вашей бухгалтерии.',
  },
];

export function AdvantagesSection() {
  return (
    <section className="py-24">
      <div className="container">
        <h2 className="text-4xl font-bold text-center mb-16">
          Что вы получите, обратившись в Pabliki.kz?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="p-6 bg-card rounded-xl border transition-colors hover:bg-muted/50"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <advantage.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{advantage.title}</h3>
              <p className="text-muted-foreground">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
