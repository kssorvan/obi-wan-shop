
// src/contexts/auth-context.tsx
"use client";

import type { User } from '@/types';
import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFromApi, postToApi } from '@/lib/api'; // Import API service

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<User>;
  signUp: (email: string, pass: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  recheckUser: () => Promise<void>; // Added for explicit re-check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data only for frontend fallback if API fails or during initial dev
// const MOCK_USER_ID = 'user-123-stylesense';
// const mockBaseUser: Omit<User, 'id' | 'email' | 'role'> = {
//   name: 'Test User',
//   purchaseHistory: [
//     { productId: '1', name: 'Classic Comfort Tee', date: '2024-05-15', price: 29.99 },
//     { productId: '3', name: 'Trailblazer Sneakers', date: '2024-04-20', price: 120.00 },
//   ],
//   browsingHistory: [
//     { productId: '2', name: 'Urban Slim Jeans', viewedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
//     { productId: '4', name: 'Minimalist Leather Wallet', viewedAt: new Date(Date.now() - 86400000).toISOString() },
//   ],
// };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      // Laravel Sanctum's /api/user endpoint typically returns the authenticated user
      // if the session cookie is valid.
      const fetchedUser = await getFromApi<User>('/user');
      setUser(fetchedUser);
    } catch (error) {
      // This error means user is not authenticated or API is down
      // console.warn("Failed to fetch user, likely not authenticated:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Initial check to see if user is already authenticated (e.g., via existing session cookie)
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // 1. (Optional but recommended for SPAs with Sanctum) Ensure CSRF cookie is fresh
      // await getFromApi('/sanctum/csrf-cookie'); // Axios handles this automatically

      // 2. Attempt login
      const response = await postToApi<{ user: User }>('/login', { email, password });
      
      if (response.user) {
        setUser(response.user);
        // No need to store in localStorage if using HttpOnly session cookies managed by Laravel
        return response.user;
      } else {
        throw new Error("Login response did not include user data.");
      }
    } catch (error) {
      setUser(null);
      // Error will be re-thrown by fetcher, containing message from Laravel if available
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // await getFromApi('/sanctum/csrf-cookie'); // For CSRF if needed
      await postToApi<{ user: User }>('/register', { email, password, name, password_confirmation: password /* if using 'confirmed' rule */ });
      // After successful registration, Laravel might automatically log them in
      // or you might redirect to login, or fetch user data.
      // For now, we'll fetch user data to confirm session.
      await fetchUser();
      router.push('/home'); // Redirect after sign up to home
    } catch (error) {
      // Error will be re-thrown by fetcher
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // await getFromApi('/sanctum/csrf-cookie'); // For CSRF if needed
      await postToApi('/logout', {});
    } catch (error) {
      console.error("Sign out failed on backend, clearing session locally anyway:", error);
    } finally {
      setUser(null);
      // If you were using localStorage for tokens, clear it here.
      // With HttpOnly cookies, this client-side clear isn't strictly necessary for the cookie itself.
      setIsLoading(false);
      // router.push('/auth/signin'); // Optionally redirect globally after sign out
    }
  };
  
  const recheckUser = async () => {
    await fetchUser();
  };


  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, recheckUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
