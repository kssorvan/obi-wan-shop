
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added useRouter

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
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import type { User } from "@/types";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function SignInForm() {
  const { signIn, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter(); // Initialize router
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
      toast({ title: "Signed in successfully!", description: `Welcome back to Obi-Wan-Shop, ${loggedInUser.name || loggedInUser.email}!` });
      
      if (loggedInUser.role === 'admin' || loggedInUser.role === 'superuser') {
        router.push('/admin/dashboard');
      } else {
        router.push('/home');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "Please check your credentials and try again.",
      });
    }
  }

  return (
    <AuthFormWrapper
      title="Welcome Back!"
      description="Sign in to continue your style journey with Obi-Wan-Shop."
      footerContent={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign Up
          </Link>
           <span className="mx-2">|</span>
           <Link href="/auth/admin-signin" className="font-medium text-primary hover:underline">
            Admin Sign In
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} autoComplete="email" />
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
          <div className="text-right">
            <Link href="/auth/reset-password" passHref className="text-sm text-primary hover:underline">
                Forgot Password?
            </Link>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
            {!isLoading && <LogIn size={18} className="ml-2" />}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
