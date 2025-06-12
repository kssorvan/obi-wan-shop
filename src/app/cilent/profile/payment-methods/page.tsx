
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, PlusCircle, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PaymentMethod {
    id: string;
    type: 'Credit Card' | 'PayPal';
    last4?: string;
    expiry?: string; // MM/YY
    email?: string; // For PayPal
    isDefault: boolean;
}

// Mock payment methods
const mockPaymentMethods: PaymentMethod[] = [
    { id: 'pm_1', type: 'Credit Card', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 'pm_2', type: 'PayPal', email: 'user@example.com', isDefault: false },
];

export default function ManagePaymentMethodsPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);

  const handleDelete = (id: string) => {
    // API call to delete
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  }
  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({...pm, isDefault: pm.id === id })));
  }

  return (
    <div className="max-w-xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle className="text-2xl font-headline text-primary">Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods.</CardDescription>
            </div>
             <Button asChild variant="outline" className="text-primary border-primary hover:bg-primary/10">
                <Link href="/profile/payment-methods/add"> {/* Placeholder for add page */}
                <PlusCircle className="mr-2 h-4 w-4" /> Add New
                </Link>
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
           {paymentMethods.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No payment methods saved.</p>
          ) : (
            paymentMethods.map(pm => (
              <Card key={pm.id} className="p-4 bg-secondary/20 flex justify-between items-start">
                <div>
                    <div className="flex items-center font-semibold text-foreground">
                        <CreditCard className="mr-2 h-5 w-5 text-primary" />
                        {pm.type} {pm.isDefault && <span className="text-xs text-primary font-normal ml-2">(Default)</span>}
                    </div>
                    {pm.type === 'Credit Card' && pm.last4 && (
                        <p className="text-sm text-muted-foreground ml-7">Ending in •••• {pm.last4}, Expires {pm.expiry}</p>
                    )}
                    {pm.type === 'PayPal' && pm.email && (
                        <p className="text-sm text-muted-foreground ml-7">{pm.email}</p>
                    )}
                    {!pm.isDefault && (
                         <Button variant="link" size="sm" className="p-0 h-auto mt-1 ml-7 text-primary" onClick={() => handleSetDefault(pm.id)}>
                            Set as Default
                        </Button>
                    )}
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => router.push(`/profile/payment-methods/edit/${pm.id}`)}> {/* Placeholder for edit page */}
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(pm.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
