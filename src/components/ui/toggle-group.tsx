'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '@/lib/utils';

const ToggleGroupContext = React.createContext<{
  variant: 'default' | 'outline' | 'primary';
  size: 'default' | 'sm' | 'lg';
}>({
  variant: 'default',
  size: 'default',
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & {
    variant?: 'default' | 'outline' | 'primary';
    size?: 'default' | 'sm' | 'lg';
  }
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => (
  <ToggleGroupContext.Provider value={{ variant, size }}>
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  </ToggleGroupContext.Provider>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & {
    variant?: 'default' | 'outline' | 'primary';
    size?: 'default' | 'sm' | 'lg';
  }
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);
  const variantToUse = variant || context.variant;
  const sizeToUse = size || context.size;

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',

        variantToUse === 'default' &&
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        variantToUse === 'outline' &&
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        variantToUse === 'primary' &&
          'bg-primary text-primary-foreground shadow hover:bg-primary/90 data-[state=on]:bg-primary/80',

        sizeToUse === 'default' && 'h-9 px-3',
        sizeToUse === 'sm' && 'h-8 px-2',
        sizeToUse === 'lg' && 'h-10 px-3',

        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
