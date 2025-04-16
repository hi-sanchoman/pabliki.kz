'use client';

import { useState, useRef, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export type Region = {
  id: string;
  name: string;
};

// Mock data
export const regions: Region[] = [
  { id: '1', name: 'Акмолинская область' },
  { id: '2', name: 'Актюбинская область' },
  { id: '3', name: 'Алматинская область' },
  { id: '4', name: 'Восточно-Казахстанская область' },
  { id: '5', name: 'Жамбылская область' },
  { id: '6', name: 'Западно-Казахстанская область' },
  { id: '7', name: 'Карагандинская область' },
  { id: '8', name: 'Костанайская область' },
  { id: '9', name: 'Кызылординская область' },
  { id: '10', name: 'Мангистауская область' },
  { id: '11', name: 'Павлодарская область' },
  { id: '12', name: 'Северо-Казахстанская область' },
  { id: '13', name: 'Туркестанская область' },
  { id: '14', name: 'г. Алматы' },
  { id: '15', name: 'г. Астана' },
  { id: '16', name: 'г. Шымкент' },
];

interface RegionSelectProps {
  selectedRegions: Region[];
  onSelectRegion: (regions: Region[]) => void;
}

export function RegionSelect({ selectedRegions, onSelectRegion }: RegionSelectProps) {
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

  const handleToggleRegion = (region: Region) => {
    const isSelected = selectedRegions.some((r) => r.id === region.id);

    if (isSelected) {
      onSelectRegion(selectedRegions.filter((r) => r.id !== region.id));
    } else {
      onSelectRegion([...selectedRegions, region]);
    }
  };

  const removeRegion = (region: Region) => {
    onSelectRegion(selectedRegions.filter((r) => r.id !== region.id));
  };

  return (
    <div className="w-full space-y-2" ref={dropdownRef}>
      <div className="text-sm font-medium mb-1">Области</div>
      <div
        className="relative flex items-center border rounded-md px-3 py-2 h-10 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedRegions.length === 0 ? (
          <span className="text-muted-foreground">Выбрать область</span>
        ) : (
          <span>Выбрано: {selectedRegions.length}</span>
        )}
      </div>

      {selectedRegions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedRegions.map((region) => (
            <Badge
              key={region.id}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => removeRegion(region)}
            >
              <span className="truncate">{region.name}</span>
              <X
                className="h-3 w-3 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeRegion(region);
                }}
              />
            </Badge>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 border rounded-md mt-1 bg-white shadow-lg max-h-56 overflow-y-auto w-96">
          <div className="p-2 space-y-1">
            {regions.map((region) => (
              <div
                key={region.id}
                className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer"
                onClick={() => handleToggleRegion(region)}
              >
                <Checkbox
                  id={`region-${region.id}`}
                  checked={selectedRegions.some((r) => r.id === region.id)}
                  onCheckedChange={() => handleToggleRegion(region)}
                  onClick={(e) => e.stopPropagation()}
                />
                <label htmlFor={`region-${region.id}`} className="text-sm cursor-pointer flex-1">
                  {region.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
