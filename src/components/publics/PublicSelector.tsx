'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

// Import the components properly when they're compiled
// import { PublicResult } from './PublicResult';
// import { PublicCategory } from './PublicCategory';

type Region = {
  id: string;
  name: string;
};

type City = {
  id: string;
  name: string;
};

type Topic = {
  id: string;
  name: string;
};

type Category = {
  min: number;
  max: number;
  active: boolean;
};

type Public = {
  id: string;
  name: string;
  subscribers: number;
  monthlyReach: number;
  costPerPost: number;
  avatar: string;
};

type PublicCategoryProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function PublicCategory({ label, active, onClick }: PublicCategoryProps) {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer ${active ? 'opacity-100' : 'opacity-50'}`}
      onClick={onClick}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        {active && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="text-sm">{label}</div>
    </div>
  );
}

type PublicResultProps = {
  avatar: string;
  name: string;
  subscribers: number;
  monthlyReach: number;
  costPerPost: number;
};

function PublicResult({ avatar, name, subscribers, monthlyReach, costPerPost }: PublicResultProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <button className="text-gray-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden relative">
          <Image
            src={avatar}
            alt={name}
            fill
            className="object-cover"
            sizes="40px"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/next.svg';
            }}
          />
        </div>
        <div className="text-sm font-medium">{name}</div>
      </div>

      <div className="flex gap-8">
        <div className="text-center">
          <div className="text-sm font-semibold">{subscribers.toLocaleString()}</div>
          <div className="text-xs text-gray-500">подписчики</div>
        </div>

        <div className="text-center">
          <div className="text-sm font-semibold">{monthlyReach.toLocaleString()}</div>
          <div className="text-xs text-gray-500">месячный охват</div>
        </div>

        <div className="text-center">
          <div className="text-sm font-semibold">{costPerPost.toLocaleString()}</div>
          <div className="text-xs text-gray-500">стоимость</div>
        </div>
      </div>
    </div>
  );
}

export function PublicSelector() {
  const [regions] = useState<Region[]>([{ id: '1', name: 'Выбрать область' }]);

  const [cities] = useState<City[]>([{ id: '1', name: 'Выбрать город(а)' }]);

  const [topics] = useState<Topic[]>([{ id: '1', name: 'Тематика пабликов' }]);

  const [followers, setFollowers] = useState<number>(2568125);
  const [cost, setCost] = useState<number>(580000);
  const [categories, setCategories] = useState<Record<string, Category>>({
    small: { min: 5000, max: 100000, active: true },
    medium: { min: 100000, max: 500000, active: false },
    large: { min: 500000, max: 3000000, active: false },
  });

  const [publicResults] = useState<Public[]>([
    {
      id: '1',
      name: 'Это Казахстан Детка',
      subscribers: 140000,
      monthlyReach: 180000,
      costPerPost: 80000,
      avatar: '/next.svg',
    },
    {
      id: '2',
      name: 'Региональные Казахстан СМИ',
      subscribers: 201000,
      monthlyReach: 450000,
      costPerPost: 110000,
      avatar: '/next.svg',
    },
    {
      id: '3',
      name: 'Усть-Каменогорск/Oskemen',
      subscribers: 229000,
      monthlyReach: 480000,
      costPerPost: 135000,
      avatar: '/next.svg',
    },
    {
      id: '4',
      name: 'ШЫМКЕНТ / СЕМЕЙ 18',
      subscribers: 182000,
      monthlyReach: 360000,
      costPerPost: 75000,
      avatar: '/next.svg',
    },
    {
      id: '5',
      name: 'ГОРОД F – ЭТО СЕМЕЙТВ',
      subscribers: 102000,
      monthlyReach: 210000,
      costPerPost: 45000,
      avatar: '/next.svg',
    },
  ]);

  const toggleCategory = (key: string) => {
    setCategories((prev) => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active },
    }));
  };

  const handleFindPublics = () => {
    // In a real app, this would filter based on selected criteria
    console.log('Finding publics with selected filters');
  };

  const totalPublics = 129;
  const totalSubscribers = 4852000;
  const totalMonthlyReach = 6320000;
  const totalCost = 1125000;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">ПОДБОРКА ПАБЛИКОВ</h1>

      <Card className="p-8 bg-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <div className="relative">
              <Input
                type="text"
                placeholder={regions[0].name}
                className="py-2 pl-3 pr-10 bg-white"
                readOnly
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                ▼
              </div>
            </div>
          </div>

          <div>
            <div className="relative">
              <Input
                type="text"
                placeholder={cities[0].name}
                className="py-2 pl-3 pr-10 bg-white"
                readOnly
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                ▼
              </div>
            </div>
          </div>

          <div>
            <div className="relative">
              <Input
                type="text"
                placeholder={topics[0].name}
                className="py-2 pl-3 pr-10 bg-white"
                readOnly
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                ▼
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="text-sm">Каттегории пабликов по кол-ву подписчиков от - до</div>
          </div>

          <div className="col-span-2">
            <div className="flex gap-4">
              <PublicCategory
                label="5K - 100K"
                active={categories.small.active}
                onClick={() => toggleCategory('small')}
              />
              <PublicCategory
                label="100K - 500K"
                active={categories.medium.active}
                onClick={() => toggleCategory('medium')}
              />
              <PublicCategory
                label="500K - 3МЛН"
                active={categories.large.active}
                onClick={() => toggleCategory('large')}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">Выбор пабликов</span>
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="relative">
              <Input
                type="text"
                value={followers.toLocaleString()}
                onChange={(e) => setFollowers(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                className="py-2 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm">Стоимость размещения</div>
            <div className="relative flex-1">
              <Input
                type="text"
                value={`${cost.toLocaleString()} тенге`}
                onChange={(e) => setCost(parseInt(e.target.value.replace(/[^\d]/g, '')) || 0)}
                className="py-2 bg-white text-right"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            onClick={handleFindPublics}
          >
            подобрать
          </Button>
        </div>
      </Card>

      <div className="px-4">
        <h2 className="text-xl font-bold mb-6">ПОДОБРАТЬ ПО ВИДУ ДЕЯТЕЛЬНОСТИ</h2>

        <Card className="p-8 bg-blue-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Выбрать город(а)"
                  className="py-2 pl-3 pr-10 bg-white"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                  ▼
                </div>
              </div>
            </div>

            <div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ваш вид деятельности"
                  className="py-2 pl-3 pr-10 bg-white"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                  ▼
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="text-sm">
                <div className="flex items-center gap-1">
                  <span>Выборка пабликов</span>
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative flex-1">
                <Input
                  type="text"
                  value="580 000 тенге"
                  className="py-2 bg-white text-right"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
              подобрать
            </Button>
          </div>
        </Card>

        <h2 className="text-xl font-bold mb-6">РЕЗУЛЬТАТ ПОДБОРКИ</h2>

        <div className="bg-slate-100 p-4 mb-8 rounded-lg">
          {publicResults.map((pub) => (
            <PublicResult
              key={pub.id}
              avatar={pub.avatar}
              name={pub.name}
              subscribers={pub.subscribers}
              monthlyReach={pub.monthlyReach}
              costPerPost={pub.costPerPost}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 bg-green-100 p-4 rounded-lg text-center">
          <div>
            <div className="font-bold">КОЛ-ВО ПАБЛИКОВ</div>
            <div>{totalPublics}</div>
          </div>
          <div>
            <div className="font-bold">КОЛ-ВО ПОДПИСЧИКОВ</div>
            <div>{totalSubscribers.toLocaleString()}</div>
          </div>
          <div>
            <div className="font-bold">ОБЩИЙ МЕСЯЧНЫЙ ОХВАТ</div>
            <div>{totalMonthlyReach.toLocaleString()}</div>
          </div>
          <div>
            <div className="font-bold">ЦЕНА РАЗМЕЩЕНИЯ</div>
            <div>{totalCost.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
