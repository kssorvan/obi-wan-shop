
"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, MapPin, CalendarDays, ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import type { Order, CartItem } from '@/types'; // Assuming CartItem is also needed if order items are displayed
import { getFromApi } from '@/lib/api';
import { Alert } from '@/components/ui/alert';

// Define a more detailed Order type if needed for tracking, including history
interface OrderTrackingDetails extends Order {
    history?: Array<{ status: string; date: string; location: string }>;
    estimatedDelivery?: string;
    shippedVia?: string;
    // Add other fields returned by your /api/orders/{id} endpoint
}

const statusToProgress: Record<string, number> = {
    'pending': 10,
    'processing': 30,
    'shipped': 50,
    'in transit': 70, // Example if API returns this
    'out for delivery': 90, // Example
    'delivered': 100,
    'cancelled': 0, // Or handle differently
};


export default function TrackOrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderTrackingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
        setError("Order ID is missing.");
        setIsLoading(false);
        return;
    }
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrder = await getFromApi<OrderTrackingDetails>(`/orders/${orderId}`);
        // Mock history if API doesn't provide it yet
        if (!fetchedOrder.history && fetchedOrder.status) {
            fetchedOrder.history = [{ status: fetchedOrder.status.charAt(0).toUpperCase() + fetchedOrder.status.slice(1), date: fetchedOrder.orderDate, location: 'Processing Center'}];
            if (fetchedOrder.status === 'delivered') {
                 fetchedOrder.history.unshift({ status: 'Order Placed', date: new Date(new Date(fetchedOrder.orderDate).getTime() - 86400000).toISOString() , location: 'Online Store'}); // Mock placed date
            }
        }
        // Mock estimated delivery if not present
        if (!fetchedOrder.estimatedDelivery) {
            fetchedOrder.estimatedDelivery = new Date(new Date(fetchedOrder.orderDate).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString();
        }
        setOrder(fetchedOrder);
      } catch (err: any) {
        console.error(`Failed to fetch order ${orderId}:`, err);
        setError(err.message || `Could not load details for order #${orderId}.`);
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Loading order tracking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Order</AlertTitle>
        <CardDescription>{error}</CardDescription>
         <Button onClick={() => router.back()} variant="outline" className="mt-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
      </Alert>
    );
  }

  if (!order) {
    return (
      <Card className="shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Order Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">We couldn&apos;t find tracking information for order #{orderId}.</p>
          <Button onClick={() => router.push('/account/orders')} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to My Orders
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const currentStatus = order.status.charAt(0).toUpperCase() + order.status.slice(1);
  const progressValue = statusToProgress[order.status.toLowerCase()] || 0;

  return (
    <div className="space-y-8">
       <Button onClick={() => router.back()} variant="outline" className="mb-2">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
       </Button>
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center">
            <Truck className="mr-3 h-8 w-8" /> Track Order #{order.id}
          </CardTitle>
          <CardDescription>Current Status: <span className="font-semibold text-primary">{currentStatus}</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Progress value={progressValue} className="w-full h-3 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Pending</span>
                    <span>Processing</span>
                    <span>Shipped</span>
                    {/* Add more status labels if your API supports them e.g. In Transit */}
                    <span>Delivered</span>
                </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2 p-4 bg-secondary/20 rounded-md">
                    <h3 className="font-semibold text-md text-primary mb-1">Order Information</h3>
                    <p><CalendarDays className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><Package className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Items:</strong> {order.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
                    <p><Truck className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Shipped Via:</strong> {order.shippedVia || 'Standard'}</p>
                    {order.trackingNumber && <p><MapPin className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Tracking #:</strong> {order.trackingNumber}</p>}
                    <p><CalendarDays className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Estimated Delivery:</strong> {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'N/A'}</p>
                </div>
                 <div className="space-y-2 p-4 bg-secondary/20 rounded-md">
                    <h3 className="font-semibold text-md text-primary mb-1">Shipping Address</h3>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.streetAddress}{order.shippingAddress.aptSuite ? `, ${order.shippingAddress.aptSuite}`: ''}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                </div>
            </div>

            <Separator />

            {order.history && order.history.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-primary mb-3">Order History</h3>
                    <div className="space-y-4">
                        {order.history.slice().reverse().map((event, index) => (
                            <div key={index} className="flex items-start gap-3">
                               <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted'}`}>
                                 <Package className={`h-3 w-3 ${index === 0 ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                               </div>
                               <div>
                                    <p className={`font-medium ${index === 0 ? 'text-primary' : 'text-foreground'}`}>{event.status}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()} - {event.location}</p>
                               </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
