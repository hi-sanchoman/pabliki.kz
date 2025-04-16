'use client';

import { useState, useEffect } from 'react';
import { Globe, FolderIcon, Plus } from 'lucide-react';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/i18n/client';
import { useQuery } from '@tanstack/react-query';

type Lot = {
  id: string;
  name: string;
  color?: string;
};

// Mock data for lots
const mockLots: Lot[] = [
  { id: 'productivity', name: 'Productivity', color: '#10B981' }, // emerald
  { id: 'research', name: 'Research', color: '#0EA5E9' }, // sky blue
  { id: 'dev-tools', name: 'Dev Tools', color: '#F59E0B' }, // amber
  { id: 'music', name: 'Music Production', color: '#EC4899' }, // pink
];

export function LotSelector() {
  const { t, ready } = useTranslation();
  const [selectedLot, setSelectedLot] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  const { data: lots = [], isLoading } = useQuery({
    queryKey: ['lots'],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockLots;
    },
  });

  // Helper function to create a lighter version of a color for hover state
  const getLighterColor = (hexColor: string, opacity: number = 0.15): string => {
    return (
      hexColor +
      Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0')
    );
  };

  // Fix for hydration mismatch - only render translated content client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-6 py-6 overflow-x-auto scrollbar-thin">
        {/* All Links skeleton */}
        <div className="h-9 w-28 rounded-lg bg-slate-300 dark:bg-slate-600 animate-pulse" />

        {/* Lot skeletons */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-32 rounded-lg bg-slate-300 dark:bg-slate-600 animate-pulse"
          />
        ))}

        {/* New Lot skeleton */}
        <div className="h-9 w-24 rounded-lg bg-slate-300 dark:bg-slate-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-6 py-6 overflow-x-auto scrollbar-thin">
      {/* All Links button with black background */}
      <button
        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-colors ${
          selectedLot === 'all'
            ? 'bg-black dark:bg-white text-white dark:text-black'
            : 'bg-transparent hover:bg-gray-200 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
        onClick={() => setSelectedLot('all')}
      >
        <Globe className="h-5 w-5 mr-2" />
        <span className="font-medium text-sm">
          {/* Use static content on server, translated content only on client */}
          {mounted && ready ? t('lot.all_links') : 'All Links'}
        </span>
      </button>

      {/* Lot buttons with folder icons */}
      {lots.map((lot) => (
        <button
          key={lot.id}
          className={`flex items-center rounded px-2 py-1.5 cursor-pointer transition-all ${
            selectedLot === lot.id
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          style={{
            backgroundColor:
              selectedLot === lot.id
                ? getLighterColor(lot.color || '#000000', 0.15)
                : 'transparent',
          }}
          onClick={() => setSelectedLot(lot.id)}
          onMouseOver={(e) => {
            if (selectedLot !== lot.id) {
              e.currentTarget.style.backgroundColor = getLighterColor(lot.color || '#000000', 0.1);
            }
          }}
          onMouseOut={(e) => {
            if (selectedLot !== lot.id) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <FolderIcon
            className="h-5 w-5 mr-2"
            style={{ color: lot.color }}
            fill={selectedLot === lot.id ? lot.color : lot.color}
            strokeWidth={selectedLot === lot.id ? 2 : 1.5}
          />
          <span className="font-medium text-sm">{lot.name}</span>
        </button>
      ))}

      {/* New Lot button */}
      <button
        className="flex items-center bg-transparent hover:bg-gray-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors rounded px-3 py-1.5"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colors.background.secondary;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Plus className="h-5 w-5 mr-2" strokeWidth={1.5} />
        <span className="font-medium text-sm">
          {/* Use static content on server, translated content only on client */}
          {mounted && ready ? t('lot.new_lot') : 'New Lot'}
        </span>
      </button>
    </div>
  );
}
