
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { mockProducts } from "@/data/products"; // Using mock for now
import type { Product } from "@/types";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFromApi } from "@/lib/api"; // For future API integration

// This function could be moved to a service or lib if complex
async function fetchProductsByCategory(categorySlug: string): Promise<Product[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would be:
  // return getFromApi<Product[]>(`/products?category=${encodeURIComponent(categorySlug)}`);

  // Mock implementation:
  const decodedSlug = decodeURIComponent(categorySlug).toLowerCase();
  return mockProducts.filter(
    (product) => product.category.toLowerCase() === decodedSlug
  );
}

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (currentSlug: string) => {
    if (!currentSlug) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await fetchProductsByCategory(currentSlug);
      setProducts(fetchedProducts);
      // Derive category name from products or slug - for display
      if (fetchedProducts.length > 0) {
        setCategoryName(fetchedProducts[0].category);
      } else {
        // Capitalize slug for display if no products found or for initial guess
        setCategoryName(decodeURIComponent(currentSlug).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load products for this category.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slug) {
      loadProducts(slug);
    }
  }, [slug, loadProducts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading products for {decodeURIComponent(slug)}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-destructive">
        <p>Error: {error}</p>
        <Button onClick={() => router.back()} variant="outline" className="mt-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }
  
  const displayCategoryName = categoryName || decodeURIComponent(slug).replace(/-/g, ' ');


  return (
    <div className="container py-8">
      <Button variant="outline" onClick={() => router.push('/shop/categories')} className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Categories
      </Button>
      <ProductGrid products={products} title={`Products in ${displayCategoryName}`} />
      {products.length === 0 && !isLoading && (
         <p className="text-center text-muted-foreground py-10 text-lg">
            No products found in the &quot;{displayCategoryName}&quot; category.
        </p>
      )}
    </div>
  );
}
