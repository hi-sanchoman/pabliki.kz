'use client';

import { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

// Define the subscriber range categories
export type SubscriberRange = 'small' | 'medium' | 'large';

interface SubscriberCategoryToggleProps {
  value: SubscriberRange[];
  onChange: (value: SubscriberRange[]) => void;
}

export function SubscriberCategoryToggle({ value, onChange }: SubscriberCategoryToggleProps) {
  const [selectedRanges, setSelectedRanges] = useState<SubscriberRange[]>(value);

  useEffect(() => {
    setSelectedRanges(value);
  }, [value]);

  const handleValueChange = (newValue: string[]) => {
    const newRanges = newValue as SubscriberRange[];
    setSelectedRanges(newRanges);
    onChange(newRanges);
  };

  return (
    <div className="w-full space-y-2">
      <div className="text-sm font-medium mb-1">Категории пабликов по кол-ву подписчиков</div>

      <ToggleGroup
        type="multiple"
        value={selectedRanges}
        onValueChange={handleValueChange}
        className="flex justify-start w-full gap-3"
      >
        <ToggleGroupItem
          value="small"
          className="flex items-center gap-2 data-[state=on]:bg-green-100 data-[state=on]:border-green-500 data-[state=on]:text-green-700"
        >
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span>5K - 100K</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="medium"
          className="flex items-center gap-2 data-[state=on]:bg-blue-100 data-[state=on]:border-blue-500 data-[state=on]:text-blue-700"
        >
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span>100K - 500K</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="large"
          className="flex items-center gap-2 data-[state=on]:bg-purple-100 data-[state=on]:border-purple-500 data-[state=on]:text-purple-700"
        >
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
          <span>500K - 3M</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
