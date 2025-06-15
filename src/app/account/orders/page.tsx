
"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ShoppingBag, PackageSearch, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Order } from '@/types';
import { getFromApi } from '@/lib/api';
import { Alert } from '@/components/ui/alert';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrders = await getFromApi<Order[]>('/orders');
        setOrders(fetchedOrders || []);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        setError(err.message || "Could not load your orders. Please try again later.");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8 max-w-2xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Fetching Orders</AlertTitle>
        <CardDescription>{error}</CardDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <ShoppingBag className="mr-3 h-8 w-8" /> My Orders
          </CardTitle>
          <CardDescription>View your order history and track current shipments.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <PackageSearch className="mx-auto h-20 w-20 text-muted-foreground/40 mb-6" />
              <h2 className="text-2xl font-semibold text-muted-foreground mb-3">No Orders Yet</h2>
              <p className="text-foreground/70 mb-6">
                You haven&apos;t placed any orders. Start shopping to see your orders here.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/shop/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <CardTitle className="text-xl text-primary">Order #{order.id}</CardTitle>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'}`}> {/* For cancelled */}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>Placed on: {new Date(order.orderDate).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-0">
                    <div>
                      <p className="text-sm text-muted-foreground">{order.items.reduce((acc, item) => acc + item.quantity, 0)} item(s)</p>
                      <p className="text-lg font-semibold text-foreground">Total: ${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                      <Link href={`/account/orders/${order.id}/track`}>View Details & Track</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
