
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { Loader2 } from 'lucide-react';

export default function CheckoutRedirectPage() {
  const router = useRouter();
  const { itemCount, cartItems } = useCart(); // Use cartItems to ensure context is loaded

  useEffect(() => {
    // Wait for cartItems to be potentially loaded from localStorage
    if (cartItems === undefined) {
      // Context not yet ready, or still loading initial state
      return;
    }

    if (itemCount === 0) {
      router.replace('/shop/products'); // Redirect to products if cart is empty
    } else {
      router.replace('/checkout/shipping'); // Proceed to the first step of checkout
    }
  }, [itemCount, router, cartItems]);

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-muted-foreground">Preparing your checkout...</p>
    </div>
  );
}
