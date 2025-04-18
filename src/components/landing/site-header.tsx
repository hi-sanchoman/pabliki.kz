'use client';

import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/landing/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/landing/ui/navigation-menu';

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Размещение в пабликах', href: '#placement' },
  { name: 'Карта покрытия по РК', href: '#coverage' },
  { name: 'Кейсы', href: '#cases' },
  { name: 'По городам', href: '#cities' },
];

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">pabliki</span>
            <span className="rounded bg-blue-600 px-1.5 py-0.5 text-sm font-semibold text-white">
              .KZ
            </span>
          </Link>
        </div>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigation.map((item) => (
              <NavigationMenuItem key={item.name} className="px-1">
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-all hover:text-primary hover:scale-105 data-[active]:text-primary focus:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="outline" className="hidden md:flex" style={{ borderColor: '#E5E7EB' }}>
            <Instagram className="mr-2 h-4 w-4" />
            Личный кабинет
          </Button>
        </div>
      </div>
    </header>
  );
}
