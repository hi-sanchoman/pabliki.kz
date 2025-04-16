'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ProfileMenu } from '@/components/common/ProfileMenu';
import { Settings, Search } from 'lucide-react';
import { useTranslation } from '@/i18n/client';

export function Header() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10">
      <div className="container-full flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            Pabliki.kz
          </Link>

          <div className="relative max-w-md w-[400px]">
            <Input
              type="text"
              placeholder={t('common.search') || 'Search by URL, title, or tags...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            variant="ghost"
            size="icon"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <LanguageSwitcher />

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
