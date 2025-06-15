
"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// import { useAuth } from '@/stores/authStore'; // Assuming Zustand store for auth
import { useAuth } from '@/contexts/auth-context'; // Using context for now
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  /**
   * Array of path prefixes that are publicly accessible (e.g., marketing pages, auth pages themselves).
   * If undefined, all routes are considered protected by default.
   */
  publicRoutes?: string[];
}

/**
 * AuthGuard component to protect routes.
 * It checks if the user is authenticated. If not, and the route is not public,
 * it redirects to the sign-in page.
 * This can be used in layouts to protect a group of routes.
 * For more robust and server-enforced protection, Next.js Middleware is preferred.
 */
export function AuthGuard({ children, publicRoutes = ['/auth', '/'] }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth(); // Replace with Zustand hook when implemented

  const isPublicRoute = publicRoutes.some(routePrefix => pathname.startsWith(routePrefix));

  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute) {
      router.replace(`/auth/signin?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, isLoading, isPublicRoute, router, pathname]);

  if (isLoading && !isPublicRoute && !user) { // Show loader only for protected routes while checking auth
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If not loading, not a public route, and no user, the useEffect will handle redirection.
  // This prevents rendering children prematurely.
  if (!user && !isPublicRoute && !isLoading) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p>Redirecting to sign in...</p>
      </div>
    );
  }

  return <>{children}</>;
}
