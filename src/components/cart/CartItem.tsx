
// src/components/cart/CartItem.tsx
"use client";
import type { CartItem as CartItemType } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) { // Component name was already correct
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex items-start gap-4 py-4 border-b last:border-b-0">
      <Link href={`/shop/products/${item.id}`} className="flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={100}
          height={100}
          className="rounded-md object-cover aspect-square border"
          data-ai-hint={item.dataAiHint || 'cart item'}
        />
      </Link>
      <div className="flex-grow">
        <Link href={`/shop/products/${item.id}`} className="hover:underline">
          <h3 className="text-lg font-semibold text-primary">{item.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
        <p className="text-md font-medium mt-1">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input type="number" value={item.quantity} readOnly className="h-8 w-12 text-center px-1" />
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= (item.stock || 10)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full ml-auto">
         <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
          <X className="h-5 w-5" />
        </Button>
        <p className="text-lg font-semibold text-right mt-auto">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}
