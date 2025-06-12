
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Shirt, ShoppingBag, Info, Users, Mail, Heart, ShoppingCartIcon } from 'lucide-react';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/products', label: 'All Products', icon: Shirt },
  { href: '/categories', label: 'Categories', icon: ShoppingBag },
  { href: '/about-us', label: 'About Us', icon: Users },
  { href: '/contact-us', label: 'Contact Us', icon: Mail },
  { href: '/support/faqs', label: 'FAQs', icon: Info },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/cart', label: 'Cart', icon: ShoppingCartIcon },
];

interface NavigationLinksProps {
  layout?: 'horizontal' | 'vertical';
  className?: string;
  onLinkClick?: () => void;
}

export default function NavigationLinks({ layout = 'horizontal', className, onLinkClick }: NavigationLinksProps) {
  const pathname = usePathname();

  const commonLinkClasses = "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const hoverClasses = "hover:bg-accent/10 hover:text-primary"; // For light background
  const activeClasses = "bg-primary/10 text-primary font-semibold";

  const verticalSpecificClasses = "w-full justify-start"; // For vertical layout
  const horizontalSpecificClasses = ""; // For horizontal layout

  return (
    <nav className={cn(
      layout === 'vertical' ? 'flex flex-col space-y-1 p-4' : 'flex items-center space-x-1',
      className
    )}>
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href) && item.href !== '/cart' && item.href !== '/favorites') || (item.href === '/cart' && pathname === '/cart') || (item.href === '/favorites' && pathname === '/favorites');
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
