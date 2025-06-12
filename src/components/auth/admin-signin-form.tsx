
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
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
import { AuthFormWrapper } from "./auth-form-wrapper";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { User } from "@/types";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Admin passwords can be anything in mock
});

export function AdminSignInForm() {
  const { signIn, signOut, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const loggedInUser: User = await signIn(values.email, values.password);
      
      if (loggedInUser.role === 'admin' || loggedInUser.role === 'superuser') {
        toast({ title: "Admin Sign In Successful!", description: `Welcome, ${loggedInUser.name || loggedInUser.email}!` });
        router.push('/admin/dashboard');
      } else {
        // If a non-admin user signs in successfully via admin form, sign them out and show error
        await signOut(); // Ensure session is cleared
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have admin privileges. Please use the regular sign-in.",
        });
        form.reset(); // Clear form
        // Optionally redirect to regular sign-in
        // router.push('/auth/signin'); 
      }
    } catch (error: any) {
      // This catches errors from signIn (e.g., invalid credentials)
      toast({
        variant: "destructive",
        title: "Admin Sign In Failed",
        description: error.message || "Please check your credentials and try again.",
      });
    }
  }

  return (
    <AuthFormWrapper
      title="Admin Sign In"
      description="Access the Obi-Wan-Shop Admin Panel."
      footerContent={
        <>
          Not an admin?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            User Sign In
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email</FormLabel>
                <FormControl>
                  <Input placeholder="admin@example.com" {...field} autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} autoComplete="current-password"/>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In as Admin"}
            {!isLoading && <ShieldCheck size={18} className="ml-2" />}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
