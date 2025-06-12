
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit3, Trash2, ArrowLeft, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Address } from "@/types";
import { getFromApi, deleteFromApi, putToApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

export default function ManageAddressesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // To show loader on specific address action

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) {
        router.push('/auth/signin'); // Should be handled by layout, but good fallback
        return;
      }
      setIsLoading(true);
      try {
        const fetchedAddresses = await getFromApi<Address[]>('/profile/addresses');
        setAddresses(fetchedAddresses || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to load addresses",
          description: error.message || "Could not fetch addresses from the server.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, [user, router, toast]);

  const handleDeleteAddress = async (id: string) => {
    setIsUpdating(id);
    try {
      await deleteFromApi(`/profile/addresses/${id}`);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast({ title: "Address Deleted", description: "The address has been successfully removed." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete address",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setIsUpdating(id);
    try {
      // Assuming API endpoint to set default, backend handles unsetting other defaults
      const updatedAddress = await putToApi<Address>(`/profile/addresses/${id}/default`, {}); 
      setAddresses(prev => prev.map(addr => 
        addr.id === id ? updatedAddress : { ...addr, isDefault: false }
      ));
      toast({ title: "Default Address Updated", description: "The address has been set as default." });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to set default address",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-headline text-primary flex items-center">
                <Home className="mr-2 h-6 w-6" /> Manage Addresses
            </CardTitle>
            <CardDescription>Add, edit, or remove your shipping addresses.</CardDescription>
          </div>
          <Button asChild variant="outline" className="text-primary border-primary hover:bg-primary/10">
            <Link href="/profile/addresses/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {addresses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">You haven't added any addresses yet.</p>
          ) : (
            addresses.map(address => (
              <Card key={address.id} className="p-4 bg-secondary/20 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{address.fullName} {address.isDefault && <span className="text-xs text-primary font-normal ml-2">(Default)</span>}</p>
                    <p className="text-sm text-muted-foreground">{address.streetAddress}{address.aptSuite ? `, ${address.aptSuite}`: ''}</p>
                    <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="text-sm text-muted-foreground">{address.country}</p>
                    {address.phoneNumber && <p className="text-sm text-muted-foreground">Phone: {address.phoneNumber}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 absolute top-2 right-2 sm:static">
                    {isUpdating === address.id ? (
                       <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => router.push(`/profile/addresses/edit/${address.id}`)} disabled={!!isUpdating}>
                            <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteAddress(address.id)} disabled={!!isUpdating}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </>
                    )}
                  </div>
                </div>
                 {!address.isDefault && (
                    <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-primary" onClick={() => handleSetDefault(address.id)} disabled={!!isUpdating || isUpdating === address.id}>
                        {isUpdating === address.id && isUpdating !== null ? 'Updating...' : 'Set as Default'}
                    </Button>
                )}
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    