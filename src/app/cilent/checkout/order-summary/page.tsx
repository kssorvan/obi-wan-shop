
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import type { Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, Edit3, PackageCheck, ShoppingCart, Tag, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function OrderSummaryPage() {
  const router = useRouter();
  const { cartItems, totalPrice, itemCount, applyPromoCode, appliedPromo, removePromoCode } = useCart();
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCodeInput, setPromoCodeInput] = useState(appliedPromo?.code || '');
  const { toast } = useToast();

  useEffect(() => {
    const storedAddress = localStorage.getItem('shippingAddress');
    if (storedAddress) {
      setShippingAddress(JSON.parse(storedAddress));
    } else {
      router.replace('/checkout/shipping-address');
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (appliedPromo) {
        setPromoCodeInput(appliedPromo.code);
    } else {
        setPromoCodeInput(''); // Clear input if promo is removed elsewhere
    }
  }, [appliedPromo]);


  if (isLoading) {
    return <div className="text-center py-10">Loading order details...</div>;
  }

  if (itemCount === 0 && !isLoading) {
     router.replace('/cart'); 
     return <div className="text-center py-10">Your cart is empty. Redirecting...</div>;
  }
  
  if (!shippingAddress) {
    return <div className="text-center py-10">Shipping address not found. Please add an address.</div>;
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
    // No need to setPromoCodeInput('') here if we want to keep the applied code visible
  };
  
  const handleRemovePromoCode = () => {
    removePromoCode();
    setPromoCodeInput('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <PackageCheck className="mr-3 h-7 w-7" /> Order Summary
          </CardTitle>
          <CardDescription>Please review your order details before proceeding to payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipping Address Section */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-foreground">Shipping To:</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/checkout/shipping-address">
                  <Edit3 className="mr-2 h-3 w-3" /> Change Address
                </Link>
              </Button>
            </div>
            <div className="text-muted-foreground bg-secondary/30 p-4 rounded-md">
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p>{shippingAddress.streetAddress}{shippingAddress.aptSuite ? `, ${shippingAddress.aptSuite}` : ''}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
              {shippingAddress.phoneNumber && <p>Tel: {shippingAddress.phoneNumber}</p>}
            </div>
          </section>
          
          <Separator />

          {/* Items Review Section */}
          <section>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-foreground">Items in Cart:</h3>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/cart">
                    <ShoppingCart className="mr-2 h-3 w-3" /> Edit Cart
                    </Link>
                </Button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-2 rounded-md border">
                  <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md object-cover" data-ai-hint={item.dataAiHint || 'order summary item'} />
                  <div className="flex-grow">
                    <p className="font-medium text-primary">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          <Separator />
          
           {/* Promo Code Section */}
          <section>
            <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center">
              <Tag className="mr-2 h-5 w-5"/> Promo Code
            </h3>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter promo code"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="flex-grow"
                disabled={!!appliedPromo}
              />
              {!appliedPromo ? (
                <Button onClick={handleApplyPromoCode}>Apply</Button>
              ) : (
                <Button onClick={handleRemovePromoCode} variant="destructive" size="sm">Remove</Button>
              )}
            </div>
            {appliedPromo && (
              <p className="text-sm text-green-600 mt-2">
                Code "{appliedPromo.code}" applied: {appliedPromo.type === 'percentage' ? `${appliedPromo.value}% off` : `-$${appliedPromo.value.toFixed(2)}`}
              </p>
            )}
          </section>

          <Separator />

          {/* Payment Summary */}
          <section className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground mb-2">Cost Summary:</h3>
            <div className="flex justify-between text-md text-muted-foreground"><span>Subtotal:</span> <span>${totalPrice.toFixed(2)}</span></div>
            {discountAmount > 0 && (
                <div className="flex justify-between text-md text-green-600">
                    <span>Discount ({appliedPromo?.code}):</span> 
                    <span>-${discountAmount.toFixed(2)}</span>
                </div>
            )}
            <div className="flex justify-between text-md text-muted-foreground">
                <span>Shipping:</span>
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
            <div className="flex justify-between text-md text-muted-foreground"><span>Taxes:</span> <span>${taxes.toFixed(2)}</span></div>
            <Separator className="my-2"/>
            <div className="flex justify-between text-xl font-bold text-primary"><span>Grand Total:</span> <span>${grandTotal.toFixed(2)}</span></div>
          </section>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => router.push('/checkout/payment')}>
            Continue to Payment <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
