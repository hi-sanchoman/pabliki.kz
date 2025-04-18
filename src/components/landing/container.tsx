'use client';

import { cn } from '@/components/landing/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn('container mx-auto px-4 max-w-7xl', className)} {...props}>
      {children}
    </div>
  );
}
