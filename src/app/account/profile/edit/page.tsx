
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { putToApi } from "@/lib/api";
import { useState } from "react";

const profileEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  email: z.string().email("Invalid email address."), // Email change might need verification flow
  phone: z.string().optional(), // Assuming phone is optional
});

type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

export default function EditProfilePage() {
  const { user, recheckUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      // @ts-ignore TODO: Add phone to User type if it exists on API
      phone: user?.phone || "", 
    },
    // Re-populate form if user data changes (e.g., after initial load)
    values: user ? { 
        name: user.name || "", 
        email: user.email, 
        // @ts-ignore
        phone: user.phone || "" 
    } : undefined,
  });

  const onSubmit = async (data: ProfileEditFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure only changed values are sent, or send all if API handles it
      const payload: Partial<ProfileEditFormValues> = {};
      if (data.name !== user?.name) payload.name = data.name;
      if (data.email !== user?.email) payload.email = data.email;
      // @ts-ignore
      if (data.phone !== user?.phone) payload.phone = data.phone;

      if (Object.keys(payload).length === 0) {
        toast({ title: "No changes made." });
        setIsSubmitting(false);
        return;
      }

      await putToApi('/profile', payload);
      await recheckUser(); // Re-fetch user data to update context
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
      router.push("/account/profile");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-xl mx-auto">
       <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Edit Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        {authIsLoading && !user ? (
            <CardContent className="flex justify-center items-center h-32">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Full Name</Label>
                      <FormControl>
                        <Input id="name" placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email Address</Label>
                       <FormControl>
                        <Input id="email" type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                       <p className="text-xs text-muted-foreground mt-1">Changing email might require re-verification by the API.</p>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  // @ts-ignore
                  name="phone" 
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <FormControl>
                        <Input id="phone" type="tel" placeholder="Your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || authIsLoading}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
        )}
      </Card>
    </div>
  );
}
