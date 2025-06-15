
"use client";

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock, CreditCard, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// This schema can be moved to lib/validations.ts if used more widely
const paymentSchema = z.object({
  paymentMethod: z.enum(["creditCard", "paypal"], { required_error: "Please select a payment method." }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
  cardHolderName: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === 'creditCard') {
        return !!data.cardHolderName && data.cardHolderName.trim().length > 2 &&
               !!data.cardNumber && data.cardNumber.replace(/\s/g, '').length >= 13 && data.cardNumber.replace(/\s/g, '').length <= 19 && /^\d+$/.test(data.cardNumber.replace(/\s/g, '')) &&
               !!data.expiryDate && /^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(data.expiryDate) && // MM / YY
               !!data.cvc && data.cvc.length >= 3 && data.cvc.length <=4 && /^\d+$/.test(data.cvc);
    }
    return true;
}, {
    message: "Invalid credit card details. Check card number (13-19 digits), MM/YY expiry, and 3-4 digit CVC.",
    path: ["cardHolderName"], // Path indicates where the general error might appear, individual fields will also show errors
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSubmit: (data: PaymentFormValues) => void;
  totalAmount: number;
  isLoading?: boolean;
}

export function PaymentForm({ onSubmit, totalAmount, isLoading = false }: PaymentFormProps) {
  const form = useForm<PaymentFormValues>({
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="paymentMethod" render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-md">Payment Method</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
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
        )} />

        {selectedPaymentMethod === "creditCard" && (
          <div className="space-y-4 p-4 border rounded-md bg-secondary/20">
            <FormField control={form.control} name="cardHolderName" render={({ field }) => (
                <FormItem><FormLabel>Cardholder Name</FormLabel><FormControl><Input placeholder="John M. Doe" {...field} autoComplete="cc-name" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="cardNumber" render={({ field }) => (
                <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" maxLength={19} {...field} autoComplete="cc-number" /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="expiryDate" render={({ field }) => (
                  <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM / YY" {...field} autoComplete="cc-exp" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="cvc" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">CVC / CVV
                      <TooltipProvider><Tooltip delayDuration={0}><TooltipTrigger asChild><HelpCircle className="ml-1 h-3.5 w-3.5 text-muted-foreground cursor-help" /></TooltipTrigger><TooltipContent><p>3 or 4 digit code on back (or front for Amex).</p></TooltipContent></Tooltip></TooltipProvider>
                    </FormLabel>
                    <FormControl><Input placeholder="123" maxLength={4} {...field} autoComplete="cc-csc" /></FormControl><FormMessage />
                  </FormItem>
              )} />
            </div>
          </div>
        )}
        
        {selectedPaymentMethod === "paypal" && (
          <div className="p-4 border rounded-md bg-secondary/20 text-center">
            <p className="text-muted-foreground mb-2">You will be redirected to PayPal.</p>
            {/* Placeholder for PayPal button integration */}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : <><Lock className="mr-2 h-5 w-5" /> Pay ${totalAmount.toFixed(2)} Securely </>}
        </Button>
      </form>
    </Form>
  );
}
