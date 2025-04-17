import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Подборка пабликов | Pabliki.kz',
  description: 'Выберите подходящие паблики для вашей рекламной кампании',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
