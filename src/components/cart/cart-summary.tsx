
"use client";
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Trash2, Tag, Info } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function CartSummary() {
  const { cartItems, totalPrice, itemCount, clearCart, applyPromoCode, appliedPromo } = useCart();
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const { toast } = useToast();

  if (itemCount === 0) {
    return null; 
  }

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const taxRate = 0.08;
  const taxes = totalPrice * taxRate;
  
  let discountAmount = 0;
  if (appliedPromo?.type === 'percentage') {
    discountAmount = totalPrice * (appliedPromo.value / 100);
  } else if (appliedPromo?.type === 'fixed') {
    discountAmount = appliedPromo.value;
  }
  const subtotalAfterDiscount = totalPrice - discountAmount;
  const grandTotal = subtotalAfterDiscount + shippingCost + taxes;


  const handleApplyPromoCode = () => {
    if(!promoCodeInput.trim()) {
        toast({ title: "Please enter a promo code.", variant: "destructive" });
        return;
    }
    const success = applyPromoCode(promoCodeInput);
    if (success) {
      toast({ title: "Promo code applied!", description: `Code "${promoCodeInput}" activated.`, className: "bg-green-500 text-white" });
    } else {
      toast({ title: "Invalid Promo Code", description: `The code "${promoCodeInput}" is not valid or expired.`, variant: "destructive" });
    }
    setPromoCodeInput('');
  };
  
  // Update input if appliedPromo changes (e.g. from another component or initial load)
  useEffect(() => {
    if (appliedPromo) {
        setPromoCodeInput(appliedPromo.code);
    }
  }, [appliedPromo]);


  return (
    <Card className="shadow-lg sticky top-24">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-md">
          <span>Subtotal ({itemCount} item{itemCount === 1 ? '' : 's'})</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        {/* Promo Code Section */}
        <div className="space-y-2 pt-2">
            <label htmlFor="promo-code" className="text-sm font-medium flex items-center">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" /> Promo Code
            </label>
            <div className="flex gap-2">
                <Input 
                    type="text" 
                    id="promo-code" 
                    placeholder="Enter code" 
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="h-9"
                    disabled={!!appliedPromo}
                />
                <Button onClick={handleApplyPromoCode} variant="outline" size="sm" className="h-9 px-3" disabled={!!appliedPromo}>
                    Apply
                </Button>
            </div>
             {appliedPromo && (
              <p className="text-xs text-green-600">
                Code "{appliedPromo.code}" applied: {appliedPromo.type === 'percentage' ? `${appliedPromo.value}% off` : `-$${appliedPromo.value.toFixed(2)}`}
              </p>
            )}
        </div>
        {discountAmount > 0 && (
            <div className="flex justify-between text-md text-green-600">
                <span>Discount:</span>
                <span>-${discountAmount.toFixed(2)}</span>
            </div>
        )}
        
        <Separator className="my-2"/>

        <div className="flex justify-between text-md">
          <span>Shipping</span>
          <div className="flex items-center">
            <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
             <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Info className="ml-1 h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-xs">
                    <p>Free shipping on orders over $50.</p>
                  </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </div>
         <div className="flex justify-between text-md">
          <span>Estimated Tax</span>
          <span>${taxes.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-xl font-bold text-primary">
          <span>Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button size="lg" asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/checkout/shipping-address">
            Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button variant="outline" onClick={clearCart} className="w-full text-destructive hover:border-destructive hover:bg-destructive/10">
          <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
