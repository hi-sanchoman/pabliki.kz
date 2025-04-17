'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';

export function LandingAudience() {
  const stats = [
    {
      number: '920+',
      title: 'Пабликов по РК',
      description:
        'Мы работаем с самыми популярными и конверсионными пабликами по всему Казахстану',
    },
    {
      number: '68млн',
      title: 'Подписчиков',
      description: 'Общая аудитория всех пабликов составляет более 68 миллионов подписчиков',
    },
    {
      number: 'за 24 часа',
      title: 'Экстренно',
      description: 'Мы разместим вашу публикацию во всех пабликах по РК всего лишь за 24 часа',
    },
    {
      number: 'Официально',
      title: 'Работаем по договору',
      description: 'Предоставляем аналитический отчет и закрывающие документы',
    },
  ];

  return (
    <section className="w-full bg-blue-100/50 py-16">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Подбираем под вашу целевую аудиторию
              </h2>
              <p className="text-gray-700 mb-4">
                Размещаем Вашу публикацию в нужных Вам городах и на нужную аудиторию на выбор,
                учитываем русскоговорящие и казахскоговорящие регионы и города по Вашему пожеланию.
                Мы предлагаем полный спектр услуг по планированию, созданию и размещению контента в
                Instagram
              </p>
              <div className="mt-6">
                <Image
                  src="/mock-table.png"
                  alt="Таблица пабликов и стоимости"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/500x300/e6f2ff/2d82c7?text=Таблица+пабликов';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Предоставляем отчеты по размещениям
                  </h2>
                  <p className="text-gray-700 mb-6">
                    Предоставляем аналитический отчет со статистикой по размещению во всех выбранных
                    информационных СМИ пабликах.
                  </p>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Официально работаем по договору
                    </h3>
                    <p className="text-gray-700">Предоставляем закрывающие документы</p>
                  </div>
                </div>

                <div className="flex-1 flex justify-center items-start lg:items-center">
                  <div className="relative w-64 h-[400px] lg:h-[500px] mt-6 lg:mt-0 shadow-xl">
                    <Image
                      src="/mock-phone.png"
                      alt="Мобильный отчет"
                      width={300}
                      height={600}
                      className="object-contain h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          'https://placehold.co/300x600/e6f2ff/2d82c7?text=Отчет+на+телефоне';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-blue-50 p-6 rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-4xl font-bold text-gray-800">{stat.number}</h3>
                <p className="text-lg font-semibold text-gray-700 mt-2">{stat.title}</p>
                <p className="text-gray-600 mt-2 flex-grow text-sm">{stat.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
