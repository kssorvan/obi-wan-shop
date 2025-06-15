
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Shirt, ShoppingBag, Info, Users, Mail, Heart, ShoppingCartIcon, HelpCircleIcon, List } from 'lucide-react'; // Added List for Categories

const navItems = [
  { href: '/', label: 'Home', icon: Home }, 
  { href: '/shop/products', label: 'Products', icon: Shirt }, 
  { href: '/shop/categories', label: 'Categories', icon: List }, // Changed icon for categories
  { href: '/about', label: 'About Us', icon: Users }, 
  { href: '/contact', label: 'Contact Us', icon: Mail }, 
  { href: '/help', label: 'Help/FAQs', icon: HelpCircleIcon }, 
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart }, 
  { href: '/cart', label: 'Cart', icon: ShoppingCartIcon }, 
];

interface NavigationProps { // Renamed interface
  layout?: 'horizontal' | 'vertical';
  className?: string;
  onLinkClick?: () => void;
}

export default function Navigation({ layout = 'horizontal', className, onLinkClick }: NavigationProps) { // Renamed component
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
        let isActive = pathname === item.href;
        if (item.href === '/' && pathname === '/') {
          isActive = true;
        } else if (item.href !== '/' && pathname.startsWith(item.href)) {
          // More specific check for paths like /shop/products and /shop/categories
          if ((item.href === '/shop/products' && pathname.startsWith('/shop/products')) ||
              (item.href === '/shop/categories' && pathname.startsWith('/shop/categories'))) {
            isActive = true;
          } else if (!item.href.startsWith('/shop') && pathname.startsWith(item.href)){
             isActive = true; // For non-shop top-level routes like /account/wishlist
          }
        }
        
        // Specific for marketing pages
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
