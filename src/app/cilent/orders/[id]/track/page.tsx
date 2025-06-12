"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, MapPin, CalendarDays, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

// Mock order data for a specific order
const getMockOrderById = (orderId: string) => {
    const orders = [
      { id: 'SS-1700000000000', date: '2024-07-15', total: 149.99, status: 'Delivered', items: 2, estimatedDelivery: '2024-07-18', trackingNumber: 'STYLSNS12345XYZ', shippedVia: 'StyleSense Express',
        history: [
            { status: 'Order Placed', date: '2024-07-15', location: 'Online Store'},
            { status: 'Processing', date: '2024-07-15', location: 'Warehouse A'},
            { status: 'Shipped', date: '2024-07-16', location: 'Warehouse A'},
            { status: 'In Transit', date: '2024-07-17', location: 'City Hub B'},
            { status: 'Out for Delivery', date: '2024-07-18', location: 'Local Delivery Center'},
            { status: 'Delivered', date: '2024-07-18', location: 'Your Address'},
        ]
      },
      { id: 'SS-1700000001122', date: '2024-07-20', total: 79.50, status: 'Shipped', items: 1, estimatedDelivery: '2024-07-25', trackingNumber: 'STYLSNS67890ABC', shippedVia: 'Standard Shipping',
        history: [
            { status: 'Order Placed', date: '2024-07-20', location: 'Online Store'},
            { status: 'Processing', date: '2024-07-21', location: 'Warehouse C'},
            { status: 'Shipped', date: '2024-07-22', location: 'Warehouse C'},
        ]
      },
      { id: 'SS-1700000002345', date: '2024-07-22', total: 220.00, status: 'Processing', items: 3, estimatedDelivery: '2024-07-28',
        history: [
            { status: 'Order Placed', date: '2024-07-22', location: 'Online Store'},
            { status: 'Processing', date: '2024-07-23', location: 'Warehouse B'},
        ]
      },
    ];
    return orders.find(o => o.id === orderId);
};

const statusToProgress: Record<string, number> = {
    'Order Placed': 10,
    'Processing': 30,
    'Shipped': 50,
    'In Transit': 70,
    'Out for Delivery': 90,
    'Delivered': 100,
};


export default function TrackOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const order = getMockOrderById(params.id);

  if (!order) {
    return (
      <Card className="shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Order Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">We couldn&apos;t find tracking information for order #{params.id}.</p>
          <Button onClick={() => router.push('/orders')} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to My Orders
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const currentStatus = order.history[order.history.length - 1].status;
  const progressValue = statusToProgress[currentStatus] || 0;

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
                    <span>Order Placed</span>
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>In Transit</span>
                    <span>Delivered</span>
                </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2 p-4 bg-secondary/20 rounded-md">
                    <h3 className="font-semibold text-md text-primary mb-1">Order Information</h3>
                    <p><CalendarDays className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                    <p><Package className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Items:</strong> {order.items}</p>
                    <p><Truck className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Shipped Via:</strong> {order.shippedVia || 'N/A'}</p>
                    {order.trackingNumber && <p><MapPin className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Tracking #:</strong> {order.trackingNumber}</p>}
                    <p><CalendarDays className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                </div>
                 <div className="space-y-2 p-4 bg-secondary/20 rounded-md">
                    <h3 className="font-semibold text-md text-primary mb-1">Shipping Address</h3>
                    {/* Mock address for now */}
                    <p>John Doe</p>
                    <p>123 Style Avenue, Fashion City, NY 10001</p>
                    <p>United States</p>
                </div>
            </div>

            <Separator />

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

        </CardContent>
      </Card>
    </div>
  );
}
