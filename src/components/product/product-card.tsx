// src/components/product/product-card.tsx
"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingCart, Star, MessageSquare } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(product.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking favorite button
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

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <div className="aspect-[4/3] overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={450}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={product.dataAiHint || 'product image'}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/70 hover:bg-background text-primary rounded-full h-9 w-9"
            onClick={handleFavoriteToggle}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-5 w-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>
          {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
             <Badge variant="destructive" className="absolute top-2 left-2">Low Stock</Badge>
          )}
          {product.stock === 0 && (
             <Badge variant="outline" className="absolute top-2 left-2 bg-muted text-muted-foreground">Out of Stock</Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline leading-tight mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</p>
            {product.rating && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>{product.rating.toFixed(1)}</span>
                {product.reviewsCount && <span className="text-xs">({product.reviewsCount})</span>}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
