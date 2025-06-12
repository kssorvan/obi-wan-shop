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
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { useToast } from "@/hooks/use-toast";
import { KeyRound } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits." }).regex(/^\d{6}$/, { message: "OTP must be numeric."}),
});

export default function OtpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // In a real app, you'd get the email/phone from query params or state
  const verificationTarget = "user@example.com"; 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call for OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Simulate success/failure
    if (values.otp === "123456") { // Mock OTP
      toast({ 
        title: "Verification Successful!", 
        description: "Your account has been verified.",
      });
      router.push("/home"); // Or to password reset page if it's for that flow
    } else {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
      });
      form.setError("otp", { message: "Invalid OTP."});
    }
  }

  return (
    <AuthFormWrapper
      title="Enter OTP"
      description={`We've sent a One-Time Password to ${verificationTarget}. Please enter it below.`}
      footerContent={
        <>
          Didn't receive the OTP?{" "}
          <Link href="/auth/resend-otp" className="font-medium text-primary hover:underline">
            Resend OTP
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} maxLength={6} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
            {!isLoading && <KeyRound size={18} className="ml-2" />}
          </Button>
        </form>
      </Form>
    </AuthFormWrapper>
  );
}
