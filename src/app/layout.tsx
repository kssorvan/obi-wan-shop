import type { Metadata } from 'next';
import './globals.css'; // Corrected path
import { Toaster } from '@/components/ui/toaster';
import AppProviders from '@/contexts/app-providers';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';
import { PreFooter } from '@/components/layout/pre-footer';
import { Footer } from '@/components/layout/Footer'; // Updated import

export const metadata: Metadata = {
  title: 'Obi-Wan-Shop',
  description: 'AI-Powered Style Recommendations',
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
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <AppProviders>
          <div className="flex-grow">
            {children}
          </div>
          <PreFooter />
          <Footer /> {/* Use the new Footer component */}
          <Toaster />
          <ScrollToTopButton />
        </AppProviders>
      </body>
    </html>
  );
}