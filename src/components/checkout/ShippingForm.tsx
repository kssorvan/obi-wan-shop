
"use client";

import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Address } from '@/types'; // Assuming Address type is defined

// This schema can be moved to lib/validations.ts if used elsewhere
const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  streetAddress: z.string().min(5, "Street address is required."),
  aptSuite: z.string().optional(),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State/Province is required."),
  zipCode: z.string().min(5, "Zip/Postal code is required."),
  country: z.string().min(2, "Country is required."),
  phoneNumber: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof addressSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormValues) => void;
  initialData?: Partial<ShippingFormValues>;
  isLoading?: boolean;
}

export function ShippingForm({ onSubmit, initialData, isLoading = false }: ShippingFormProps) {
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      streetAddress: initialData?.streetAddress || "",
      aptSuite: initialData?.aptSuite || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipCode: initialData?.zipCode || "",
      country: initialData?.country || "USA",
      phoneNumber: initialData?.phoneNumber || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="fullName" render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="streetAddress" render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="aptSuite" render={({ field }) => (
          <FormItem>
            <FormLabel>Apartment, suite, etc. (Optional)</FormLabel>
            <FormControl><Input placeholder="Apt 4B" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="New York" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="state" render={({ field }) => (
            <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="NY" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="zipCode" render={({ field }) => (
            <FormItem><FormLabel>Zip / Postal Code</FormLabel><FormControl><Input placeholder="10001" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="country" render={({ field }) => (
            <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="United States" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="phoneNumber" render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number (Optional)</FormLabel>
            <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Continue to Review'}
        </Button>
      </form>
    </Form>
  );
}
