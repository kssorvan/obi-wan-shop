
"use client"; // This was AdminSidebarNav, now just Sidebar

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingBag, Users, Package, Settings } from 'lucide-react';

// Kept admin specific items for now. This component's usage context (admin) implies this.
const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps { // Renamed interface
  onLinkClick?: () => void; 
}

export function Sidebar({ onLinkClick }: SidebarProps) { // Renamed component
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1 p-4">
      {adminNavItems.map((item) => {
        const isActive = item.href === '/admin/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70")} />
            <span>{item.label}</span>
          </Link>,
        );
      })}
    </nav>
  );
}
