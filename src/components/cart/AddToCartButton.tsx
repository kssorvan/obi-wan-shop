
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/contexts/cart-context'; // Assuming useCart will be adapted or this component will use a new store

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function AddToCartButton({ product, quantity = 1, className, variant = "default", size = "default" }: AddToCartButtonProps) {
  const { addToCart } = useCart(); // Placeholder for cart logic

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={product.stock === 0}
      className={className}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
