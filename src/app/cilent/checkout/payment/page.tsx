
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Lock, ArrowRight, HelpCircle } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const paymentSchema = z.object({
  paymentMethod: z.enum(["creditCard", "paypal"], {
    required_error: "You need to select a payment method.",
  }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
  cardHolderName: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === 'creditCard') {
        return !!data.cardNumber && data.cardNumber.length >= 13 && data.cardNumber.length <= 19 && /^\d+$/.test(data.cardNumber) &&
               !!data.expiryDate && /^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiryDate) && // MM/YY
               !!data.cvc && data.cvc.length >= 3 && data.cvc.length <=4 && /^\d+$/.test(data.cvc) &&
               !!data.cardHolderName && data.cardHolderName.trim().length > 2;
    }
    return true;
}, {
    message: "Please fill in all credit card details correctly. Card number must be 13-19 digits, MM/YY format for expiry, and 3-4 digit CVC.",
    path: ["cardNumber"], 
});


export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { clearCart, totalPrice, itemCount, appliedPromo } = useCart(); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (itemCount === 0) {
      router.replace('/cart');
    }
  }, [itemCount, router]);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "creditCard",
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: ""
    },
  });
  
  const selectedPaymentMethod = form.watch("paymentMethod");

  async function onSubmit(values: z.infer<typeof paymentSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment processing
    setIsLoading(false);

    toast({
      title: "Payment Successful!",
      description: "Your order has been placed.",
      className: "bg-green-500 text-white"
    });
    
    // Calculate final total for storage
    const shippingCost = totalPrice > 50 ? 0 : 5.99;
    const taxRate = 0.08;
    const taxes = totalPrice * taxRate;
    let discountAmount = 0;
    if (appliedPromo?.type === 'percentage') {
        discountAmount = totalPrice * (appliedPromo.value / 100);
    } else if (appliedPromo?.type === 'fixed') {
        discountAmount = appliedPromo.value;
    }
    const finalTotal = (totalPrice - discountAmount) + shippingCost + taxes;

    const orderDetails = {
        items: [], // from cartContext - or better, cartItems itself if needed
        total: finalTotal, // Use the calculated grand total
        paymentMethod: values.paymentMethod,
        timestamp: new Date().toISOString(),
        orderId: `SS-${Date.now()}`
    };
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

    clearCart(); 
    router.push(`/checkout/confirmation?orderId=${orderDetails.orderId}`);
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
  const grandTotal = (totalPrice - discountAmount) + shippingCost + taxes;


  return (
    <div className="max-w-lg mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <CreditCard className="mr-3 h-7 w-7" /> Secure Payment
          </CardTitle>
          <CardDescription>Enter your payment details. Total: <span className="font-bold text-primary">${grandTotal.toFixed(2)}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-md">Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                          <FormControl><RadioGroupItem value="creditCard" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer flex-grow">Credit / Debit Card</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                          <FormControl><RadioGroupItem value="paypal" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer flex-grow">PayPal</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedPaymentMethod === "creditCard" && (
                <div className="space-y-4 p-4 border rounded-md bg-secondary/20">
                  <FormField control={form.control} name="cardHolderName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl><Input placeholder="John M. Doe" {...field} autoComplete="cc-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="cardNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl><Input placeholder="•••• •••• •••• ••••" maxLength={19} {...field} autoComplete="cc-number" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="expiryDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl><Input placeholder="MM/YY" {...field} autoComplete="cc-exp" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="cvc" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            CVC / CVV
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="ml-1 h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="text-xs max-w-xs">
                                  <p>The 3 or 4 digit security code usually found on the back of your card (or front for Amex).</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormLabel>
                          <FormControl><Input placeholder="123" maxLength={4} {...field} autoComplete="cc-csc" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
              
              {selectedPaymentMethod === "paypal" && (
                <div className="p-4 border rounded-md bg-secondary/20 text-center">
                  <p className="text-muted-foreground mb-2">You will be redirected to PayPal to complete your payment.</p>
                   {/* In a real app, this button would trigger PayPal SDK or redirect */}
                  <Button type="button" variant="outline" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold" onClick={() => toast({title: "PayPal integration not implemented in mock."})}>
                    Pay with PayPal
                  </Button>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? "Processing..." : <> <Lock className="mr-2 h-5 w-5" /> Pay ${grandTotal.toFixed(2)} Securely </>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
