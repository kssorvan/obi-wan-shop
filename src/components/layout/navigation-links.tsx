
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Shirt, ShoppingBag, Info, Users, Mail, Heart, ShoppingCartIcon, HelpCircleIcon } from 'lucide-react'; // Added HelpCircleIcon

const navItems = [
  { href: '/', label: 'Home', icon: Home }, // Changed from /home to / (root for marketing page)
  { href: '/products', label: 'Products', icon: Shirt }, // Will be moved to top level
  { href: '/categories', label: 'Categories', icon: ShoppingBag }, // Will be moved to top level
  { href: '/about', label: 'About Us', icon: Users }, // Path updated to /about (within marketing group)
  { href: '/contact', label: 'Contact Us', icon: Mail }, // Path updated to /contact (within marketing group)
  { href: '/help', label: 'Help/FAQs', icon: HelpCircleIcon }, // Path updated to /help (within marketing group)
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart }, // Path updated to /account/wishlist
  { href: '/cart', label: 'Cart', icon: ShoppingCartIcon }, // Will be moved to top level
];

interface NavigationLinksProps {
  layout?: 'horizontal' | 'vertical';
  className?: string;
  onLinkClick?: () => void;
}

export default function NavigationLinks({ layout = 'horizontal', className, onLinkClick }: NavigationLinksProps) {
  const pathname = usePathname();

  const commonLinkClasses = "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const hoverClasses = "hover:bg-accent/10 hover:text-primary"; 
  const activeClasses = "bg-primary/10 text-primary font-semibold";

  const verticalSpecificClasses = "w-full justify-start";
  const horizontalSpecificClasses = ""; 

  return (
    <nav className={cn(
      layout === 'vertical' ? 'flex flex-col space-y-1 p-4' : 'flex items-center space-x-1',
      className
    )}>
      {navItems.map((item) => {
        // Adjust isActive logic for new paths.
        // For grouped paths like /about (which is /(marketing)/about), pathname might not directly start with item.href.
        // A more robust check might be needed if deep nesting within groups occurs,
        // but for now, exact match or specific checks for new top-level routes should work.
        let isActive = pathname === item.href;
        if (item.href === '/' && pathname === '/') isActive = true;
        else if (item.href !== '/' && pathname.startsWith(item.href)) isActive = true;

        // Handle specific marketing group paths correctly if they don't have a prefix in item.href
        if (item.href === '/about' && pathname === '/about') isActive = true;
        if (item.href === '/contact' && pathname === '/contact') isActive = true;
        if (item.href === '/help' && pathname === '/help') isActive = true;

        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              commonLinkClasses,
              layout === 'vertical' ? verticalSpecificClasses : horizontalSpecificClasses,
              isActive ? activeClasses : hoverClasses,
              layout === 'vertical' ? 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground' : 'text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
