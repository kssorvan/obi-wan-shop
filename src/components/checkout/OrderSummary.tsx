
"use client";

import React from 'react';
import type { CartItem as CartItemType } from '@/types'; // Renamed to avoid conflict
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderSummaryProps {
  items: CartItemType[];
  subtotal: number;
  shipping: number;
  taxes: number;
  discount?: number;
  total: number;
  promoCode?: string | null;
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  taxes,
  discount = 0,
  total,
  promoCode
}: OrderSummaryProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-64 pr-3">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2 border rounded-md">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="rounded object-cover"
                  data-ai-hint={item.dataAiHint || 'summary item'}
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator />

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span className="text-muted-foreground">Discount {promoCode ? `(${promoCode})` : ''}:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping:</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Taxes:</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg text-primary">
            <span>Grand Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
