
"use client";
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ShieldAlert, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar'; // Updated import
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); 

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'admin' && user.role !== 'superuser'))) {
      router.replace('/auth/signin?message=Admin%20access%20required');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superuser')) {
    return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You do not have permission to view this page.</p>
        <Button onClick={() => router.push('/shop/products')}>Go to Shop</Button> {/* Updated redirect for regular users */}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40 text-sidebar-foreground">
      <aside 
        className={`hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full w-0"
        }`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center"> {/* Updated Link */}
            <Logo size="sm" />
            <span className="ml-2 text-lg font-semibold text-sidebar-primary">Admin</span>
          </Link>
        </div>
        <Sidebar onLinkClick={() => {}} /> {/* Updated component */}
      </aside>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0 pt-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border md:hidden">
            <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center"> {/* Updated Link */}
                <Logo size="sm" />
                <span className="ml-2 text-lg font-semibold text-sidebar-primary">Admin</span>
              </Link>
            </div>
          <Sidebar onLinkClick={() => setMobileSidebarOpen(false)} /> {/* Updated component */}
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-col flex-1">
        <header className="sticky top-0 z-30 w-full border-b border-sidebar-border bg-sidebar shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
            <div className="flex items-center">
              <SheetTrigger asChild className="md:hidden mr-2">
                <Button variant="ghost" size="icon">
                  <PanelLeft className="h-6 w-6" />
                </Button>
              </SheetTrigger>
               <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:inline-flex">
                <PanelLeft className="h-6 w-6" />
              </Button>
              <span className="text-xl font-semibold ml-2 text-sidebar-foreground">Admin Panel</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {user.name || user.email}! ({user.role})
              </span>
              <Button variant="outline" size="sm" onClick={signOut} className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                Log Out
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
        <footer className="py-4 text-center text-xs text-muted-foreground border-t border-sidebar-border bg-sidebar">
          Admin Panel &copy; {new Date().getFullYear()} Obi-Wan-Shop
        </footer>
      </div>
    </div>
  );
}
