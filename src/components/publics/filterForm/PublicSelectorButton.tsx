'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export type Public = {
  id: string;
  name: string;
  subscribers: number;
  monthlyReach: number;
  costPerPost: number;
  avatar: string;
};

// Mock data
export const publics: Public[] = [
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
  {
    id: '6',
    name: 'Весь Казахстан',
    subscribers: 104000,
    monthlyReach: 220000,
    costPerPost: 50000,
    avatar: '/next.svg',
  },
  {
    id: '7',
    name: 'Шымкент: Новости/Работа/Объявления',
    subscribers: 182000,
    monthlyReach: 330000,
    costPerPost: 75000,
    avatar: '/next.svg',
  },
  {
    id: '8',
    name: 'Региональные Мероприятия',
    subscribers: 104000,
    monthlyReach: 180000,
    costPerPost: 45000,
    avatar: '/next.svg',
  },
];

interface PublicSelectorButtonProps {
  selectedPublics: Public[];
  onSelectPublics: (publics: Public[]) => void;
}

export function PublicSelectorButton({
  selectedPublics,
  onSelectPublics,
}: PublicSelectorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSelected, setLocalSelected] = useState<Public[]>(selectedPublics);

  // Add select all functionality
  const handleSelectAll = () => {
    if (localSelected.length === publics.length) {
      // If all are selected, deselect all
      setLocalSelected([]);
    } else {
      // Otherwise select all
      setLocalSelected([...publics]);
    }
  };

  const togglePublic = (pub: Public) => {
    const isSelected = localSelected.some((p) => p.id === pub.id);

    if (isSelected) {
      setLocalSelected(localSelected.filter((p) => p.id !== pub.id));
    } else {
      setLocalSelected([...localSelected, pub]);
    }
  };

  const handleSubmit = () => {
    onSelectPublics(localSelected);
    setIsOpen(false);
  };

  // Calculate total metrics
  const totalSubscribers = localSelected.reduce((sum, pub) => sum + pub.subscribers, 0);
  const totalCost = localSelected.reduce((sum, pub) => sum + pub.costPerPost, 0);

  const formatNumber = (num: number) => num.toLocaleString('ru-RU');

  return (
    <div className="w-full">
      <div className="text-sm font-medium mb-1">Паблики</div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full h-10 justify-between bg-white">
            <span className={selectedPublics.length === 0 ? 'text-muted-foreground' : ''}>
              {selectedPublics.length === 0
                ? 'Выбор пабликов'
                : `Выбрано: ${selectedPublics.length}`}
            </span>
            {selectedPublics.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {selectedPublics.length}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Выбор пабликов</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-[40px_1fr_150px_150px] gap-x-8 px-4 py-2 border-b font-medium text-sm">
            <div>
              <Checkbox
                checked={localSelected.length === publics.length}
                onCheckedChange={handleSelectAll}
                aria-label="Выбрать все"
              />
            </div>
            <div>Паблики</div>
            <div className="text-right">Подписчики</div>
            <div className="text-right">Цена (тенге)</div>
          </div>

          <ScrollArea className="h-[300px]">
            {publics.map((pub) => (
              <div
                key={pub.id}
                className="grid grid-cols-[40px_1fr_150px_150px] gap-x-8 px-4 py-3 border-b hover:bg-slate-50 cursor-pointer items-center"
                onClick={() => togglePublic(pub)}
              >
                <div>
                  <Checkbox
                    checked={localSelected.some((p) => p.id === pub.id)}
                    onCheckedChange={() => {}}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <div className="relative w-full h-full">
                      <Image
                        src={pub.avatar}
                        alt={pub.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/next.svg';
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm">{pub.name}</div>
                </div>
                <div className="text-right text-sm">{formatNumber(pub.subscribers)}</div>
                <div className="text-right text-sm">{formatNumber(pub.costPerPost)}</div>
              </div>
            ))}
          </ScrollArea>

          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Кол-во пабликов</div>
                <div className="font-bold">{localSelected.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Подписчики</div>
                <div className="font-bold">{formatNumber(totalSubscribers)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Общая стоимость</div>
                <div className="font-bold">{formatNumber(totalCost)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSubmit}>Подтвердить выбор</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
