import type { Product } from '@/types';
import { ProductCard } from './product-card';
import { Skeleton } from '@/components/ui/skeleton'; // If you have shadcn/ui skeleton

interface ProductListProps {
  products: Product[];
  title?: string;
  gridCols?: string; // e.g. "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  loading?: boolean;
  showCount?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function ProductList({ 
  products, 
  title, 
  gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  loading = false,
  showCount = false,
  emptyMessage,
  className = ""
}: ProductListProps) {
  
  // Loading state
  if (loading) {
    return (
      <section className={`py-8 ${className}`}>
        {title && <h2 className="text-3xl font-headline font-semibold mb-8 text-center text-primary">{title}</h2>}
        <div className={`grid ${gridCols} gap-6`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    const defaultMessage = title ? `No ${title.toLowerCase()} found.` : "No products found.";
    
    return (
      <div className="text-center py-16">
        <div className="mx-auto max-w-sm">
          <div className="mb-4">
            <svg 
              className="mx-auto h-12 w-12 text-muted-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 12l3-3 3 3m-6 0l3 3 3-3" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Products Found</h3>
          <p className="text-muted-foreground">
            {emptyMessage || defaultMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="flex items-center justify-between mb-8">
        {title && (
          <h2 className="text-3xl font-headline font-semibold text-primary">
            {title}
            {showCount && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({products.length} {products.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
        )}
        {!title && showCount && (
          <p className="text-sm text-muted-foreground">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>
      
      <div className={`grid ${gridCols} gap-6`}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// Skeleton component for loading state
function ProductCardSkeleton() {
  return (
    <div className="group relative bg-card rounded-lg border border-border p-4 shadow-sm">
      {/* Image skeleton */}
      <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-4">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}

// Alternative skeleton if you don't have shadcn/ui
function ProductCardSkeletonSimple() {
  return (
    <div className="group relative bg-card rounded-lg border border-border p-4 shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-200 mb-4"></div>
      
      {/* Content skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

// Usage examples:
/*
// Basic usage
<ProductList products={products} title="Featured Products" />

// With loading state
<ProductList products={products} loading={isLoading} title="All Products" />

// With custom grid and count
<ProductList 
  products={products} 
  title="Search Results" 
  gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
  showCount={true}
/>

// With custom empty message
<ProductList 
  products={[]} 
  title="Wishlist" 
  emptyMessage="Your wishlist is empty. Start adding products you love!"
/>
*/