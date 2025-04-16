'use client';

import { LotSelector } from './LotSelector';
import { SortSelector } from '@/components/common/SortSelector';

export function FilterBar() {
  return (
    <div className="flex mt-16 items-center justify-between">
      <div className="flex-grow overflow-x-auto">
        <LotSelector />
      </div>
      <div className="flex-shrink-0 px-6">
        <SortSelector />
      </div>
    </div>
  );
}
