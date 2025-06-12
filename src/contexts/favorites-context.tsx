// src/contexts/favorites-context.tsx
"use client";

import type { Product } from '@/types';
import type React from 'react';
import { createContext, useContext, useState, useEffect }  from 'react';
import { useToast } from "@/hooks/use-toast";

interface FavoritesContextType {
  favoriteItems: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedFavorites = localStorage.getItem('stylesense_favorites');
    if (storedFavorites) {
      setFavoriteItems(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stylesense_favorites', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  const addFavorite = (product: Product) => {
    setFavoriteItems(prevItems => {
      if (prevItems.find(item => item.id === product.id)) {
        return prevItems; // Already a favorite
      }
      toast({ title: `${product.name} added to favorites`, duration: 3000 });
      return [...prevItems, product];
    });
  };

  const removeFavorite = (productId: string) => {
    const product = favoriteItems.find(item => item.id === productId);
    setFavoriteItems(prevItems => prevItems.filter(item => item.id !== productId));
    if (product) {
      toast({ title: `${product.name} removed from favorites`, variant: "destructive", duration: 3000 });
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favoriteItems.some(item => item.id === productId);
  };
  
  const favoritesCount = favoriteItems.length;

  return (
    <FavoritesContext.Provider value={{ favoriteItems, addFavorite, removeFavorite, isFavorite, favoritesCount }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
