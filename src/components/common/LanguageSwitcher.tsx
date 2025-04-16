'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Globe } from 'lucide-react';

const locales = [
  { code: 'ru', name: 'Русский' },
  // { code: 'en', name: 'English' },
  // { code: 'es', name: 'Español' }
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  // Combine loading states
  const isChangingLanguage = isPending || isLoading;

  const currentLocale = pathname.split('/')[1];

  function handleLanguageChange(locale: string) {
    if (locale === currentLocale) return;

    setIsLoading(true);

    // Set cookie for middleware
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    // Redirect to the same page but with the new locale
    const newPathname = pathname.replace(/^\/[^\/]+/, `/${locale}`);

    startTransition(() => {
      router.push(newPathname);
      router.refresh();
      setIsLoading(false);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isChangingLanguage}>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only">Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLanguageChange(locale.code)}
            disabled={isChangingLanguage}
            className="flex items-center justify-between cursor-pointer"
          >
            {locale.name}
            {currentLocale === locale.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
