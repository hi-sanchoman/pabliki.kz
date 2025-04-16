import { redirect } from 'next/navigation';

export default function RedirectToLocalizedRegister() {
  redirect('/ru/auth/register');
}
