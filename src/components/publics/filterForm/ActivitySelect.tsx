'use client';

import { useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export type Activity = {
  id: string;
  name: string;
};

// Mock data
export const activities: Activity[] = [
  { id: '1', name: 'Розничная торговля' },
  { id: '2', name: 'Оптовая торговля' },
  { id: '3', name: 'Рестораны и кафе' },
  { id: '4', name: 'Гостиничный бизнес' },
  { id: '5', name: 'Образование' },
  { id: '6', name: 'Красота и здоровье' },
  { id: '7', name: 'Строительство' },
  { id: '8', name: 'Недвижимость' },
  { id: '9', name: 'Производство' },
  { id: '10', name: 'IT и технологии' },
  { id: '11', name: 'Финансы и страхование' },
  { id: '12', name: 'Транспорт и логистика' },
  { id: '13', name: 'Развлечения и досуг' },
  { id: '14', name: 'Спорт и фитнес' },
  { id: '15', name: 'Маркетинг и реклама' },
];

interface ActivitySelectProps {
  selectedActivities: Activity[];
  onSelectActivity: (activities: Activity[]) => void;
}

export function ActivitySelect({ selectedActivities, onSelectActivity }: ActivitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleActivity = (activity: Activity) => {
    const isSelected = selectedActivities.some((a) => a.id === activity.id);

    if (isSelected) {
      onSelectActivity(selectedActivities.filter((a) => a.id !== activity.id));
    } else {
      onSelectActivity([...selectedActivities, activity]);
    }
  };

  const removeActivity = (activity: Activity) => {
    onSelectActivity(selectedActivities.filter((a) => a.id !== activity.id));
  };

  return (
    <div className="w-full space-y-2" ref={dropdownRef}>
      <div className="text-sm font-medium mb-1">Ваш вид деятельности</div>
      <div
        className="relative flex items-center border rounded-md px-3 py-2 h-10 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedActivities.length === 0 ? (
          <span className="text-muted-foreground">Выбрать вид деятельности</span>
        ) : (
          <span>Выбрано: {selectedActivities.length}</span>
        )}
      </div>

      {selectedActivities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedActivities.map((activity) => (
            <Badge
              key={activity.id}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => removeActivity(activity)}
            >
              <span className="truncate">{activity.name}</span>
              <X
                className="h-3 w-3 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeActivity(activity);
                }}
              />
            </Badge>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 border rounded-md mt-1 bg-white shadow-lg max-h-56 overflow-y-auto w-full">
          <div className="p-2 space-y-1">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer"
                onClick={() => handleToggleActivity(activity)}
              >
                <Checkbox
                  id={`activity-${activity.id}`}
                  checked={selectedActivities.some((a) => a.id === activity.id)}
                  onCheckedChange={() => handleToggleActivity(activity)}
                  onClick={(e) => e.stopPropagation()}
                />
                <label
                  htmlFor={`activity-${activity.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {activity.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
