// src/components/product/product-card.tsx
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isFav = isClient ? isFavorite(product.id) : false;
  const stock = product.stock ?? 0;
  const dataAiHint = product.dataAiHint ?? 'product image';

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Fallback image for development/testing
  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return '/fallback-image.jpg';
    
    // Replace placehold.co with a configured domain or local fallback
    if (url.includes('placehold.co')) {
      return '/fallback-image.jpg';
    }
    
    return url;
  };

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
            <Image
              src={getImageUrl(product.imageUrl)}
              alt={product.name}
              width={600}
              height={450}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={dataAiHint}
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = '/fallback-image.jpg';
              }}
            />
          </div>
          
          {/* Only render favorite button on client side to avoid hydration mismatch */}
          {isClient && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/70 hover:bg-background text-primary rounded-full h-9 w-9"
              onClick={handleFavoriteToggle}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-5 w-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            </Button>
          )}
          
          {/* Stock badges */}
          {stock <= 10 && stock > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Low Stock
            </Badge>
          )}
          {stock === 0 && (
            <Badge variant="outline" className="absolute top-2 left-2 bg-muted text-muted-foreground">
              Out of Stock
            </Badge>
          )}
        </CardHeader>
        
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline leading-tight mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </p>
            {product.rating != null && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>{product.rating.toFixed(1)}</span>
                {product.reviewsCount != null && (
                  <span className="text-xs">({product.reviewsCount})</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}