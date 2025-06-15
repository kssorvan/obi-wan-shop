
"use client";

import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProducts } from "@/data/products"; // Using mock data for now
import type { Product } from "@/types";
import { Search as SearchIcon, Loader2 } from "lucide-react"; // Renamed to avoid conflict
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState(queryParam);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = useCallback(async (currentQuery: string) => {
    if (!currentQuery.trim()) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    // Simulate API call for search
    await new Promise(resolve => setTimeout(resolve, 700));
    const fuseOptions = {
      keys: ["name", "description", "category", "tags"],
      threshold: 0.3, // Adjust for fuzziness
    };
    // In a real app, you'd use a proper search library or API.
    // For mock: simple filter.
    const filtered = mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(currentQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(currentQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(currentQuery.toLowerCase()) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(currentQuery.toLowerCase())))
    );
    setResults(filtered);
    setDisplayedSearchTerm(currentQuery);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchResults(queryParam);
  }, [queryParam, fetchResults]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim() !== queryParam) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-headline font-semibold mb-4 text-primary">
          Search Products
        </h1>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center">
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for awesome products..."
            className="flex-grow h-11 text-base"
          />
          <Button type="submit" size="lg" disabled={isLoading}>
            <SearchIcon className="mr-2 h-5 w-5" /> Search
          </Button>
        </form>
      </section>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Searching...</p>
        </div>
      )}

      {!isLoading && queryParam && (
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Results for: <span className="text-primary">&quot;{displayedSearchTerm}&quot;</span> ({results.length})
          </h2>
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <p className="text-center text-muted-foreground py-10 text-lg">
              No products found matching your search criteria.
            </p>
          )}
        </section>
      )}
       {!isLoading && !queryParam && (
        <p className="text-center text-muted-foreground py-10 text-lg">
          Enter a search term above to find products.
        </p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
