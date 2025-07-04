
"use client";
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Product, Category } from '@/types'; 
import { getFromApi } from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const sortOptions = [
  { value: 'default', label: 'Default Sorting' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

interface PaginatedProductsResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialSearchQuery = searchParams.get('search') || '';
  const initialCategorySlug = searchParams.get('category') || 'all';
  const initialPriceRange = searchParams.get('price')?.split('-').map(Number) || [0, 20000]; 
  const initialSortOption = searchParams.get('sort') || 'default';

  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(initialCategorySlug);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange as [number, number]);
  const [sortOption, setSortOption] = useState(initialSortOption);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [categoriesForFilter, setCategoriesForFilter] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);


  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        const fetchedCategories = await getFromApi<Category[]>('/categories');
        setCategoriesForFilter(fetchedCategories || []);
      } catch (error) {
        console.error("Failed to fetch categories for filter:", error);
        // Keep empty or show specific error for categories
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const fetchProductsFromApi = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
      if (selectedCategorySlug !== 'all') params.set('category_slug', selectedCategorySlug); // Assuming API uses slug
      if (priceRange[0] > 0) params.set('min_price', String(priceRange[0]));
      if (priceRange[1] < 20000) params.set('max_price', String(priceRange[1]));
      if (sortOption !== 'default') params.set('sort', sortOption);
      
      const endpoint = `/products?${params.toString()}`;
      const productsArray = await getFromApi<Product[]>(endpoint); // Direct array or PaginatedProductsResponse.data
      setFilteredProducts(productsArray || []);

    } catch (error: any) {
      console.error("Failed to fetch products from Laravel API:", error);
      setFetchError(error.message || "Could not load products from backend.");
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, selectedCategorySlug, priceRange, sortOption]); 


  useEffect(() => {
    fetchProductsFromApi();
  }, [fetchProductsFromApi]);

  useEffect(() => {
    const params = new URLSearchParams(); 
    if (searchTerm) params.set('search', searchTerm); else params.delete('search');
    if (selectedCategorySlug !== 'all') params.set('category', selectedCategorySlug); else params.delete('category');
    if (priceRange[0] !== 0 || priceRange[1] !== 20000) params.set('price', `${priceRange[0]}-${priceRange[1]}`); else params.delete('price');
    if (sortOption !== 'default') params.set('sort', sortOption); else params.delete('sort');
    
    const currentBrowserParams = new URLSearchParams(window.location.search);
    if (params.toString() !== currentBrowserParams.toString()) {
      router.replace(`/shop/products?${params.toString()}`, { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategorySlug, priceRange, sortOption]); 

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategorySlug('all'); 
    setPriceRange([0, 20000]); 
    setSortOption('default');
  };

  if (isLoading && filteredProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <Alert variant="destructive" className="my-8 max-w-2xl mx-auto">
        <AlertTitle>Failed to Load Products</AlertTitle>
        <AlertDescription>
          {fetchError} Please ensure the API is running and accessible at {process.env.NEXT_PUBLIC_LARAVEL_API_URL}.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-headline font-semibold mb-6 text-primary flex items-center">
          <Filter className="mr-3 h-6 w-6"/> Explore Our Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative md:col-span-1">
            <label htmlFor="search-input" className="block text-sm font-medium text-muted-foreground mb-1">Search</label>
            <Input
              id="search-input"
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pr-10"
            />
            {searchTerm ? (
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 mt-2 h-7 w-7" onClick={handleClearSearch}>
                <X size={18} />
              </Button>
            ) : (
              <Search size={18} className="absolute right-3 top-1/2 mt-2 h-7 w-7 text-muted-foreground pointer-events-none" />
            )}
          </div>
          
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
             <Select value={selectedCategorySlug} onValueChange={setSelectedCategorySlug} disabled={isCategoriesLoading}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder={isCategoriesLoading ? "Loading..." : "All Categories"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesForFilter.map(category => (
                  <SelectItem key={category.slug} value={category.slug}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Price Range: ${priceRange[0]} - ${priceRange[1] === 20000 ? '20000+' : priceRange[1]}
            </label>
            <Slider
              defaultValue={[0, 20000]}
              min={0}
              max={20000} 
              step={100}  
              value={priceRange}
              onValueChange={handlePriceChange}
              className="py-2"
            />
          </div>

          <div>
            <label htmlFor="sort-select" className="block text-sm font-medium text-muted-foreground mb-1">Sort By</label>
             <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger id="sort-select">
                <SelectValue placeholder="Default Sorting" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {(!isLoading && !fetchError && filteredProducts.length === 0) ? (
         <div className="text-center py-16 bg-card p-8 rounded-lg shadow">
            <Filter className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-semibold text-muted-foreground mb-3">No Products Found</h2>
            <p className="text-foreground/70 mb-6 max-w-md mx-auto">
            We couldn&apos;t find any products matching your current filters. Try adjusting your search or filter criteria.
            </p>
            <Button
            onClick={handleClearAllFilters}
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary/10"
            >
            Clear All Filters
            </Button>
        </div>
        ) : (
         <ProductGrid products={filteredProducts} />
        )
      }
      {isLoading && <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary inline-block"/></div>}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-muted-foreground">Loading filters...</p></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
