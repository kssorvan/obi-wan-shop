
"use client";
import { ProductList } from '@/components/product/product-list';
import { mockCategories } from '@/data/products'; // Keep mockCategories for dropdown until API for categories is implemented
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Star, Filter, Loader2 } from 'lucide-react'; 
import { useState, useEffect, Suspense, useCallback } from 'react'; // Added useCallback
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Product } from '@/types'; 
import { getFromApi } from '@/lib/api'; // Import API service

const sortOptions = [
  { value: 'default', label: 'Default Sorting' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
];

// Define a type for the paginated response from Laravel
interface PaginatedProductsResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  // Add other pagination fields if your Laravel API returns them
}


function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialSearchQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialPriceRange = searchParams.get('price')?.split('-').map(Number) || [0, 20000]; 
  const initialSortOption = searchParams.get('sort') || 'default';

  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange as [number, number]);
  const [sortOption, setSortOption] = useState(initialSortOption);
  
  // Note: allProducts is removed as we fetch filtered products directly
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [categoriesForFilter, setCategoriesForFilter] = useState<string[]>(mockCategories); // Placeholder

  // TODO: Fetch categories from Laravel API: GET /api/categories
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const fetchedCategories = await getFromApi<string[]>('/categories');
  //       setCategoriesForFilter(fetchedCategories);
  //     } catch (error) {
  //       console.error("Failed to fetch categories:", error);
  //       // Keep mockCategories as fallback or show error
  //     }
  //   };
  //   fetchCategories();
  // }, []);


  // Debounce search term to avoid excessive API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialSearchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  // Centralized fetch logic
  const fetchProductsFromApi = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      // Assuming price is sent as min_price and max_price, adjust if your Laravel API expects different
      if (priceRange[0] > 0) params.set('min_price', String(priceRange[0]));
      if (priceRange[1] < 20000) params.set('max_price', String(priceRange[1])); // Only set max_price if not the default max
      if (sortOption !== 'default') params.set('sort', sortOption);
      // params.set('page', '1'); // Add pagination later
      // params.set('limit', '12'); // Add limit later

      const endpoint = `/products?${params.toString()}`;
      // Assuming your Laravel API returns data directly as Product[] or a paginated structure.
      // If paginated, you'll need to adjust:
      // const response = await getFromApi<PaginatedProductsResponse>(endpoint);
      // setFilteredProducts(response.data);
      // setTotalPages(response.last_page); // For pagination UI
      
      const productsArray = await getFromApi<Product[]>(endpoint);
      setFilteredProducts(productsArray);

    } catch (error: any) {
      console.error("Failed to fetch products from Laravel API:", error);
      setFetchError(error.message || "Could not load products from backend.");
      setFilteredProducts([]); // Clear products on error
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, selectedCategory, priceRange, sortOption]); // Removed router from dependencies to avoid re-fetch on URL update by this effect


  useEffect(() => {
    fetchProductsFromApi();
  }, [fetchProductsFromApi]);


  // Update URL when filters change (client-side navigation)
  useEffect(() => {
    const params = new URLSearchParams(); // Start with current searchParams
    if (searchTerm) params.set('search', searchTerm); else params.delete('search');
    if (selectedCategory !== 'all') params.set('category', selectedCategory); else params.delete('category');
    if (priceRange[0] !== 0 || priceRange[1] !== 20000) params.set('price', `${priceRange[0]}-${priceRange[1]}`); else params.delete('price');
    if (sortOption !== 'default') params.set('sort', sortOption); else params.delete('sort');
    
    // Only push to router if params actually changed from initial URL searchParams
    // This avoids an unnecessary fetch if the component mounts with filters from URL
    const currentBrowserParams = new URLSearchParams(window.location.search);
    if (params.toString() !== currentBrowserParams.toString()) {
      router.replace(`/products?${params.toString()}`, { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, priceRange, sortOption]); // Keep router here for URL updates only

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

  if (isLoading && filteredProducts.length === 0) { // Show loader only if no products are displayed yet
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="text-center py-10 text-destructive bg-destructive/10 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Failed to Load Products</h2>
        <p>{fetchError}</p>
        <p className="mt-2 text-sm">Please ensure the Laravel API is running and accessible at {process.env.NEXT_PUBLIC_LARAVEL_API_URL}.</p>
      </div>
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
             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {/* Fetched categories will populate here */}
                {categoriesForFilter.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
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
      {/* Pass isLoading to ProductList if you want to show individual card skeletons later */}
      <ProductList products={filteredProducts} /> 
      {isLoading && <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary inline-block"/></div>}
    </div>
  );
}


export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading filters...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
