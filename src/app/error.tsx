
"use client"; 

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
      <h1 className="text-3xl font-bold text-destructive mb-4">
        Oops! Something went wrong.
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We encountered an unexpected error. Please try again, or contact support if the issue persists.
      </p>
      {error?.message && (
        <pre className="mb-6 p-4 bg-muted text-destructive-foreground rounded-md text-sm whitespace-pre-wrap max-w-lg overflow-x-auto">
          Error: {error.message}
          {error.digest && ` (Digest: ${error.digest})`}
        </pre>
      )}
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          variant="outline"
          size="lg"
          className="border-primary text-primary hover:bg-primary/10"
        >
          Try Again
        </Button>
        <Button onClick={() => window.location.href = '/'} size="lg">
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}
