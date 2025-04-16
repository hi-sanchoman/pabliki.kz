import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata(): Metadata {
  return {
    title: 'Authentication Error',
    description: 'An error occurred during authentication',
  };
}

export default async function AuthErrorPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="container-full flex h-screen w-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
      <div className="mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[400px]">
        <h1 className="text-2xl font-semibold tracking-tight dark:text-white">
          Authentication Error
        </h1>
        <p className="text-sm text-muted-foreground text-center dark:text-zinc-400">
          An error occurred during authentication. Please try again.
        </p>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/${locale}/auth/login`}>Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
