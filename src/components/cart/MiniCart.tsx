
// src/components/cart/MiniCart.tsx
"use client";
import React from 'react';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

// Placeholder: MiniCart component, often a dropdown or sidebar.
export function MiniCart() {
  const { cartItems, itemCount, totalPrice, removeFromCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Open Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-semibold text-primary">Your Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-grow my-4 pr-3">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-2 border rounded-md">
                    <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded object-cover" data-ai-hint={item.dataAiHint || 'cart mini item'} />
                    <div className="flex-grow">
                      <Link href={`/shop/products/${item.id}`} className="text-sm font-medium hover:underline text-foreground">{item.name}</Link>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto border-t pt-4 space-y-3">
              <div className="flex justify-between font-semibold text-lg text-primary">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/cart">View Cart & Checkout</Link>
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <SheetClose asChild>
              <Button variant="link" asChild className="mt-2 text-primary">
                <Link href="/shop/products">Continue Shopping</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
