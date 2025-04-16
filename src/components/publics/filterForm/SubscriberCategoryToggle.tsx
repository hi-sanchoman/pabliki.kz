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
        className="flex flex-wrap justify-start w-full gap-2"
      >
        <ToggleGroupItem
          value="small"
          className="flex items-center h-10 text-sm cursor-pointer hover:bg-gray-50 data-[state=on]:bg-white data-[state=on]:border-blue-500"
        >
          <span className="text-black">5K - 100K</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="medium"
          className="flex items-center h-10 text-sm cursor-pointer hover:bg-gray-50 data-[state=on]:bg-white data-[state=on]:border-blue-500"
        >
          <span className="text-black">100K - 500K</span>
        </ToggleGroupItem>

        <ToggleGroupItem
          value="large"
          className="flex items-center h-10 text-sm cursor-pointer hover:bg-gray-50 data-[state=on]:bg-white data-[state=on]:border-blue-500"
        >
          <span className="text-black">500K - 3M</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
