"use client";
import { mockProducts } from '@/data/products';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star, MessageSquare, ChevronLeft, Share2 } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ProductList } from '@/components/product/product-list';

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const product = mockProducts.find(p => p.id === params.id);
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="text-center py-10 text-xl text-muted-foreground">Product not found.</div>;
  }

  const isFav = isFavorite(product.id);

  const handleFavoriteToggle = () => {
    if (isFav) removeFavorite(product.id);
    else addFavorite(product);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on StyleSense AI!`,
        url: window.location.href,
      }).catch(error => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied!", description: "Product link copied to clipboard." });
    }
  };

  const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="space-y-12">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to products
      </Button>

      <section className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image Gallery */}
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
          <Image 
            src={product.imageUrl} 
            alt={product.name} 
            layout="fill" 
            objectFit="cover" 
            priority
            data-ai-hint={product.dataAiHint || 'product detail'}
          />
           {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
             <Badge variant="destructive" className="absolute top-4 left-4 text-sm px-3 py-1">Low Stock</Badge>
          )}
          {product.stock === 0 && (
             <Badge variant="outline" className="absolute top-4 left-4 text-sm px-3 py-1 bg-muted text-muted-foreground">Out of Stock</Badge>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-headline font-bold text-primary">{product.name}</h1>
          
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-accent">${product.price.toFixed(2)}</p>
            {product.rating && (
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} />
                ))}
                <span className="text-sm text-muted-foreground">({product.reviewsCount} reviews)</span>
              </div>
            )}
          </div>

          <p className="text-lg text-foreground/80 leading-relaxed">{product.description}</p>
          
          <Separator />

          {/* Color Selection */}
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

          {/* Size Selection */}
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
          
          {/* Quantity Selection */}
          {product.stock !== 0 && (
            <div>
                <h3 className="text-md font-medium mb-2">Quantity</h3>
                <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <=1}>-</Button>
                <Input type="number" value={quantity} readOnly className="w-16 text-center h-10" />
                <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.min(product.stock || 10, q + 1))} disabled={quantity >= (product.stock || 10)}>+</Button>
                </div>
                {product.stock && <p className="text-xs text-muted-foreground mt-1">{product.stock} items in stock</p>}
            </div>
          )}


          <Separator />
          
          {/* Action Buttons */}
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

      {/* Reviews Section Placeholder */}
      <section className="py-8 border-t">
        <h2 className="text-2xl font-headline font-semibold mb-6 text-primary">Customer Reviews</h2>
        <div className="bg-card p-6 rounded-lg shadow">
          <p className="text-muted-foreground">No reviews yet. Be the first to review {product.name}!</p>
          <Button variant="outline" className="mt-4">
            <MessageSquare className="mr-2 h-4 w-4" /> Write a Review
          </Button>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
         <ProductList products={relatedProducts} title="You Might Also Like" />
      )}
    </div>
  );
}
