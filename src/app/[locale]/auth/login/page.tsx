import { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata(): Metadata {
  return {
    title: 'Login',
    description: 'Login to your account',
  };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="container-full flex h-screen w-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AuthForm
          type="login"
          title="Login"
          description="Enter your credentials to sign in to your account"
          redirectPath="/"
          alternateLink={`/${locale}/auth/register`}
          alternateLinkText="Create an account"
          locale={locale}
        />
      </div>
    </div>
  );
}
