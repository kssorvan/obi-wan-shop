
import { ProductList } from '@/components/product/product-list';
import { StyleRecommendations } from '@/components/style-recommendations';
import { mockProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MediaScroller } from '@/components/ui/media-scroller';
import { MediaScrollerItem } from '@/components/ui/media-scroller-item';
import { HeroCarousel } from '@/components/layout/hero-carousel';

export default function HomePage() {
  const featuredProducts = mockProducts.slice(0, 4);
  const newArrivals = mockProducts.slice(4, 8);
  const trendingLooks = mockProducts.slice(0, 6); // For media scroller

  return (
    <div className="space-y-12">
      {/* Hero Carousel Section */}
      <HeroCarousel />
      
      {/* AI Style Recommendations */}
      <StyleRecommendations />

      {/* Featured Products Section */}
      <ProductList products={featuredProducts} title="Featured Products" />

      {/* Trending Looks Media Scroller */}
      <section>
        <h2 className="text-3xl font-headline font-semibold mb-6 text-center text-primary">Trending Looks</h2>
        <MediaScroller>
          {trendingLooks.map(product => (
            <MediaScrollerItem
              key={product.id}
              href={`/products/${product.id}`}
              imageUrl={product.imageUrl}
              altText={product.name}
              title={product.name}
              subtitle={`$${product.price.toFixed(2)}`}
              dataAiHint={product.dataAiHint || 'trending look'}
              aspectRatio="aspect-square" // Or aspect-[4/5] for a taller look
            />
          ))}
        </MediaScroller>
      </section>
      
      {/* New Arrivals Section */}
      <ProductList products={newArrivals} title="New Arrivals" gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"/>

      {/* Call to action to view all products */}
      <section className="text-center py-8">
        <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10">
          <Link href="/products">
            Explore All Collections
          </Link>
        </Button>
      </section>
    </div>
  );
}
