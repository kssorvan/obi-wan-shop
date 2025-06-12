
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Save, SettingsIcon, Store, CreditCard, TruckIcon, Loader2 } from "lucide-react";
import type { AdminSiteSettings, AdminPaymentSettings, AdminShippingSettings } from "@/types";
import { useEffect, useState } from "react";
import { getFromApi, postToApi } from "@/lib/api";

const siteSettingsSchema = z.object({
  siteName: z.string().min(3, "Site name must be at least 3 characters."),
  supportEmail: z.string().email("Invalid email address."),
  maintenanceMode: z.boolean().default(false),
});

const paymentSettingsSchema = z.object({
    stripeApiKey: z.string().startsWith("sk_").min(20, "Invalid Stripe API key.").optional().or(z.literal('')),
    paypalClientId: z.string().min(20, "Invalid PayPal Client ID.").optional().or(z.literal('')),
    enablePaypal: z.boolean().default(false),
});

const shippingSettingsSchema = z.object({
    defaultShippingRate: z.coerce.number().min(0, "Shipping rate cannot be negative."),
    freeShippingThreshold: z.coerce.number().min(0, "Threshold cannot be negative."),
});

// Combined type for API
interface AllAdminSettings {
  site: AdminSiteSettings;
  payment: AdminPaymentSettings;
  shipping: AdminShippingSettings;
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const siteForm = useForm<AdminSiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "",
      supportEmail: "",
      maintenanceMode: false,
    },
  });

  const paymentForm = useForm<AdminPaymentSettings>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      stripeApiKey: "",
      paypalClientId: "",
      enablePaypal: false,
    },
  });
  
  const shippingForm = useForm<AdminShippingSettings>({
    resolver: zodResolver(shippingSettingsSchema),
    defaultValues: {
      defaultShippingRate: 0,
      freeShippingThreshold: 0,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsFetching(true);
      try {
        // Assuming your API returns an object with keys 'site', 'payment', 'shipping'
        const data = await getFromApi<AllAdminSettings>('/admin/settings');
        if (data.site) siteForm.reset(data.site);
        if (data.payment) paymentForm.reset(data.payment);
        if (data.shipping) shippingForm.reset(data.shipping);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to load settings",
          description: error.message || "Could not fetch settings from the server.",
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSaveSettings = async (settingsData: Partial<AllAdminSettings>, sectionName: string) => {
    setIsLoading(true);
    try {
      await postToApi('/admin/settings', settingsData); // Send only the updated section or entire object
      toast({ title: `${sectionName} Settings Saved!`, description: `Your ${sectionName.toLowerCase()} settings have been updated.` });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `Failed to save ${sectionName.toLowerCase()} settings`,
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSiteSubmit = (data: AdminSiteSettings) => {
    handleSaveSettings({ site: data }, "Site");
  };
  
  const onPaymentSubmit = (data: AdminPaymentSettings) => {
     handleSaveSettings({ payment: data }, "Payment");
  };

  const onShippingSubmit = (data: AdminShippingSettings) => {
    handleSaveSettings({ shipping: data }, "Shipping");
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8" /> Application Settings
          </CardTitle>
          <CardDescription>Configure various aspects of your application.</CardDescription>
        </CardHeader>
      </Card>

      {/* Site Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center"><Store className="mr-2 h-5 w-5"/> Site Information</CardTitle>
          <CardDescription>Manage basic site details and maintenance mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...siteForm}>
            <form onSubmit={siteForm.handleSubmit(onSiteSubmit)} className="space-y-6">
              <FormField
                control={siteForm.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl><Input placeholder="Your E-commerce Site" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={siteForm.control}
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl><Input type="email" placeholder="support@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={siteForm.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-secondary/20">
                    <div className="space-y-0.5">
                      <FormLabel>Maintenance Mode</FormLabel>
                      <FormDescription>
                        Temporarily disable public access to the site. Admins can still access.
                      </FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Site Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Payment Gateway Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center"><CreditCard className="mr-2 h-5 w-5"/> Payment Gateways</CardTitle>
          <CardDescription>Configure your payment provider integrations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
              <FormField
                control={paymentForm.control}
                name="stripeApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stripe API Key (Secret)</FormLabel>
                    <FormControl><Input type="password" placeholder="sk_live_xxxxxxxxxxxxxx" {...field} /></FormControl>
                    <FormDescription>Leave blank if Stripe is not used or to keep current key.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={paymentForm.control}
                name="paypalClientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PayPal Client ID</FormLabel>
                    <FormControl><Input placeholder="Axxxxxxxxxxxx_Paypal-Client-ID_xxxxxxxxxxx" {...field} /></FormControl>
                     <FormDescription>Leave blank if PayPal is not used or to keep current ID.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={paymentForm.control}
                name="enablePaypal"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-secondary/20">
                    <div className="space-y-0.5">
                      <FormLabel>Enable PayPal</FormLabel>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Payment Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

       {/* Shipping Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center"><TruckIcon className="mr-2 h-5 w-5"/> Shipping Configuration</CardTitle>
          <CardDescription>Set up default shipping rates and options.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...shippingForm}>
            <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-6">
              <FormField
                control={shippingForm.control}
                name="defaultShippingRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Shipping Rate ($)</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="5.99" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={shippingForm.control}
                name="freeShippingThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Free Shipping Threshold ($)</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="50.00" {...field} /></FormControl>
                    <FormDescription>Order total above which shipping is free. Set to 0 to disable.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Shipping Settings
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

    </div>
  );
}

    