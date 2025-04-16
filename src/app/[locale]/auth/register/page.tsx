import { Metadata } from 'next';
import { AuthForm } from '@/components/auth/auth-form';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata(): Metadata {
  return {
    title: 'Register',
    description: 'Create a new account',
  };
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;

  return (
    <div className="container-full flex h-screen w-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AuthForm
          type="register"
          title="Register"
          description="Create a new account"
          redirectPath="/"
          alternateLink={`/${locale}/auth/login`}
          alternateLinkText="Already have an account"
          locale={locale}
        />
      </div>
    </div>
  );
}
