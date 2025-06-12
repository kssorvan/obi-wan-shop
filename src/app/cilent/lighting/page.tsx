
"use client";

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { mockLightingProducts, lightingCategoriesAndFilters, type LightingCategory } from '@/data/lighting-products';
import { ProductCard } from '@/components/product/product-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

export default function LightingPage() {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockLightingProducts);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (categoryName: string, filterValue: string, isChecked: boolean) => {
    setSelectedFilters(prevFilters => {
      const currentCategoryFilters = prevFilters[categoryName] || [];
      if (isChecked) {
        return {
          ...prevFilters,
          [categoryName]: [...currentCategoryFilters, filterValue],
        };
      } else {
        return {
          ...prevFilters,
          [categoryName]: currentCategoryFilters.filter(f => f !== filterValue),
        };
      }
    });
  };
  
  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0);
  };

  useEffect(() => {
    let products = [...mockLightingProducts];
    const activeFilterGroups = Object.keys(selectedFilters).filter(key => selectedFilters[key].length > 0);

    if (activeFilterGroups.length > 0) {
      products = products.filter(product => {
        // Product must match at least one filter from EACH active filter group (AND logic between groups)
        return activeFilterGroups.every(groupName => {
          const groupFilters = selectedFilters[groupName];
          if (!groupFilters || groupFilters.length === 0) return true; // if group has no selected filters, it doesn't restrict
          
          // Product must match at least one selected filter WITHIN this group (OR logic within a group)
          return groupFilters.some(filterValue => product.tags?.includes(filterValue));
        });
      });
    }
    setFilteredProducts(products);
  }, [selectedFilters]);

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-headline font-bold text-primary mb-2">Lighting</h1>
        <p className="text-xl text-muted-foreground">Find your perfect light</p>
      </header>

      <div className="lg:hidden mb-6">
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="w-full">
          <Filter className="mr-2 h-4 w-4" />
          {showFilters ? 'Hide Filters' : `Show Filters (${getActiveFilterCount()})`}
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-1/4 xl:w-1/5 ${showFilters ? 'block' : 'hidden'} lg:block sticky top-24 self-start`}>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-primary">Filters</h2>
              {getActiveFilterCount() > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-destructive hover:text-destructive">
                  <X className="mr-1 h-4 w-4" /> Clear All
                </Button>
              )}
            </div>
            <ScrollArea className="h-[calc(100vh-200px)] lg:h-auto lg:max-h-[70vh] pr-3">
              <form className="space-y-6">
                {lightingCategoriesAndFilters.map(category => (
                  <fieldset key={category.name}>
                    <legend className="text-lg font-medium text-foreground mb-3 pb-1 border-b border-border">{category.name}</legend>
                    <div className="space-y-3">
                      {category.filters.map(filter => (
                        <div key={filter.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={filter.id}
                            checked={(selectedFilters[category.name] || []).includes(filter.value)}
                            onCheckedChange={(checked) => handleFilterChange(category.name, filter.value, !!checked)}
                          />
                          <Label htmlFor={filter.id} className="text-sm font-normal text-muted-foreground hover:text-foreground cursor-pointer">
                            {filter.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </form>
            </ScrollArea>
          </div>
        </aside>

        {/* Products Grid */}
        <article className="lg:w-3/4 xl:w-4/5">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-lg shadow">
              <Filter className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
              <h3 className="text-2xl font-semibold text-muted-foreground">No Products Found</h3>
              <p className="text-foreground/70 mt-2">Try adjusting your filters or clear them to see all lighting products.</p>
              <Button onClick={clearAllFilters} variant="outline" className="mt-6">Clear Filters</Button>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
