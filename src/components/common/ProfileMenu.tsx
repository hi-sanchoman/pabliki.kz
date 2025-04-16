'use client';

import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { LogOut, User } from 'lucide-react';
import { useTranslation } from '@/i18n/client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ProfileMenu() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const pathname = usePathname();
  // Add hydration safety using a client-side effect
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the current locale from the URL
  const getLocaleFromPath = () => {
    if (!pathname) return 'ru';
    const segments = pathname.split('/');
    return segments.length > 1 && ['ru', 'en', 'es'].includes(segments[1]) ? segments[1] : 'ru';
  };

  const locale = getLocaleFromPath();

  // We're removing the automatic redirect to login
  // This allows guests to view public pages

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}/auth/login` });
  };

  // Get initials from user name or email
  const getUserInitials = () => {
    if (!session?.user?.name && !session?.user?.email) return 'U';

    if (session.user.name) {
      return session.user.name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    return session.user.email?.charAt(0).toUpperCase() || 'U';
  };

  // If not authenticated or loading, don't render menu
  if (status !== 'authenticated') {
    return <ThemeToggle />;
  }

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none cursor-pointer">
          <Avatar>
            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex flex-col p-2 gap-1">
            <p className="font-medium truncate">
              {session?.user?.name || session?.user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{isClient ? t('profile.profile') : 'Profile'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isClient ? t('auth.logout') : 'Logout'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
