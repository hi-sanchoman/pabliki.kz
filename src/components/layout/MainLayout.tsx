'use client';

import { ReactNode, useState } from 'react';
import { UniversalHeader } from './UniversalHeader';
import { Sidebar } from './Sidebar';

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <UniversalHeader onSidebarToggle={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <main
        className={`flex-1 pt-16 transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}
      >
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
