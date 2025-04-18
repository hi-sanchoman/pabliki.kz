'use client';

import { Link } from '@/components/landing/ui/link';
import Image from 'next/image';

const resources = [
  { title: 'О проекте', href: '/about' },
  { title: 'Публикации', href: '/posts' },
  { title: 'Новости', href: '/news' },
  { title: 'Контакты', href: '/contact' },
];

const support = [
  { title: 'FAQ', href: '/faq' },
  { title: 'Поддержка', href: '/help' },
];

const company = [
  { title: 'Почему pabliki.kz', href: '/why' },
  { title: 'Политика конфиденциальности', href: '/privacy' },
  { title: 'Условия использования', href: '/terms' },
];

export function FooterSection() {
  return (
    <footer className="bg-slate-950 text-white py-16">
      <div className="container grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Image src="/logo-white.svg" alt="Pabliki.kz Logo" width={40} height={40} />
            <span className="text-xl font-bold">pabliki.kz</span>
          </div>
          <p className="text-slate-400 max-w-xs">
            Крупнейший сервис размещения рекламы в Instagram-пабликах по всему Казахстану
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6">Разделы</h3>
          <ul className="space-y-4">
            {resources.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className="hover:text-blue-400 transition-colors">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6">Поддержка</h3>
          <ul className="space-y-4">
            {support.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className="hover:text-blue-400 transition-colors">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-bold mb-6 mt-8">Компания</h3>
          <ul className="space-y-4">
            {company.map((item) => (
              <li key={item.title}>
                <Link href={item.href} className="hover:text-blue-400 transition-colors">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-6">Связаться с нами</h3>
          <div className="space-y-4 text-slate-400">
            <p>г. Алматы, ул. Ауезова, 126, офис 333</p>
            <p>+7 (777) 222-33-44</p>
            <p>info@pabliki.kz</p>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Link href="https://instagram.com/pabliki.kz">
              <Image
                src="/icons/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
                className="hover:opacity-80 transition"
              />
            </Link>
            <Link href="https://t.me/pabliki_kz">
              <Image
                src="/icons/telegram.svg"
                alt="Telegram"
                width={24}
                height={24}
                className="hover:opacity-80 transition"
              />
            </Link>
            <Link href="https://vk.com/pabliki.kz">
              <Image
                src="/icons/vk.svg"
                alt="VK"
                width={24}
                height={24}
                className="hover:opacity-80 transition"
              />
            </Link>
            <Link href="https://wa.me/77772223344">
              <Image
                src="/icons/whatsapp.svg"
                alt="WhatsApp"
                width={24}
                height={24}
                className="hover:opacity-80 transition"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="container mt-12 pt-6 border-t border-slate-800 text-slate-400 text-sm">
        © 2024 Pabliki.kz. Все права защищены.
      </div>
    </footer>
  );
}
