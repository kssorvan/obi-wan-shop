
"use client";
import { AppHeader } from '@/components/layout/app-header';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Define path prefixes within the /client group that are guest-accessible
// Note: These are prefixes, so /products will cover /products/[id] etc.
const GUEST_ACCESSIBLE_CLIENT_PREFIXES = [
  '/home',
  '/products',
  '/categories',
  '/lighting',
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Get the full current pathname

  useEffect(() => {
    if (!isLoading && !user) {
      // Pathname will be like "/client/home", "/client/products/123", etc.
      // We need to check if the path *after* "/client" is guest-accessible.
      const clientSpecificPath = pathname.startsWith('/client') 
        ? pathname.substring('/client'.length) || '/' // if just /client, treat as /
        : pathname; // Should not happen if this layout is only for /client paths

      const isGuestAccessibleRoute = GUEST_ACCESSIBLE_CLIENT_PREFIXES.some(
        (prefix) => clientSpecificPath.startsWith(prefix)
      );

      if (!isGuestAccessibleRoute) {
        router.replace('/auth/signin');
      }
    }
  }, [user, isLoading, router, pathname]);

  // If user is not loaded yet, and it's not a guest accessible route,
  // show loader. For guest routes, we might want to show content sooner,
  // but the auth check still needs to complete.
  // The condition below ensures loader shows if auth is pending and route is protected.
  const clientSpecificPath = pathname.startsWith('/client') ? pathname.substring('/client'.length) || '/' : pathname;
  const isPotentiallyProtected = !GUEST_ACCESSIBLE_CLIENT_PREFIXES.some(prefix => clientSpecificPath.startsWith(prefix));

  if (isLoading && (isPotentiallyProtected || !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is not present and it's a protected route, the useEffect above will redirect.
  // This condition is a fallback or for cases where redirect hasn't happened yet.
  if (!user && isPotentiallyProtected && !isLoading) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Redirecting to sign in...</p>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 container py-8">
        {children}
      </main>
      {/* Footer is now handled by RootLayout for global consistency */}
    </div>
  );
}
