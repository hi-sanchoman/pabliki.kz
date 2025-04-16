import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/lib/react-query';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';
import NextAuthProvider from '@/components/auth/next-auth-provider';
import { ThemeProvider } from 'next-themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Linklot',
  description: 'A professional Next.js application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F7F7FA] dark:bg-slate-900`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthProvider>
            <ReactQueryProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
              <Toaster />
            </ReactQueryProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
