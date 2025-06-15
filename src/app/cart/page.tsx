
"use client";
import { useCart } from '@/contexts/cart-context';
import { CartItem } from '@/components/cart/CartItem'; // Updated import path
import { CartSummary } from '@/components/cart/CartSummary'; // Updated import path
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cartItems, itemCount } = useCart();

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-xl shadow-lg">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Your Shopping Cart</h1>
        <p className="text-lg text-muted-foreground">
          {itemCount > 0 
            ? `You have ${itemCount} item${itemCount === 1 ? '' : 's'} in your cart.`
            : "Your cart is currently empty."}
        </p>
      </section>

      {itemCount > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow-md">
            <Button variant="outline" asChild className="mb-4">
                <Link href="/shop/products"> 
                    <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                </Link>
            </Button>
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground/50 mb-6" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">Your Cart is Empty</h2>
          <p className="text-foreground/70 mb-6">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/shop/products">Start Shopping</Link> 
          </Button>
        </div>
      )}
    </div>
  );
}
