'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Bell, LogOut, User, ChevronDown, Wallet } from 'lucide-react';

interface UniversalHeaderProps {
  onSidebarToggle: () => void;
}

export function UniversalHeader({ onSidebarToggle }: UniversalHeaderProps) {
  return (
    <header className="bg-white rounded-lg shadow-sm p-2 fixed top-0 left-0 right-0 z-30 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button className="p-1.5 hover:bg-slate-100 rounded-md" onClick={onSidebarToggle}>
          <Menu className="h-5 w-5 text-slate-600" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 hover:bg-slate-100 p-1.5 rounded-md">
            <Avatar className="h-7 w-7">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Менеджер</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Профиль</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center">
          <span className="font-bold text-lg">pabliki.</span>
          <div className="bg-blue-500 text-white rounded px-1 text-sm font-bold flex items-center justify-center">
            KZ
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-xl font-medium">Основная админ панель</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="p-1.5 hover:bg-slate-100 rounded-md">
          <Bell className="h-5 w-5 text-blue-500" />
        </button>

        <button className="p-1.5 hover:bg-slate-100 rounded-md">
          <Wallet className="h-5 w-5 text-slate-500" />
        </button>

        <Link
          href="/profile"
          className="flex items-center gap-2 hover:bg-slate-100 p-1.5 rounded-md"
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-slate-200 text-slate-500">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">Личный кабинет</span>
        </Link>
      </div>
    </header>
  );
}
