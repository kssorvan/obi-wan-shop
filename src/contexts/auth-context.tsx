
// src/contexts/auth-context.tsx
"use client";

import type { User } from '@/types';
import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getFromApi, postToApi } from '@/lib/api';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode v4+

const AUTH_TOKEN_KEY = 'obiwanshop_auth_token';

interface DecodedJwtPayload {
  sub: string; // Subject (user ID)
  email: string;
  name?: string;
  role?: 'user' | 'admin' | 'superuser';
  exp: number; // Expiration time (timestamp)
  iat?: number; // Issued at (timestamp)
  // Add any other custom claims your JWT includes
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<User>;
  signUp: (email: string, pass: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  recheckUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const storeTokenAndSetUser = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    try {
      const decoded = jwtDecode<DecodedJwtPayload>(token);
      const currentUser: User = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || 'user',
        // Mock purchase/browsing history for now, or fetch separately if needed
        purchaseHistory: [], 
        browsingHistory: [],
      };
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      return null;
    }
  };

  const loadUserFromToken = useCallback(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false); // No localStorage on server
      return;
    }
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      try {
        const decoded = jwtDecode<DecodedJwtPayload>(token);
        if (decoded.exp * 1000 > Date.now()) { // Check expiration
          const currentUser: User = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role || 'user',
            purchaseHistory: [],
            browsingHistory: [],
          };
          setUser(currentUser);
        } else {
          // Token expired
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setUser(null);
        }
      } catch (error) {
        console.error("Error decoding token on load:", error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const signIn = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      // API should return { token: "your_jwt_token" } on successful login
      const response = await postToApi<{ token: string; user: User }>('/login', { email, password }); 
      if (response.token) {
        const signedInUser = storeTokenAndSetUser(response.token);
        if (signedInUser) return signedInUser;
        throw new Error("Failed to process token after login.");
      } else {
        throw new Error("Login response did not include a token.");
      }
    } catch (error) {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // API might return { token: "...", user: {...} } or just a success message
      // If it returns a token, we log the user in directly.
      const response = await postToApi<{ token?: string; user?: User  }>('/register', { email, password, name, password_confirmation: password });
      if (response.token) {
        storeTokenAndSetUser(response.token);
        // router.push('/home'); // Or wherever you want to redirect after signup
      } else {
        // If no token, maybe redirect to login or show success message
        // For now, assume direct login is not happening, user needs to sign in.
        // Or, if your API logs them in and provides user data (but no token initially shown):
        if(response.user) setUser(response.user); // Fallback if API sends user but no token immediately.
      }
       // After successful registration, redirect to login or fetch user data if API auto-logs in
       // For JWT, it's common to get a token back. If not, they need to login.
       // router.push('/auth/signin?message=Registration%20successful.%20Please%20sign%20in.');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    try {
      // Optionally, call a backend endpoint to invalidate the token (if using a blacklist)
      await postToApi('/logout', {}); 
    } catch (error) {
      console.warn("Error during server-side logout (token invalidation might have failed):", error);
    } finally {
      setIsLoading(false);
      // router.push('/auth/signin'); // Optionally redirect globally
    }
  };
  
  const recheckUser = async () => {
    setIsLoading(true);
    loadUserFromToken();
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
