
// src/components/shop/CategoryFilter.tsx
"use client";
import React from 'react';
// Placeholder: CategoryFilter component for product listings.
// This would typically involve checkboxes, radio buttons, or select dropdowns
// to filter products by categories, brands, price ranges, etc.

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, isSelected: boolean) => void;
  // Add more filter options as needed (e.g., price, brand)
}

export function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card">
      <h3 className="text-lg font-semibold mb-3 text-primary">Filter by Category</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center">
            <input
              type="checkbox"
              id={`filter-${category}`}
              checked={selectedCategories.includes(category)}
              onChange={(e) => onCategoryChange(category, e.target.checked)}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor={`filter-${category}`} className="ml-2 text-sm text-foreground">
              {category}
            </label>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">More filter options (price, brand, etc.) will be added here.</p>
    </div>
  );
}
