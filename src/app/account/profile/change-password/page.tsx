
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, KeyRound, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { postToApi } from "@/lib/api";


const passwordChangeSchema = z.object({
  current_password: z.string().min(1, "Current password is required."), // Min 1 for mock, adjust for real rules
  new_password: z.string().min(8, "New password must be at least 8 characters."),
  new_password_confirmation: z.string(),
}).refine(data => data.new_password === data.new_password_confirmation, {
  message: "New passwords don't match.",
  path: ["new_password_confirmation"],
});

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

export default function ChangePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const onSubmit = async (data: PasswordChangeFormValues) => {
    setIsLoading(true);
    try {
      await postToApi('/profile/change-password', data);
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      form.reset();
      // Consider redirecting to profile or sign-in page if session needs refresh
      router.push("/account/profile"); 
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password Change Failed",
        description: error.message || "Could not update password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary flex items-center">
            <KeyRound className="mr-2 h-6 w-6"/> Change Password
          </CardTitle>
          <CardDescription>Update your account password. Make sure it&apos;s strong!</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
               <FormField
                  control={form.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="current_password">Current Password</Label>
                      <FormControl>
                        <Input id="current_password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="new_password">New Password</Label>
                      <FormControl>
                        <Input id="new_password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="new_password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
                      <FormControl>
                        <Input id="new_password_confirmation" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />} Update Password
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
