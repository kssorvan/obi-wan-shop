
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { useAuth } from '@/contexts/auth-context';
// useCart is not directly used for badge here, MiniCart handles its own state
// import { useCart } from '@/contexts/cart-context'; 
import { useFavorites } from '@/contexts/favorites-context';
import { Heart, ShoppingCart, UserCircle, LogOut, Menu, Search, Settings, Bell, Sun, Moon, Palette, Truck, CreditCard, Phone, ChevronDown, List, Info, User, Building } from 'lucide-react'; // Added Info, User, Building for new links
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
// import Navigation from './Navigation'; // Using the renamed Navigation component
import { Input } from '../ui/input';
import { useRouter, usePathname } from 'next/navigation'; // Added usePathname
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MiniCart } from '@/components/cart/MiniCart';
import { ScrollArea } from '../ui/scroll-area';

// Mock data, ideally fetched or from a config
const shopCategories = [
  { href: "/shop/categories/shoes", label: "Shoes" },
  { href: "/shop/categories/clothing", label: "Clothing" },
  { href: "/shop/categories/accessories", label: "Accessories" },
  // Add more categories as needed
];

const shopBrands = [
  { href: "/shop/products?brand=Gucci", label: "Gucci" }, // Example: Link to products filtered by brand
  { href: "/shop/products?brand=Calvin%20Klein", label: "Calvin Klein" },
  { href: "/shop/products?brand=Polo", label: "Polo" },
  { href: "/shop/products?brand=Tommy%20Hilfiger", label: "Tommy Hilfiger" },
  { href: "/shop/products?brand=Ralph%20Lauren", label: "Ralph Lauren" },
  { href: "/shop/products?brand=Apple", label: "Apple" }, // Example
  { href: "/shop/products?brand=Nike", label: "Nike" },
  { href: "/shop/products?brand=Converse", label: "Converse" },
  { href: "/shop/products?brand=Puma", label: "Puma" },
];


function HeaderInfoBar() {
  return (
    <div className="bg-muted/50 text-muted-foreground text-xs py-2 border-b border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-center md:justify-between text-center">
          <div className="hidden md:flex items-center justify-center gap-2 md:w-1/3">
            <Truck className="h-4 w-4 text-primary" />
            <span>Free Shipping</span>
          </div>
          <div className="hidden md:flex items-center justify-center gap-2 md:w-1/3">
            <CreditCard className="h-4 w-4 text-primary" />
            <span>Payment Methods</span>
          </div>
          <div className="hidden md:flex items-center justify-center gap-2 md:w-1/3">
            <Phone className="h-4 w-4 text-primary" />
            <span>Call us 951-999-9999</span>
          </div>
          <div className="md:hidden flex items-center justify-center gap-2 py-1">
            <Phone className="h-4 w-4 text-primary" />
            <span> Need advice? Call us 951-999-9999</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { favoritesCount } = useFavorites();
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const { setTheme } = useTheme();
  const { toast } = useToast(); 

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const generalNavItems = [
    { href: "/", label: "Home" },
    { href: "/shop/products", label: "Shop All" },
    { href: "/shop/categories", label: "Categories"},
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/help", label: "Help/FAQs" },
  ];

  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md">
      <HeaderInfoBar />
      <div className="container flex h-20 items-center">
        {/* Left Section: Mobile Menu & Logo */}
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 pt-0 bg-sidebar text-sidebar-foreground flex flex-col">
              <div className="p-4 border-b border-sidebar-border">
                <SheetClose asChild>
                  {/* Use Logo directly as it's already a Link */}
                  <Logo size="md" />
                </SheetClose>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-sidebar-foreground/70 uppercase mb-3">Menu</h3>
                  <nav>
                    <ul className="space-y-1">
                      {generalNavItems.map(item => (
                        <li key={item.href}>
                          <SheetClose asChild>
                            <Link href={item.href} className="block px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                              {item.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
                <div className="p-4 mt-2 border-t border-sidebar-border">
                  <h3 className="text-sm font-semibold text-sidebar-foreground/70 uppercase mb-3">Shop By Category</h3>
                  <nav>
                    <ul className="space-y-1">
                      {shopCategories.map(category => (
                        <li key={category.href}>
                          <SheetClose asChild>
                            <Link href={category.href} className="block px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                              {category.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                        <li>
                            <SheetClose asChild>
                                <Link href="/shop/categories" className="block px-3 py-2 text-sm font-semibold text-primary hover:underline">
                                See all categories
                                </Link>
                            </SheetClose>
                        </li>
                    </ul>
                  </nav>
                </div>
                 <div className="p-4 mt-2 border-t border-sidebar-border">
                  <h3 className="text-sm font-semibold text-sidebar-foreground/70 uppercase mb-3">Shop By Brand</h3>
                  <nav>
                    <ul className="space-y-1">
                      {shopBrands.map(brand => (
                        <li key={brand.href}>
                          <SheetClose asChild>
                            <Link href={brand.href} className="block px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                              {brand.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                        <li>
                            <SheetClose asChild>
                                <Link href="/shop/products" className="block px-3 py-2 text-sm font-semibold text-primary hover:underline">
                                Explore All Products
                                </Link>
                            </SheetClose>
                        </li>
                    </ul>
                  </nav>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="hidden lg:block">
            {/* Use Logo directly as it's already a Link. Aria-label on Logo component itself handles accessibility. */}
            <Logo size="md" />
          </div>
        </div>

        {/* Middle Section: Search (Desktop) - Conditional */}
        {!isHomePage && (
          <div className="flex-1 flex justify-center items-center md:ml-6 lg:ml-0">
            <div className="w-full max-w-xl hidden lg:flex items-center gap-4">
              <form onSubmit={handleSearch} className="relative flex-grow">
                <Input
                  type="search"
                  name="search"
                  placeholder="Search Products"
                  className="h-10 pr-10 w-full text-sm border-border focus:border-primary"
                  aria-label="Search products"
                />
                <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary" aria-label="Submit search">
                  <Search size={18} />
                </Button>
              </form>
            </div>
          </div>
        )}
        
        {/* Right Section: Desktop Nav Actions, Mobile Search Trigger, Icons */}
        <div className={`flex items-center gap-1 ml-auto ${isHomePage && !user ? 'lg:flex-1 lg:justify-end' : ''}`}>
          <nav className="hidden lg:flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Brands <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-80">
                <DropdownMenuLabel>Shop By Brand</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="max-h-60"> {/* Adjusted max-h for label */}
                    {shopBrands.map(brand => (
                    <DropdownMenuItem key={brand.href} asChild>
                        <Link href={brand.href}>{brand.label}</Link>
                    </DropdownMenuItem>
                    ))}
                </ScrollArea>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/shop/products" className="font-semibold text-primary">Explore All Products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" asChild className="text-sm font-medium">
              <Link href="/shop/products">Shop</Link>
            </Button>
             <Button variant="ghost" asChild className="text-sm font-medium">
              <Link href="/shop/categories">Categories</Link>
            </Button>
            {isHomePage && (
              <>
                <Button variant="ghost" asChild className="text-sm font-medium">
                  <Link href="/about"><Building className="mr-1 h-4 w-4 text-primary/80" />About Us</Link>
                </Button>
                <Button variant="ghost" asChild className="text-sm font-medium">
                  <Link href="/contact"><Phone className="mr-1 h-4 w-4 text-primary/80" />Contact Us</Link>
                </Button>
              </>
            )}
          </nav>

           {/* Search Icon for SM/MD screens to trigger modal/drawer search - Conditional */}
           {!isHomePage && (
            <div className="lg:hidden">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Search products">
                          <Search className="h-5 w-5" />
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="top" className="p-4">
                      <form onSubmit={handleSearch} className="flex gap-2">
                          <Input
                              type="search"
                              name="search"
                              placeholder="Search products..."
                              className="h-10 flex-grow"
                              autoFocus
                              aria-label="Search products"
                          />
                          <SheetClose asChild>
                              <Button type="submit" size="lg">Search</Button>
                          </SheetClose>
                      </form>
                  </SheetContent>
              </Sheet>
            </div>
           )}


          <TooltipProvider delayDuration={100}>
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
                      <Sun className="mr-2 h-4 w-4" /> Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      <Moon className="mr-2 h-4 w-4" /> Dark
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setTheme('system')}>
                      <Settings className="mr-2 h-4 w-4" /> System Default
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent><p>Change Theme</p></TooltipContent>
            </Tooltip>
            
            <MiniCart /> 

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
                      <DropdownMenuItem asChild><Link href="/account/profile"><UserCircle className="mr-2 h-4 w-4" /> Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/account/orders"><ShoppingCart className="mr-2 h-4 w-4" /> My Orders</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/account/wishlist"><Heart className="mr-2 h-4 w-4" /> Wishlist ({favoritesCount})</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/account/notifications"><Bell className="mr-2 h-4 w-4" /> Notifications</Link></DropdownMenuItem>
                      {/* Link to settings page from PRD - could be /account/settings or /cilent/settings/notifications */}
                      <DropdownMenuItem asChild><Link href="/account/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link></DropdownMenuItem>
                      { (user.role === 'admin' || user.role === 'superuser') && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild><Link href="/admin/dashboard"><Settings className="mr-2 h-4 w-4" /> Admin Panel</Link></DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} disabled={authLoading}>
                        <LogOut className="mr-2 h-4 w-4" /> Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent><p>My Account</p></TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button asChild variant="ghost" size="sm" className="text-sm font-medium">
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Login or Register</p></TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>
       {/* Search Bar for SM screens (below main header items if needed) - Conditional */}
       {!isHomePage && (
        <div className="container pb-2 lg:hidden">
          <form onSubmit={handleSearch} className="relative flex-grow">
              <Input
                type="search"
                name="search"
                placeholder="Search Products"
                className="h-10 pr-10 w-full text-sm border-border focus:border-primary"
                aria-label="Search products"
              />
              <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary" aria-label="Submit search">
                <Search size={18} />
              </Button>
            </form>
        </div>
       )}
    </header>
  );
}
