'use client';

import { Suspense } from 'react';
import ReactQueryProvider from '@/lib/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { PublicSelectorTabs } from '@/components/publics/PublicSelectorTabs';

function HomePage() {
  return (
    <MainLayout>
      <PublicSelectorTabs />
    </MainLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactQueryProvider>
        <HomePage />
      </ReactQueryProvider>
    </Suspense>
  );
}
