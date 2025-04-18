import { Metadata } from 'next';
import './styles.css';
import '@/components/landing/ui-fixes.css';
import { ThemeProvider } from '@/components/landing/theme-provider';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pabliki.kz - Размещение рекламы в Instagram пабликах Казахстана',
  description:
    'Самая большая база пабликов Instagram по всей Республике Казахстан. Размещайте рекламу в популярных пабликах по всему Казахстану.',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
      disableTransitionOnChange
    >
      <div className={`${inter.className} bg-white landing-page-root`}>{children}</div>
    </ThemeProvider>
  );
}
