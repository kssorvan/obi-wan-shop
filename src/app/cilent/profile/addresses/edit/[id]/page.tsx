
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Home, Loader2 } from "lucide-react";
import { getFromApi, putToApi } from "@/lib/api";
import type { Address } from "@/types";
import { useEffect, useState } from "react";

// Re-using the address schema
const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  streetAddress: z.string().min(5, "Street address is required."),
  aptSuite: z.string().optional(),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State/Province is required."),
  zipCode: z.string().min(5, "Zip/Postal code is required."),
  country: z.string().min(2, "Country is required."),
  phoneNumber: z.string().optional(),
  isDefault: z.boolean().default(false).optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const addressId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      streetAddress: "",
      aptSuite: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNumber: "",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (!addressId) return;
    const fetchAddress = async () => {
      setIsFetching(true);
      try {
        // Assuming your Address type from API matches AddressFormValues or is compatible
        const fetchedAddress = await getFromApi<Address>(`/profile/addresses/${addressId}`);
        form.reset(fetchedAddress); // Populate form with fetched data
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to load address",
          description: error.message || "Could not fetch address details.",
        });
        router.push('/profile/addresses');
      } finally {
        setIsFetching(false);
      }
    };
    fetchAddress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressId, form.reset, router, toast]);

  async function onSubmit(values: AddressFormValues) {
    setIsLoading(true);
    try {
      await putToApi(`/profile/addresses/${addressId}`, values);
      toast({
        title: "Address Updated",
        description: "Your address has been successfully updated.",
      });
      router.push('/profile/addresses');
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to update address",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading address...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Addresses
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary flex items-center">
            <Home className="mr-2 h-6 w-6" /> Edit Address
          </CardTitle>
          <CardDescription>Update the details for this address.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="streetAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="aptSuite" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment, suite, etc. (Optional)</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="zipCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip / Postal Code</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl><Input type="tel" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* isDefault is usually handled by a separate action on the list page */}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Update Address
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
