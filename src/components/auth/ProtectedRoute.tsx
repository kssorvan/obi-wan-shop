
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/stores/authStore'; // Assuming Zustand store for auth
import { useAuth } from '@/contexts/auth-context'; // Using context for now
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: for role-based access control
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // Replace with Zustand hook when implemented

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/signin?message=Please%20sign%20in');
      return;
    }

    if (!isLoading && user && allowedRoles && allowedRoles.length > 0) {
      const userRole = user.role || 'user'; // Default to 'user' if role is not present
      if (!allowedRoles.includes(userRole)) {
        router.replace('/?message=Access%20Denied'); // Or a specific unauthorized page
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Additional check for roles after loading and user is present
  if (user && allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || 'user';
    if (!allowedRoles.includes(userRole)) {
      // This might cause a flicker if redirect happens after initial render, 
      // better handled by middleware or more robust check above.
      // For now, it's a fallback.
       return (
         <div className="flex min-h-screen items-center justify-center bg-background">
            <p>Access Denied. Redirecting...</p>
         </div>
       );
    }
  }

  return <>{children}</>;
}
