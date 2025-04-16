import { redirect } from 'next/navigation';

export default function RedirectToLocalizedLogin() {
  redirect('/ru/auth/login');
}
