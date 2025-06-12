
"use client";
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Mail, Edit3, KeyRound, MapPin, CreditCardIcon } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user, signOut } = useAuth();

  if (!user) {
    // This should ideally be handled by the AppLayout, but as a fallback:
    return <div className="text-center py-10">Please sign in to view your profile.</div>;
  }

  const profileActions = [
    { label: "Edit Profile", href: "/profile/edit", icon: Edit3 },
    { label: "Manage Addresses", href: "/profile/addresses", icon: MapPin },
    { label: "Payment Methods", href: "/profile/payment-methods", icon: CreditCardIcon },
    { label: "Change Password", href: "/profile/change-password", icon: KeyRound },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={user.name ? `https://avatar.vercel.sh/${user.name}.png` : undefined} alt={user.name || user.email} />
              <AvatarFallback className="text-3xl bg-background text-primary">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-4xl font-headline">{user.name || 'Obi-Wan-Shop User'}</CardTitle>
              <CardDescription className="text-lg text-primary-foreground/80">{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-primary mb-3">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-md">
                <UserCircle className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">{user.name || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-md">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-foreground">{user.email}</span>
              </div>
              {/* Add more user details here if available */}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold text-primary mb-4">Profile Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileActions.map(action => (
                <Button key={action.href} variant="outline" asChild className="justify-start text-md p-6 hover:bg-accent/10 hover:border-accent hover:text-accent">
                  <Link href={action.href}>
                    <action.icon className="mr-3 h-5 w-5" /> {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <Separator />
          
          <Button variant="destructive" onClick={signOut} className="w-full sm:w-auto">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
