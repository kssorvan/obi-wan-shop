
"use client";
import { Header } from '@/components/layout/Header'; // Updated import
import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { SiteFooter } from '@/components/layout/site-footer'; // This import might be unused if footer is global


export default function AuthenticatedLayout({ // Renamed from AppLayout to AuthenticatedLayout
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    if (!isLoading && !user) {
        router.replace('/auth/signin');
    }
  }, [user, isLoading, router, pathname]);


  if (isLoading || (!user && !isLoading)) { // Show loader if loading or if user is null and not finished loading
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header /> {/* Updated component name */}
      <main className="flex-1 container py-8">
        {children}
      </main>
      {/* Footer is now handled by RootLayout for global consistency, remove if duplicate */}
      {/* <SiteFooter /> */} 
    </div>
  );
}
