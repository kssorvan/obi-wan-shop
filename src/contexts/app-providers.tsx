// src/contexts/app-providers.tsx
"use client";

import type React from 'react';
import { AuthProvider } from './auth-context';
import { CartProvider } from './cart-context';
import { FavoritesProvider } from './favorites-context';

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default AppProviders;
