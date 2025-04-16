'use client';

import { useState, useEffect, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Region } from './RegionSelect';

export type City = {
  id: string;
  name: string;
  regionId: string;
};

// Mock data
export const cities: City[] = [
  { id: '1', name: 'Астана', regionId: '15' },
  { id: '2', name: 'Алматы', regionId: '14' },
  { id: '3', name: 'Шымкент', regionId: '16' },
  { id: '4', name: 'Караганда', regionId: '7' },
  { id: '5', name: 'Актобе', regionId: '2' },
  { id: '6', name: 'Тараз', regionId: '5' },
  { id: '7', name: 'Павлодар', regionId: '11' },
  { id: '8', name: 'Усть-Каменогорск', regionId: '4' },
  { id: '9', name: 'Семей', regionId: '4' },
  { id: '10', name: 'Атырау', regionId: '6' },
  { id: '11', name: 'Костанай', regionId: '8' },
  { id: '12', name: 'Кызылорда', regionId: '9' },
  { id: '13', name: 'Уральск', regionId: '6' },
  { id: '14', name: 'Петропавловск', regionId: '12' },
  { id: '15', name: 'Актау', regionId: '10' },
  { id: '16', name: 'Темиртау', regionId: '7' },
  { id: '17', name: 'Кокшетау', regionId: '1' },
  { id: '18', name: 'Туркестан', regionId: '13' },
  { id: '19', name: 'Экибастуз', regionId: '11' },
  { id: '20', name: 'Талдыкорган', regionId: '3' },
];

interface CitySelectProps {
  selectedRegions: Region[];
  selectedCities: City[];
  onSelectCity: (cities: City[]) => void;
}

export function CitySelect({ selectedRegions, selectedCities, onSelectCity }: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
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

  useEffect(() => {
    if (selectedRegions.length === 0) {
      setFilteredCities(cities);
    } else {
      const regionIds = selectedRegions.map((region) => region.id);
      setFilteredCities(cities.filter((city) => regionIds.includes(city.regionId)));
    }
  }, [selectedRegions]);

  const handleToggleCity = (city: City) => {
    const isSelected = selectedCities.some((c) => c.id === city.id);

    if (isSelected) {
      onSelectCity(selectedCities.filter((c) => c.id !== city.id));
    } else {
      onSelectCity([...selectedCities, city]);
    }
  };

  const removeCity = (city: City) => {
    onSelectCity(selectedCities.filter((c) => c.id !== city.id));
  };

  return (
    <div className="w-full space-y-2" ref={dropdownRef}>
      <div className="text-sm font-medium mb-1">Города</div>
      <div
        className="relative flex items-center border rounded-md px-3 py-2 h-10 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCities.length === 0 ? (
          <span className="text-muted-foreground">Выбрать город(а)</span>
        ) : (
          <span>Выбрано: {selectedCities.length}</span>
        )}
      </div>

      {selectedCities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedCities.map((city) => (
            <Badge
              key={city.id}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => removeCity(city)}
            >
              <span className="truncate">{city.name}</span>
              <X
                className="h-3 w-3 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeCity(city);
                }}
              />
            </Badge>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 border rounded-md mt-1 bg-white shadow-lg max-h-56 overflow-y-auto w-96">
          <div className="p-2 space-y-1">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-md cursor-pointer"
                  onClick={() => handleToggleCity(city)}
                >
                  <Checkbox
                    id={`city-${city.id}`}
                    checked={selectedCities.some((c) => c.id === city.id)}
                    onCheckedChange={() => handleToggleCity(city)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={`city-${city.id}`} className="text-sm cursor-pointer flex-1">
                    {city.name}
                  </label>
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                {selectedRegions.length === 0
                  ? 'Выберите область для отображения городов'
                  : 'В выбранной области нет городов'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
