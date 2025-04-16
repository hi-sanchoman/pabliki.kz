'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Public } from './filterForm/PublicSelectorButton';

interface PublicResultsTableProps {
  publics: Public[];
  selectedPublics: Public[];
  onSelectPublics: (publics: Public[]) => void;
}

export function PublicResultsTable({
  publics,
  selectedPublics,
  onSelectPublics,
}: PublicResultsTableProps) {
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Update selectAll checkbox state based on whether all items are selected
    setSelectAll(selectedPublics.length === publics.length);
  }, [selectedPublics, publics]);

  const toggleSelectAll = () => {
    if (selectAll) {
      onSelectPublics([]);
    } else {
      onSelectPublics([...publics]);
    }
    setSelectAll(!selectAll);
  };

  const togglePublic = (pub: Public) => {
    const isSelected = selectedPublics.some((p) => p.id === pub.id);

    if (isSelected) {
      onSelectPublics(selectedPublics.filter((p) => p.id !== pub.id));
    } else {
      onSelectPublics([...selectedPublics, pub]);
    }
  };

  // Calculate total metrics
  const totalSubscribers = selectedPublics.reduce((sum, pub) => sum + pub.subscribers, 0);
  const totalCost = selectedPublics.reduce((sum, pub) => sum + pub.costPerPost, 0);

  const formatNumber = (num: number) => num.toLocaleString('ru-RU');

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-[40px_1fr_150px_150px] gap-x-8 px-4 py-3 border-b font-medium text-sm bg-gray-50">
        <div>
          <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} />
        </div>
        <div>ПАБЛИКИ</div>
        <div className="text-right">
          КОЛ-ВО
          <br />
          ПОДПИСЧИКОВ
        </div>
        <div className="text-right">
          ЦЕНА
          <br />
          ПОСТ + СТОРИС
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {publics.map((pub) => (
          <div
            key={pub.id}
            className="grid grid-cols-[40px_1fr_150px_150px] gap-x-8 px-4 py-3 border-b hover:bg-slate-50 cursor-pointer items-center"
            onClick={() => togglePublic(pub)}
          >
            <div>
              <Checkbox
                checked={selectedPublics.some((p) => p.id === pub.id)}
                onCheckedChange={() => {}}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={pub.avatar}
                  alt={pub.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/next.svg';
                  }}
                />
              </div>
              <div className="text-sm">{pub.name}</div>
            </div>
            <div className="text-right text-sm">{formatNumber(pub.subscribers)}</div>
            <div className="text-right text-sm">{formatNumber(pub.costPerPost)}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[40px_1fr_150px_150px] gap-x-8 px-4 py-3 border-t bg-blue-100 font-medium">
        <div>
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
            {selectedPublics.length}
          </div>
        </div>
        <div className="flex items-center">КОЛ-ВО ПАБЛИКОВ: {selectedPublics.length}</div>
        <div className="text-right">{formatNumber(totalSubscribers)}</div>
        <div className="text-right">{formatNumber(totalCost)}</div>
      </div>
    </Card>
  );
}
