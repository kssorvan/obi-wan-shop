
"use client";

import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Separator } from '@/components/ui/separator';

const footerNavItems = [
  { href: '/about', label: 'About Us' }, 
  { href: '/contact', label: 'Contact Us' }, 
  { href: '/help', label: 'FAQs' }, 
  { href: '/style-guide/buttons', label: 'Button Styles' }, 
  { href: '/legal/privacy-policy', label: 'Privacy Policy' }, 
  { href: '/legal/terms-of-service', label: 'Terms of Service' }, 
];

export function Footer() { // Renamed component
  return (
    <footer className="bg-card border-t border-border text-card-foreground">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <Logo size="md" />
          </div>
          <nav className="md:col-span-2 flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            {footerNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-6 md:my-8 bg-border" />
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Obi-Wan-Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
