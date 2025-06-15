
"use client";
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, MessageSquare, ChevronLeft, Share2, Loader2, AlertTriangle } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Input } from '@/components/ui/input';
import type { Product } from '@/types';
import { getFromApi } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProductDetailsPage() { 
  const router = useRouter();
  const params = useParams(); // Use useParams to get route parameters
  const slug = params.slug as string; // slug should be available from the route

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const fetchProductData = useCallback(async (currentSlug: string) => {
    if (!currentSlug) {
      setError("Product slug is missing.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setProduct(null);
    setRelatedProducts([]);

    try {
      const fetchedProduct = await getFromApi<Product>(`/products/${currentSlug}`);
      setProduct(fetchedProduct);
      setSelectedColor(fetchedProduct.colors?.[0]);
      setSelectedSize(fetchedProduct.sizes?.[0]);

      if (fetchedProduct && fetchedProduct.category) {
        try {
          const fetchedRelated = await getFromApi<Product[]>(`/products?category=${encodeURIComponent(fetchedProduct.category)}&limit=5`);
          setRelatedProducts(fetchedRelated.filter(p => p.id !== fetchedProduct.id).slice(0, 4));
        } catch (relatedError) {
          console.warn("Could not fetch related products:", relatedError);
          // Not a critical error, so don't set main error state
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch product:", err);
      setError(err.message || "Could not load product details.");
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      fetchProductData(slug);
    }
  }, [slug, fetchProductData]);

  const isFav = product ? isFavorite(product.id) : false;

  const handleFavoriteToggle = () => {
    if (!product) return;
    if (isFav) removeFavorite(product.id);
    else addFavorite(product);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Obi-Wan-Shop!`,
        url: window.location.href,
      }).catch(error => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied!", description: "Product link copied to clipboard." });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Product</AlertTitle>
          <AlertDescription>
            {error} Please try again or check if the API is running.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8 text-center">
         <Button variant="outline" onClick={() => router.back()} className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <p className="text-xl text-muted-foreground mt-10">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to products
      </Button>

      <section className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
          <Image 
            src={product.imageUrl || "https://placehold.co/600x600.png"} // Fallback image
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
            data-ai-hint={product.dataAiHint || 'product detail'}
          />
           {product.stock !== undefined && product.stock !== null && product.stock <= 10 && product.stock > 0 && (
             <Badge variant="destructive" className="absolute top-4 left-4 text-sm px-3 py-1">Low Stock</Badge>
          )}
          {product.stock === 0 && (
             <Badge variant="outline" className="absolute top-4 left-4 text-sm px-3 py-1 bg-muted text-muted-foreground">Out of Stock</Badge>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-headline font-bold text-primary">{product.name}</h1>
          
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-accent">${product.price.toFixed(2)}</p>
            {product.rating && (
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                ))}
                <span className="text-sm text-muted-foreground">({product.reviewsCount || 0} reviews)</span>
              </div>
            )}
          </div>

          <p className="text-lg text-foreground/80 leading-relaxed">{product.description || "No description available."}</p>
          
          <Separator />

          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-2">Color: <span className="font-normal text-muted-foreground">{selectedColor}</span></h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(color => (
                  <Button 
                    key={color} 
                    variant={selectedColor === color ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className={`capitalize ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
             <div>
              <h3 className="text-md font-medium mb-2">Size: <span className="font-normal text-muted-foreground">{selectedSize}</span></h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <Button 
                    key={size} 
                    variant={selectedSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={`uppercase ${selectedSize === size ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {(product.stock === undefined || product.stock === null || product.stock > 0) && (
            <div>
                <h3 className="text-md font-medium mb-2">Quantity</h3>
                <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <=1}>-</Button>
                <Input type="number" value={quantity} readOnly className="w-16 text-center h-10" />
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.min(product.stock || 10, q + 1))} disabled={quantity >= (product.stock || 10)}>+</Button>
                </div>
                {product.stock !== undefined && product.stock !== null && <p className="text-xs text-muted-foreground mt-1">{product.stock} items in stock</p>}
            </div>
          )}

          <Separator />
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              size="lg" 
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline" onClick={handleFavoriteToggle} className="text-primary border-primary hover:bg-primary/10">
              <Heart className={`mr-2 h-5 w-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} /> 
              {isFav ? 'Favorited' : 'Favorite'}
            </Button>
             <Button size="lg" variant="outline" onClick={handleShare} className="text-muted-foreground">
              <Share2 className="mr-2 h-5 w-5" /> Share
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 border-t">
        <h2 className="text-2xl font-headline font-semibold mb-6 text-primary">Customer Reviews</h2>
        <div className="bg-card p-6 rounded-lg shadow">
          <p className="text-muted-foreground">No reviews yet. Be the first to review {product.name}!</p>
          {/* TODO: Link to a review submission form/modal */}
          <Button variant="outline" className="mt-4">
            <MessageSquare className="mr-2 h-4 w-4" /> Write a Review
          </Button>
        </div>
      </section>

      {relatedProducts.length > 0 && (
         <ProductGrid products={relatedProducts} title="You Might Also Like" />
      )}
    </div>
  );
}

    