import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppProviders from '@/contexts/app-providers';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';
import { PreFooter } from '@/components/layout/pre-footer';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Obi-Wan Shop - Your Gateway to the Galaxy',
  description: 'Discover legendary quality products at Obi-Wan Shop. From Jedi essentials to galactic fashion, tech gadgets, and home decor - find extraordinary items with the wisdom and precision of a Jedi Master. Fast delivery, secure shopping, and Force-powered customer experience.',
  keywords: 'obi-wan, shop, ecommerce, jedi, star wars inspired, premium products, online shopping, galactic marketplace',
  authors: [{ name: 'Obi-Wan Shop Team' }],
  creator: 'Obi-Wan Shop',
  publisher: 'Obi-Wan Shop',
  robots: 'index, follow',
  openGraph: {
    title: 'Obi-Wan Shop - Your Gateway to the Galaxy',
    description: 'Discover legendary quality products with the wisdom and precision of a Jedi Master. Premium lifestyle, fashion, tech, and home products await.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Obi-Wan Shop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Obi-Wan Shop - Your Gateway to the Galaxy',
    description: 'Discover legendary quality products with Jedi-level precision and wisdom.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000',
};

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
        <link rel="icon" href="/favicon.ico" />
        <meta name="application-name" content="Obi-Wan Shop" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Obi-Wan Shop" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <AppProviders>
          <div className="flex-grow">
            {children}
          </div>
          <PreFooter />
          <Footer />
          <Toaster />
          <ScrollToTopButton />
        </AppProviders>
      </body>
    </html>
  );
}