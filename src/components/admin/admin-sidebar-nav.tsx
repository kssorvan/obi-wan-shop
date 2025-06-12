
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingBag, Users, Package, Settings } from 'lucide-react'; // Changed BarChart to Package

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: Package }, // Changed icon
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarNavProps {
  onLinkClick?: () => void; // Optional: for closing mobile sidebar
}

export function AdminSidebarNav({ onLinkClick }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-1 p-4">
      {adminNavItems.map((item) => {
        // Exact match for dashboard, startsWith for others to handle sub-routes like /admin/products/add
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
