
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "@/components/layout/hero-carousel";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { mockProducts } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Input } from "@/components/ui/input"; // Added for newsletter
import { MediaScroller } from "@/components/ui/media-scroller"; // Added for product scrolling
import { MediaScrollerItem } from "@/components/ui/media-scroller-item"; // Added for product scrolling
import { Lightbulb, Zap, Gift, Tag, Percent } from "lucide-react"; // Added icons for newsletter

export default function MarketingHomePage() {
  const newArrivalDisplayProducts = mockProducts.slice(0, 3);
  const bestSellerDisplayProducts = mockProducts.slice(3, 7); // Different products for best sellers
  const eventSaleDisplayProducts = mockProducts.slice(1, 5); // Different products for event sales

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroCarousel />

        <section className="py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
              Discover Your Unique Style
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
              Obi-Wan-Shop combines the latest trends with AI-powered personalization to help you find fashion that truly represents you.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/shop/products">Explore Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-12 md:py-20 lg:py-28 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary mb-4">
                New Arrivals
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Fresh styles just landed! Be the first to explore the latest trends and update your wardrobe with our newest collection.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-5xl mx-auto mb-12">
              {newArrivalDisplayProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Link href="/shop/products?sort=newest">Shop All New Arrivals</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="py-12 md:py-20 lg:py-28 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary mb-4">
                Best Sellers
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Discover our most-loved items, curated by popular demand and top reviews from shoppers like you. These are the must-haves!
                </p>
            </div>
            <MediaScroller>
              {bestSellerDisplayProducts.map(product => (
                <MediaScrollerItem
                  key={product.id}
                  href={`/shop/products/${product.id}`}
                  imageUrl={product.imageUrl}
                  altText={product.name}
                  title={product.name}
                  subtitle={`$${product.price.toFixed(2)}`}
                  dataAiHint={product.dataAiHint || 'bestseller product'}
                  aspectRatio="aspect-[3/4]"
                  className="w-60 sm:w-64 md:w-72"
                />
              ))}
            </MediaScroller>
            <div className="text-center mt-12">
                <Button size="lg" asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Link href="/shop/products?filter=bestsellers">Shop Best Sellers</Link>
                </Button>
            </div>
          </div>
        </section>

        {/* Event Sales Section */}
        <section className="py-12 md:py-20 lg:py-28 bg-muted">
          <div className="container px-4 md:px-6">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-accent mb-4">
                Event Sales
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Don't miss out on exclusive deals and limited-time offers during our special shopping events! Grab your favorites at amazing prices.
                </p>
            </div>
            <MediaScroller>
              {eventSaleDisplayProducts.map(product => (
                <MediaScrollerItem
                  key={product.id}
                  href={`/shop/products/${product.id}`}
                  imageUrl={product.imageUrl}
                  altText={product.name}
                  title={product.name}
                  subtitle={`$${product.price.toFixed(2)}`}
                  dataAiHint={product.dataAiHint || 'sale product'}
                  aspectRatio="aspect-[3/4]"
                   className="w-60 sm:w-64 md:w-72"
                />
              ))}
            </MediaScroller>
            <div className="text-center mt-12">
                <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/shop/products?filter=sale">View Current Sales</Link>
                </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section className="py-12 md:py-20 lg:py-28 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center bg-card p-8 md:p-12 rounded-xl shadow-xl border border-border">
              <Percent className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold tracking-tight text-primary mb-3">
                Subscribe & Get 20% Off!
              </h2>
              <p className="text-muted-foreground mt-2 mb-6 max-w-md mx-auto">
                Join our newsletter to get exclusive deals, new arrival alerts, and a 20% discount on your first purchase!
              </p>
              <form className="w-full max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-3">
                <Input
                  required
                  className="h-12 text-base sm:flex-1 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email address"
                  type="email"
                  aria-label="Email address"
                />
                <Button className="h-12 w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-8 py-3" type="submit">
                  SUBSCRIBE
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
