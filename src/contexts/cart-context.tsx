
// src/contexts/cart-context.tsx
"use client";

import type { CartItem, Product } from '@/types';
import type React from 'react';
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
}

const MOCK_PROMO_CODES: PromoCode[] = [
  { code: "DISCOUNT10", type: "percentage", value: 10 },
  { code: "SAVE5", type: "fixed", value: 5 },
];

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  applyPromoCode: (code: string) => boolean;
  appliedPromo: PromoCode | null;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('obiwanshop_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    const storedPromo = localStorage.getItem('obiwanshop_promo');
    if (storedPromo) {
      setAppliedPromo(JSON.parse(storedPromo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('obiwanshop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedPromo) {
        localStorage.setItem('obiwanshop_promo', JSON.stringify(appliedPromo));
    } else {
        localStorage.removeItem('obiwanshop_promo');
    }
  }, [appliedPromo]);


  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock || 10) } : item // Respect stock
        );
      }
      return [...prevItems, { ...product, quantity: Math.min(quantity, product.stock || 10) }];
    });
    toast({ title: `${product.name} added to cart`, duration: 3000 });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({ title: `Item removed from cart`, variant: "destructive", duration: 3000 });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const itemInCart = cartItems.find(item => item.id === productId);
    if (!itemInCart) return;

    const maxQuantity = itemInCart.stock || 10; // Use product stock if available, else default
    const newQuantity = Math.min(Math.max(1, quantity), maxQuantity);


    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
    toast({ title: "Cart cleared", variant: "destructive", duration: 3000 });
  };
  
  const applyPromoCode = (code: string): boolean => {
    const promo = MOCK_PROMO_CODES.find(p => p.code.toUpperCase() === code.toUpperCase());
    if (promo) {
      setAppliedPromo(promo);
      return true;
    }
    setAppliedPromo(null); // Clear if invalid or no promo
    return false;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
     toast({ title: "Promo code removed.", duration: 2000 });
  };


  const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice, applyPromoCode, appliedPromo, removePromoCode }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
