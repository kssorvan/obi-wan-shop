import type React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from '@/components/ui/logo';

interface AuthFormWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

export function AuthFormWrapper({ title, description, children, footerContent }: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">{title}</CardTitle>
          {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footerContent && (
          <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
            {footerContent}
          </div>
        )}
      </Card>
    </div>
  );
}
