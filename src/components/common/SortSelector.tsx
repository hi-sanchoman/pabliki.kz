'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type SortOption = {
  id: string;
  label: string;
};

const sortOptionsList: SortOption[] = [
  { id: 'recent', label: 'Recent' },
  { id: 'oldest', label: 'Oldest' },
  { id: 'name-asc', label: 'Name (A-Z)' },
  { id: 'name-desc', label: 'Name (Z-A)' },
  { id: 'most-visited', label: 'Most Visited' },
];

export function SortSelector() {
  const { t, ready } = useTranslation();
  const [selectedSort, setSelectedSort] = useState<string>('recent');
  const [mounted, setMounted] = useState(false);

  const { data: sortOptions = [], isLoading } = useQuery({
    queryKey: ['sortOptions'],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!mounted || !ready) {
        return sortOptionsList;
      }

      return [
        { id: 'recent', label: t('sort.recent') || 'Recent' },
        { id: 'oldest', label: t('sort.oldest') || 'Oldest' },
        { id: 'name-asc', label: t('sort.name_asc') || 'Name (A-Z)' },
        { id: 'name-desc', label: t('sort.name_desc') || 'Name (Z-A)' },
        { id: 'most-visited', label: t('sort.most_visited') || 'Most Visited' },
      ];
    },
  });

  // Fix for hydration mismatch - only render translated content client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const getCurrentSortLabel = (): string => {
    const option = sortOptions.find((option) => option.id === selectedSort);
    if (option) return option.label;
    return mounted && ready ? t('sort.recent') : 'Recent';
  };

  const currentSortLabel = getCurrentSortLabel();

  const handleSortChange = (sortId: string) => {
    setSelectedSort(sortId);
    // Here you would handle the actual sorting logic or pass to a parent component
  };

  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="h-4 w-8 rounded bg-slate-300 dark:bg-slate-600 animate-pulse mr-2" />
        <div className="h-9 w-[120px] rounded bg-slate-300 dark:bg-slate-600 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <span className="text-gray-500 mr-2 text-sm font-medium">
        {mounted && ready ? t('sort.sort') : 'Sort'}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-4 min-w-[120px] justify-between cursor-pointer"
          >
            <span className="text-sm font-medium">{currentSortLabel}</span>
            <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => handleSortChange(option.id)}
              className="flex cursor-pointer items-center justify-between text-sm font-medium"
            >
              {option.label}
              {selectedSort === option.id && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
