
"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, Home, Mail } from 'lucide-react';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdParam = searchParams.get('orderId');
  const [orderDetails, setOrderDetails] = useState<any>(null); // Use 'any' for mock, define type for real app
  
  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      if (orderIdParam && parsedOrder.orderId === orderIdParam) {
        setOrderDetails(parsedOrder);
      } else if (!orderIdParam) { // If no orderId in URL, but one in localStorage, maybe show that one or redirect to home.
         // For now, let's assume if there's no orderID in URL, it's invalid access to this page
         router.replace('/home');
      }
    } else if (orderIdParam) { // orderId in URL but nothing in storage
         // Potentially fetch from backend if this were a real app, for now treat as not found
         // router.replace('/home'); // Or show not found
    } else { // No orderId in URL and no stored order
        router.replace('/home');
    }
    // Optional: Clear 'lastOrder' from localStorage after displaying it,
    // or keep it for a short duration.
    // localStorage.removeItem('lastOrder'); 
  }, [orderIdParam, router]);

  if (!orderDetails) { // This will show briefly if redirecting, or if order is genuinely not found
    return (
      <Card className="shadow-xl text-center max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Loading Order Details...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">If you are not redirected, please check the order ID or go to the homepage.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/home">
              <Home className="mr-2 h-5 w-5" /> Go to Homepage
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const { orderId, total, paymentMethod, timestamp } = orderDetails;
  const estimatedDeliveryDate = new Date(new Date(timestamp).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(); // Mock: 5 days from order

  return (
    <Card className="shadow-xl text-center max-w-xl mx-auto">
      <CardHeader className="items-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <CardTitle className="text-4xl font-headline text-primary">Thank You For Your Order!</CardTitle>
        <CardDescription className="text-lg text-muted-foreground pt-2">
          Your order <span className="font-semibold text-primary">{orderId}</span> has been placed successfully.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/30 p-6 rounded-lg text-left space-y-2">
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Date:</strong> {new Date(timestamp).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ${Number(total).toFixed(2)}</p>
          <p><strong>Payment Method:</strong> {paymentMethod === 'creditCard' ? 'Credit Card' : 'PayPal'}</p>
          <p><strong>Estimated Delivery:</strong> {estimatedDeliveryDate}</p>
        </div>
        <p className="text-muted-foreground">
          You will receive an email confirmation shortly with your order details and tracking information once it ships.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/products"> {/* Changed from /home to /products to encourage more shopping */}
              <Home className="mr-2 h-5 w-5" /> Continue Shopping
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
            <Link href={`/orders/${orderId}/track`}> 
              <ShoppingBag className="mr-2 h-5 w-5" /> Track Your Order
            </Link>
          </Button>
        </div>
        <div className="pt-6 border-t text-sm text-muted-foreground">
          <p>Need help with your order?</p>
          <Link href="/contact-us" className="text-primary hover:underline flex items-center justify-center mt-1">
             <Mail className="mr-2 h-4 w-4" /> Contact Support
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
