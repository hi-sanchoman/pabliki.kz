import type { Metadata } from 'next';
import '@/app/globals.css';
import { ClientErrorBoundary } from '@/components/common/ClientErrorBoundary';
import { I18nProvider } from '@/i18n/client';

export const metadata: Metadata = {
  title: 'Pabliki',
  description: 'An application',
};

type LocaleParams = Promise<{ locale: string }>;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LocaleParams;
}) {
  // We need to await params for Next.js compatibility
  await params; // Just await params without storing locale if not using it

  return (
    <I18nProvider>
      <ClientErrorBoundary>{children}</ClientErrorBoundary>
    </I18nProvider>
  );
}
