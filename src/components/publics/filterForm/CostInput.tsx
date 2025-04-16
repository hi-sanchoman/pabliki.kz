'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

interface CostInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

export function CostInput({
  value,
  onChange,
  placeholder = 'Стоимость размещения',
}: CostInputProps) {
  const [displayValue, setDisplayValue] = useState(value ? value.toString() : '');

  useEffect(() => {
    setDisplayValue(value ? value.toString() : '');
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Only allow numbers
    const numbersOnly = rawValue.replace(/[^\d]/g, '');
    setDisplayValue(numbersOnly);

    const numericValue = numbersOnly ? parseInt(numbersOnly, 10) : 0;
    onChange(numericValue);
  };

  return (
    <div className="w-full relative">
      <Input
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-white pr-16"
      />
      {displayValue && (
        <div className="absolute right-3 top-0 bottom-0 flex items-center text-sm text-muted-foreground pointer-events-none">
          тенге
        </div>
      )}
    </div>
  );
}
