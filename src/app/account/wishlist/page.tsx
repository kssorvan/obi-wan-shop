
"use client";
import { useFavorites } from '@/contexts/favorites-context';
import { ProductGrid } from '@/components/shop/ProductGrid'; // Updated import
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HeartCrack } from 'lucide-react';

export default function FavoritesPage() {
  const { favoriteItems, favoritesCount } = useFavorites();

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-xl shadow-lg">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Your Favorite Styles</h1>
        <p className="text-lg text-muted-foreground">
          {favoritesCount > 0 
            ? `You have ${favoritesCount} item${favoritesCount === 1 ? '' : 's'} in your favorites.`
            : "You haven't added any favorites yet."}
        </p>
      </section>
      
      {favoritesCount > 0 ? (
        <ProductGrid products={favoriteItems} /> 
      ) : (
        <div className="text-center py-16">
          <HeartCrack className="mx-auto h-24 w-24 text-muted-foreground/50 mb-6" />
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">No Favorites Found</h2>
          <p className="text-foreground/70 mb-6">
            Start exploring and add products you love to your favorites list!
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/shop/products">Browse Products</Link> {/* Updated path */}
          </Button>
        </div>
      )}
    </div>
  );
}
