
import type { Product } from '@/types';
import { ProductCard } from '@/components/shop/ProductCard'; // Updated import path

interface ProductGridProps { // Renamed from ProductListProps
  products: Product[];
  title?: string;
  gridCols?: string; 
}

export function ProductGrid({ products, title, gridCols = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }: ProductGridProps) { // Renamed component
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">{title ? `No ${title.toLowerCase()} found.` : "No products found."}</p>
      </div>
    );
  }

  return (
    <section className="py-8">
      {title && <h2 className="text-3xl font-headline font-semibold mb-8 text-center text-primary">{title}</h2>}
      <div className={`grid ${gridCols} gap-6`}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
