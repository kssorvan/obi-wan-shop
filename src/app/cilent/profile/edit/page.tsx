
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";


const profileEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").optional(),
  email: z.string().email("Invalid email address.").optional(), // Usually email change requires verification
});

type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

export default function EditProfilePage() {
  const { user } = useAuth(); // In a real app, you'd have an updateUser function from context
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = (data: ProfileEditFormValues) => {
    // Simulate updating user profile
    console.log("Updated profile data:", data);
    // In a real app: await updateUser(data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
    router.push("/profile");
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
                       <p className="text-xs text-muted-foreground mt-1">Changing email might require re-verification.</p>
                    </FormItem>
                  )}
                />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
