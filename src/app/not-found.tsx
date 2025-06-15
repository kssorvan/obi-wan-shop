
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center bg-background p-6 text-center">
      <SearchX className="h-20 w-20 text-primary mb-8" />
      <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-foreground mb-6">
        Page Not Found
      </h2>
      <p className="text-lg text-muted-foreground mb-10 max-w-md">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild size="lg">
        <Link href="/">Go Back to Homepage</Link>
      </Button>
    </div>
  );
}
