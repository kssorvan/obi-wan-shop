
"use client";
import { Header } from '@/components/layout/Header'; // Updated import
// Footer is in RootLayout, so not needed here typically

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header /> {/* Use new Header component */}
      <main className="flex-1 container py-8">
        {children}
      </main>
      {/* Footer is handled by RootLayout */}
    </div>
  );
}
