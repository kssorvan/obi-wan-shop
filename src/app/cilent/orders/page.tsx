"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingBag, PackageSearch } from 'lucide-react';
import Link from 'next/link';

// Mock order data
const mockUserOrders = [
  { id: 'SS-1700000000000', date: '2024-07-15', total: 149.99, status: 'Delivered', items: 2 },
  { id: 'SS-1700000001122', date: '2024-07-20', total: 79.50, status: 'Shipped', items: 1 },
  { id: 'SS-1700000002345', date: '2024-07-22', total: 220.00, status: 'Processing', items: 3 },
];


export default function MyOrdersPage() {

  // In a real app, fetch orders for the logged-in user
  const orders = mockUserOrders;

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
                <Link href="/products">Browse Products</Link>
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
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </div>
                    <CardDescription>Placed on: {new Date(order.date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-0">
                    <div>
                      <p className="text-sm text-muted-foreground">{order.items} item(s)</p>
                      <p className="text-lg font-semibold text-foreground">Total: ${order.total.toFixed(2)}</p>
                    </div>
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                      <Link href={`/orders/${order.id}/track`}>View Details & Track</Link>
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
