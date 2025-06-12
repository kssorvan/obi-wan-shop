"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Order Shipped!', message: 'Your order #SS-1700000001122 has been shipped and is on its way.', date: new Date(Date.now() - 86400000).toISOString(), read: false, type: 'order' },
  { id: '2', title: 'Summer Sale Starts Now!', message: 'Get up to 50% off on selected summer styles. Don\'t miss out!', date: new Date(Date.now() - 86400000 * 2).toISOString(), read: true, type: 'promo' },
  { id: '3', title: 'Password Update Recommended', message: 'For security, we recommend updating your password periodically.', date: new Date(Date.now() - 86400000 * 5).toISOString(), read: true, type: 'system' },
  { id: '4', title: 'New Arrivals: Sneakers', message: 'Check out the latest collection of Trailblazer sneakers.', date: new Date(Date.now() - 86400000 * 0.5).toISOString(), read: false, type: 'promo'},
];


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(currentNotifications =>
      currentNotifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(currentNotifications => currentNotifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
     setNotifications(currentNotifications => currentNotifications.map(n => ({ ...n, read: true })));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const getIconForType = (type: Notification['type']) => {
    switch(type) {
      case 'order': return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'promo': return <Sparkles className="h-5 w-5 text-orange-500" />;
      case 'system': return <Settings className="h-5 w-5 text-gray-500" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  }


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <CardTitle className="text-3xl font-headline text-primary flex items-center">
              <Bell className="mr-3 h-8 w-8" /> Notifications
            </CardTitle>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={notifications.every(n => n.read)}>Mark all as read</Button>
                <Button variant="destructive" size="sm" onClick={deleteAllNotifications} disabled={notifications.length === 0}>
                    <Trash2 className="mr-1 h-4 w-4" /> Clear all
                </Button>
            </div>
          </div>
          <CardDescription>Stay updated with latest news, offers, and order updates.</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <BellOff className="mx-auto h-20 w-20 text-muted-foreground/40 mb-6" />
              <h2 className="text-2xl font-semibold text-muted-foreground mb-3">No Notifications Yet</h2>
              <p className="text-foreground/70">
                You&apos;re all caught up! We&apos;ll let you know when there&apos;s something new.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map(notification => (
                <Card 
                    key={notification.id} 
                    className={`p-4 flex items-start gap-4 transition-all hover:shadow-md ${notification.read ? 'bg-card opacity-70' : 'bg-primary/5'}`}
                >
                  <div className="flex-shrink-0 pt-1">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <h3 className={`font-semibold ${notification.read ? 'text-muted-foreground' : 'text-primary'}`}>{notification.title}</h3>
                    <p className={`text-sm ${notification.read ? 'text-muted-foreground/80' : 'text-foreground/90'}`}>{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(notification.date).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} className="text-xs text-primary">
                        Mark as read
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => deleteNotification(notification.id)} className="text-muted-foreground hover:text-destructive h-7 w-7">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
       <div className="p-6 border-t text-center">
          <Link href="/settings/notifications" className="text-sm text-primary hover:underline flex items-center justify-center">
            <Settings className="mr-2 h-4 w-4" /> Notification Settings
          </Link>
        </div>
    </div>
  );
}
