
"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Settings, Trash2, ShoppingBag, Sparkles, Loader2, AlertTriangle } from 'lucide-react'; // Added Sparkles, Loader2, AlertTriangle
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getFromApi, postToApi, deleteFromApi } from '@/lib/api'; // Import API service
import { useToast } from '@/hooks/use-toast';
import { Alert } from '@/components/ui/alert';

interface Notification {
  id: string; // Assuming ID is string from backend
  title: string;
  message: string; // Or 'data.message' if nested
  date: string; // 'created_at' from backend
  read: boolean; // Or 'read_at' which could be null/timestamp
  type: 'order' | 'promo' | 'system' | 'general'; // Align with backend types
  // Add any other fields your API returns, e.g., link, icon_name
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming API returns an array of Notification objects
      // Or an object like { data: Notification[] } if paginated
      const fetchedNotifications = await getFromApi<Notification[]>('/notifications');
      setNotifications(fetchedNotifications || []);
    } catch (err: any)_MOD_REMOVE_ {
      console.error("Failed to fetch notifications:", err);
      setError(err.message || "Could not load notifications. Please try again later.");
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      // Example: POST /api/notifications/{id}/mark-read
      await postToApi(`/notifications/${id}/mark-read`, {});
      setNotifications(currentNotifications =>
        currentNotifications.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      toast({ title: "Notification marked as read." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to mark as read." });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteFromApi(`/notifications/${id}`);
      setNotifications(currentNotifications => currentNotifications.filter(n => n.id !== id));
      toast({ title: "Notification deleted." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to delete notification." });
    }
  };

  const markAllAsRead = async () => {
     try {
      await postToApi(`/notifications/mark-all-read`, {});
      setNotifications(currentNotifications => currentNotifications.map(n => ({ ...n, read: true })));
      toast({ title: "All notifications marked as read." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to mark all as read." });
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await deleteFromApi(`/notifications/clear-all`); // Or appropriate endpoint
      setNotifications([]);
      toast({ title: "All notifications cleared.", variant: "destructive" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to clear notifications." });
    }
  };

  const getIconForType = (type: Notification['type']) => {
    switch(type) {
      case 'order': return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'promo': return <Sparkles className="h-5 w-5 text-orange-500" />;
      case 'system': return <Settings className="h-5 w-5 text-gray-500" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8 max-w-2xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Fetching Notifications</AlertTitle>
        <CardDescription>{error}</CardDescription>
      </Alert>
    );
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
                <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={notifications.every(n => n.read) || notifications.length === 0}>Mark all as read</Button>
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
          <Link href="/account/settings/notifications" className="text-sm text-primary hover:underline flex items-center justify-center">
            <Settings className="mr-2 h-4 w-4" /> Notification Settings
          </Link>
        </div>
    </div>
  );
}
