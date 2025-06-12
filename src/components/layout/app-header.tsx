
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import { Heart, ShoppingCart, UserCircle, LogOut, Menu, Search, Settings, Bell, Sun, Moon, Eye, MoreHorizontal, Palette, Facebook, Twitter, Instagram } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavigationLinks from './navigation-links';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AppHeader() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { itemCount } = useCart();
  const { favoritesCount } = useFavorites();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { toast } = useToast();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-4">
         <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 pt-8 bg-sidebar text-sidebar-foreground">
              <div className="p-4 mb-4">
                <Logo size="md" />
              </div>
              <NavigationLinks layout="vertical" className="text-sidebar-foreground" />
            </SheetContent>
          </Sheet>
          <div className="hidden md:block">
             <Logo size="md" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
           <NavigationLinks layout="horizontal" />
        </nav>
        
        <TooltipProvider delayDuration={100}>
          <div className="flex items-center gap-1 sm:gap-2">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Input
                type="search"
                name="search"
                placeholder="Search products..."
                className="h-9 pr-10 w-32 lg:w-64 rounded-full text-sm"
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground">
                <Search size={18} />
              </Button>
            </form>

            {/* Theme Dropdown */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Change theme">
                      <Palette className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                      <Sun className="mr-2 h-4 w-4" /> Light Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      <Moon className="mr-2 h-4 w-4" /> Dark Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setTheme('night');
                      toast({ title: "Night Mode (Conceptual)", description: "A 'night' theme needs to be defined in globals.css for a visual change." });
                    }}>
                      <Eye className="mr-2 h-4 w-4" /> Night Mode
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change theme</p>
              </TooltipContent>
            </Tooltip>


            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild className="relative">
                  <Link href="/favorites">
                    <Heart className="h-5 w-5" />
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                        {favoritesCount}
                      </span>
                    )}
                    <span className="sr-only">Favorites</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Favorites</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild className="relative">
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                        {itemCount}
                      </span>
                    )}
                    <span className="sr-only">Cart</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Shopping Cart</p>
              </TooltipContent>
            </Tooltip>
            
            {/* More Options Dropdown */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="More options">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuLabel>Connect</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer"><Facebook className="mr-2 h-4 w-4" />Facebook</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer"><Twitter className="mr-2 h-4 w-4" />Twitter / X</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer"><Instagram className="mr-2 h-4 w-4" />Instagram</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>

            {user ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.name ? `https://avatar.vercel.sh/${user.name}.png` : undefined} alt={user.name || user.email} />
                          <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" /> Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders"><ShoppingCart className="mr-2 h-4 w-4" /> My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/notifications"><Bell className="mr-2 h-4 w-4" /> Notifications</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings/notifications"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} disabled={authLoading}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>User account</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/signin">
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
}
