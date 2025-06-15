// src/contexts/app-providers.tsx
"use client";

import type React from 'react';
import { AuthProvider } from './auth-context';
import { CartProvider } from './cart-context';
import { FavoritesProvider } from './favorites-context';
import { ThemeProvider } from 'next-themes'; // Added import

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
