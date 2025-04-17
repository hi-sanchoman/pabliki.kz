'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { menuData } from '@/constants/navigation';
import {
  Home,
  Send,
  BarChart3,
  Coins,
  Bell,
  FileCheck,
  Megaphone,
  MessageSquare,
  List,
  Users,
  Files,
  Component,
  MonitorCog,
  TrendingUp,
  BarChartHorizontal,
  Network,
  ClipboardCheck,
  Paperclip,
  ChevronRight,
  SearchCheck,
} from 'lucide-react';

// Map icon names to components
const IconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-4 w-4 mr-2 shrink-0" />,
  Send: <Send className="h-4 w-4 mr-2 shrink-0" />,
  BarChart3: <BarChart3 className="h-4 w-4 mr-2 shrink-0" />,
  Coins: <Coins className="h-4 w-4 mr-2 shrink-0" />,
  Bell: <Bell className="h-4 w-4 mr-2 shrink-0" />,
  FileCheck: <FileCheck className="h-4 w-4 mr-2 shrink-0" />,
  Megaphone: <Megaphone className="h-4 w-4 mr-2 shrink-0" />,
  MessageSquare: <MessageSquare className="h-4 w-4 mr-2 shrink-0" />,
  List: <List className="h-4 w-4 mr-2 shrink-0" />,
  Users: <Users className="h-4 w-4 mr-2 shrink-0" />,
  Files: <Files className="h-4 w-4 mr-2 shrink-0" />,
  Component: <Component className="h-4 w-4 mr-2 shrink-0" />,
  MonitorCog: <MonitorCog className="h-4 w-4 mr-2 shrink-0" />,
  TrendingUp: <TrendingUp className="h-4 w-4 mr-2 shrink-0" />,
  BarChartHorizontal: <BarChartHorizontal className="h-4 w-4 mr-2 shrink-0" />,
  Network: <Network className="h-4 w-4 mr-2 shrink-0" />,
  ClipboardCheck: <ClipboardCheck className="h-4 w-4 mr-2 shrink-0" />,
  Paperclip: <Paperclip className="h-4 w-4 mr-2 shrink-0" />,
  SearchCheck: <SearchCheck className="h-4 w-4 mr-2 shrink-0" />,
};

// Define the navigation item types
interface NavItemBase {
  id: string;
  text: string;
  href?: string;
  enabled: boolean;
  selected?: boolean;
  badge?: number;
  style?: string;
}

interface NavItem extends NavItemBase {
  icon?: string;
  children?: NavItemBase[];
}

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSubmenus, setExpandedSubmenus] = React.useState<Record<string, boolean>>({
    push: true, // Initialize Push уведомления to be expanded
  });

  const toggleSubmenu = (id: string) => {
    setExpandedSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderMenuItem = (item: NavItem, isSubItem = false) => {
    const isActive = item.selected || (item.href && pathname === item.href);
    const isDisabled = !item.enabled;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSubmenus[item.id] || false;

    // Check if any child is active
    const hasActiveChild = !!item.children?.some(
      (child) => child.selected || (child.href && pathname === child.href)
    );

    const itemClassName = cn(
      'w-full justify-start text-sm rounded-md',
      isSubItem ? 'pl-9' : 'pl-2',
      isActive || hasActiveChild
        ? 'bg-blue-100 hover:bg-blue-200 font-medium'
        : 'hover:bg-slate-100',
      isDisabled ? 'opacity-50 pointer-events-none' : '',
      item.style
    );

    const content = (
      <>
        {!isSubItem && item.icon && IconMap[item.icon]}
        <span className={isSubItem ? 'ml-2' : ''}>{item.text}</span>
        {item.badge && (
          <Badge variant="outline" className="ml-auto bg-black text-white hover:bg-black">
            {item.badge}
          </Badge>
        )}
        {hasChildren && !isSubItem && (
          <ChevronRight
            className={cn(
              'h-4 w-4 ml-auto transition-transform',
              isExpanded && 'transform rotate-90'
            )}
          />
        )}
      </>
    );

    // If it has children, render as expandable item
    if (hasChildren && !isSubItem) {
      return (
        <div key={item.id} className="space-y-1">
          <div
            onClick={() => toggleSubmenu(item.id)}
            className={cn('flex items-center p-2 cursor-pointer rounded-md', itemClassName)}
          >
            {content}
          </div>

          {isExpanded && (
            <div className="pl-4 space-y-1">
              {item.children?.map((subItem) =>
                renderMenuItem({ ...subItem, icon: undefined }, true)
              )}
            </div>
          )}
        </div>
      );
    }

    // For disabled or items without href
    if (isDisabled || !item.href) {
      return (
        <div key={item.id} className={cn('flex items-center p-2 rounded-md', itemClassName)}>
          {content}
        </div>
      );
    }

    // Regular menu item with link
    return (
      <Button key={item.id} variant="ghost" size="sm" className={itemClassName} asChild>
        <Link href={item.href}>{content}</Link>
      </Button>
    );
  };

  // Add an effect to auto-expand parent items with active children
  React.useEffect(() => {
    if (!pathname) return;

    // Check all menu sections and items
    menuData.forEach((section) => {
      section.items.forEach((item) => {
        // Cast to NavItem to ensure TypeScript knows it might have children
        const navItem = item as NavItem;
        if (navItem.children?.some((child) => child.href === pathname)) {
          setExpandedSubmenus((prev) => ({
            ...prev,
            [navItem.id]: true,
          }));
        }
      });
    });
  }, [pathname]);

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen pt-16 bg-white border-r border-slate-200 transition-all duration-300',
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      )}
    >
      <ScrollArea className="h-full px-3 py-4">
        <Accordion
          type="multiple"
          defaultValue={menuData.map((section) => section.id)}
          className="w-full space-y-4"
        >
          {menuData.map((section) => (
            <AccordionItem key={section.id} value={section.id} className="border-none">
              <AccordionTrigger className="px-3 py-2 text-sm font-bold text-white bg-blue-500 rounded-md hover:no-underline hover:bg-blue-600">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="pt-2 space-y-1 px-0">
                {section.items.map((item) => (
                  <React.Fragment key={item.id}>{renderMenuItem(item as NavItem)}</React.Fragment>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </aside>
  );
}
