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
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Home } from "lucide-react";
import { useAuth } from "@/contexts/auth-context"; // Assuming user might have saved addresses

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  streetAddress: z.string().min(5, "Street address is required."),
  aptSuite: z.string().optional(),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State/Province is required."),
  zipCode: z.string().min(5, "Zip/Postal code is required."),
  country: z.string().min(2, "Country is required."),
  phoneNumber: z.string().min(10, "Phone number is required.").optional(),
});

export default function ShippingAddressPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth(); // Can be used to prefill or select saved address

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.name || "",
      streetAddress: "",
      aptSuite: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA", // Default country
      phoneNumber: "",
    },
  });

  function onSubmit(values: z.infer<typeof addressSchema>) {
    // In a real app, save this address to user profile or order
    localStorage.setItem('shippingAddress', JSON.stringify(values));
    toast({
      title: "Address Saved",
      description: "Proceeding to order summary.",
    });
    router.push('/checkout/order-summary');
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <Home className="mr-3 h-7 w-7" /> Shipping Address
          </CardTitle>
          <CardDescription>Where should we send your order?</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aptSuite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment, suite, etc. (Optional)</FormLabel>
                    <FormControl><Input placeholder="Apt 4B" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="New York" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province</FormLabel>
                      <FormControl><Input placeholder="NY" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip / Postal Code</FormLabel>
                      <FormControl><Input placeholder="10001" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input placeholder="United States" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Continue to Order Summary <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
