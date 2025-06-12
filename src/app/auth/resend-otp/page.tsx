"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthFormWrapper } from "@/components/auth/auth-form-wrapper";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";

export default function ResendOtpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // In a real app, get the target (email/phone) from state or query params
  const verificationTarget = "user@example.com"; 

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setCanResend(false);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    toast({ 
      title: "OTP Resent", 
      description: `A new OTP has been sent to ${verificationTarget}.`,
    });
    setCountdown(60); // Reset countdown
    router.push("/auth/otp"); // Navigate back to OTP entry page
  };

  return (
    <AuthFormWrapper
      title="Resend OTP"
      description={`Request a new One-Time Password for ${verificationTarget}.`}
      footerContent={
        <>
          Remembered your password or OTP?{" "}
          <Link href="/auth/signin" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
          {" or "}
           <Link href="/auth/otp" className="font-medium text-primary hover:underline">
            Enter OTP
          </Link>
        </>
      }
    >
      <div className="space-y-6 text-center">
        {!canResend && (
          <p className="text-muted-foreground">
            Please wait {countdown} seconds before requesting a new OTP.
          </p>
        )}
        <Button 
          onClick={handleResendOtp} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
          disabled={isLoading || !canResend}
        >
          {isLoading ? "Sending..." : "Resend OTP"}
          {!isLoading && <Send size={18} className="ml-2" />}
        </Button>
      </div>
    </AuthFormWrapper>
  );
}
