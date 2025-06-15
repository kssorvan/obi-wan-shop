
// src/components/shop/SearchBar.tsx
"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
}

export function SearchBar({ initialQuery = '', className }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/shop/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push(`/shop/products`); // Clear search if empty
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
      <Input
        type="search"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-10 h-10" // Ensure consistent height with button
      />
      <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground">
        <Search className="h-5 w-5" />
      </Button>
    </form>
  );
}
// Placeholder: SearchBar component.
