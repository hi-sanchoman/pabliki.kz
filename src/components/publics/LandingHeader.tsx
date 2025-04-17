'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function LandingHeader() {
  return (
    <header className="w-full bg-white py-4">
      <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/public/logo.svg"
              alt="Pabliki.KZ Logo"
              width={150}
              height={50}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-medium text-gray-900 hover:text-blue-600">
            Главная
          </Link>
          <Link
            href="#"
            className="font-medium text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Размещение в пабликах
          </Link>
          <Link href="#" className="font-medium text-gray-900 hover:text-blue-600">
            Кейсы
          </Link>
          <Link href="#" className="font-medium text-gray-900 hover:text-blue-600">
            Рекомендации
          </Link>
          <Link href="#" className="font-medium text-gray-900 hover:text-blue-600">
            партнеры
          </Link>
          <Link href="#" className="font-medium text-gray-900 hover:text-blue-600">
            По городам
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
            Личный кабинет
          </Button>
        </div>

        <button className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
