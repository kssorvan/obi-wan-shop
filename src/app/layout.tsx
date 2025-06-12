
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppProviders from '@/contexts/app-providers';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Separator } from '@/components/ui/separator';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';
import { PreFooter } from '@/components/layout/pre-footer'; // Import the new component

export const metadata: Metadata = {
  title: 'Obi-Wan-Shop',
  description: 'AI-Powered Style Recommendations',
};

const footerNavItems = [
  { href: '/about-us', label: 'About Us' },
  { href: '/contact-us', label: 'Contact Us' },
  { href: '/support/faqs', label: 'FAQs' },
  { href: '/style-guide/buttons', label: 'Button Styles' },
  { href: '/legal/privacy-policy', label: 'Privacy Policy' },
  { href: '/legal/terms-of-service', label: 'Terms of Service' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AppProviders>
          <div className="flex-grow">
            {children}
          </div>
          <PreFooter /> {/* Add the PreFooter component here */}
          <Toaster />
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
          <ScrollToTopButton />
        </AppProviders>
      </body>
    </html>
  );
}
