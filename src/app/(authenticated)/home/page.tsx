
"use client"; // Add "use client" as we are using hooks like useState and useEffect

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { StyleRecommendations } from '@/components/style-recommendations';
import { Button } from '@/components/ui/button';
import { MediaScroller } from '@/components/ui/media-scroller';
import { MediaScrollerItem } from '@/components/ui/media-scroller-item';
import { HeroCarousel } from '@/components/layout/hero-carousel';
import { getFromApi } from '@/lib/api';
import type { Product } from '@/types';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [trendingLooks, setTrendingLooks] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomePageData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulating API calls - replace with actual API endpoints and error handling
        // The Laravel API would need to support these query parameters (featured, sort, limit, tags)
        const [featuredRes, newArrivalsRes, trendingRes] = await Promise.all([
          getFromApi<Product[]>('/products?featured=true&limit=4'),
          getFromApi<Product[]>('/products?sort=newest&limit=4'),
          getFromApi<Product[]>('/products?tags=trending&limit=6') // Assuming a 'trending' tag or similar filter
        ]);
        
        setFeaturedProducts(featuredRes || []);
        setNewArrivals(newArrivalsRes || []);
        setTrendingLooks(trendingRes || []);

      } catch (err: any) {
        console.error("Failed to fetch homepage products:", err);
        setError(err.message || "Could not load products. Please try again later.");
        // Set empty arrays on error to avoid issues with map/slice
        setFeaturedProducts([]);
        setNewArrivals([]);
        setTrendingLooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Loading awesome styles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Fetching Products</AlertTitle>
        <AlertDescription>
          {error} Please ensure the API is running and accessible.
          You might see mock data or empty sections as a fallback.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-12">
      <HeroCarousel />
      
      <StyleRecommendations />

      {featuredProducts.length > 0 && (
        <ProductGrid products={featuredProducts} title="Featured Products" />
      )}

      {trendingLooks.length > 0 && (
        <section>
          <h2 className="text-3xl font-headline font-semibold mb-6 text-center text-primary">Trending Looks</h2>
          <MediaScroller>
            {trendingLooks.map(product => (
              <MediaScrollerItem
                key={product.id}
                href={`/shop/products/${product.id}`}
                imageUrl={product.imageUrl}
                altText={product.name}
                title={product.name}
                subtitle={`$${product.price.toFixed(2)}`}
                dataAiHint={product.dataAiHint || 'trending look'}
                aspectRatio="aspect-square"
              />
            ))}
          </MediaScroller>
        </section>
      )}
      
      {newArrivals.length > 0 && (
        <ProductGrid products={newArrivals} title="New Arrivals" gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"/>
      )}
      
      {(featuredProducts.length === 0 && newArrivals.length === 0 && trendingLooks.length === 0 && !isLoading && !error) && (
         <div className="text-center py-10">
            <p className="text-muted-foreground text-lg">No products to display at the moment. Check back soon!</p>
        </div>
      )}

      <section className="text-center py-8">
        <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
          <Link href="/shop/products">
            Explore All Collections
          </Link>
        </Button>
      </section>
    </div>
  );
}
