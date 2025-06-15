
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, BellDot, Save, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { getFromApi, postToApi } from "@/lib/api";
import { Alert } from "@/components/ui/alert";

const notificationsSettingsSchema = z.object({
  orderUpdates: z.boolean().default(true),
  promotions: z.boolean().default(true),
  styleRecommendations: z.boolean().default(false),
  appUpdates: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
});

type NotificationsSettingsFormValues = z.infer<typeof notificationsSettingsSchema>;

export default function NotificationSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<NotificationsSettingsFormValues>({
    resolver: zodResolver(notificationsSettingsSchema),
    defaultValues: { // These will be overridden by fetched data
      orderUpdates: true,
      promotions: true,
      styleRecommendations: false,
      appUpdates: true,
      emailNotifications: true,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsFetching(true);
      setFetchError(null);
      try {
        const currentSettings = await getFromApi<NotificationsSettingsFormValues>('/profile/settings/notifications');
        if (currentSettings) {
          form.reset(currentSettings);
        }
      } catch (err: any) {
        console.error("Failed to fetch notification settings:", err);
        setFetchError(err.message || "Could not load your current settings.");
      } finally {
        setIsFetching(false);
      }
    };
    fetchSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.reset]);

  const onSubmit = async (data: NotificationsSettingsFormValues) => {
    setIsLoading(true);
    try {
      await postToApi('/profile/settings/notifications', data);
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  if (fetchError) {
     return (
      <Alert variant="destructive" className="my-8 max-w-lg mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Settings</AlertTitle>
        <CardDescription>{fetchError}</CardDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <Settings className="mr-3 h-8 w-8" /> Notification Settings
          </CardTitle>
          <CardDescription>Manage how you receive notifications from Obi-Wan-Shop.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="orderUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-secondary/20">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderUpdates" className="text-base">Order Updates</Label>
                      <FormDescription>
                        Receive notifications about your order status, shipping, and delivery.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="orderUpdates"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="promotions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-secondary/20">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotions" className="text-base">Promotions & Offers</Label>
                      <FormDescription>
                        Get notified about sales, special offers, and new promotions.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="promotions"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="styleRecommendations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-secondary/20">
                    <div className="space-y-0.5">
                      <Label htmlFor="styleRecommendations" className="text-base">AI Style Recommendations</Label>
                      <FormDescription>
                        Receive alerts when new AI-powered style recommendations are available for you.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="styleRecommendations"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="appUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-secondary/20">
                    <div className="space-y-0.5">
                      <Label htmlFor="appUpdates" className="text-base">App Updates & News</Label>
                      <FormDescription>
                       Stay informed about new features, app updates, and important announcements.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="appUpdates"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-secondary/20">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                      <FormDescription>
                       Receive important notifications via email as well.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="emailNotifications"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="pt-4">
                 <Button type="submit" size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-5 w-5" />} Save Preferences
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
