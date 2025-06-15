
"use client";
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight, List, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { Category } from '@/types';
import { getFromApi } from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert'; // Added Alert components

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming your API returns an array of Category objects
        const fetchedCategories = await getFromApi<Category[]>('/categories');
        setCategories(fetchedCategories || []);
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        setError(err.message || "Could not load categories. Please try again later.");
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-lg">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8 max-w-2xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <CardTitle>Error Fetching Categories</CardTitle>
        <AlertDescription>
          {error} Please ensure the API endpoint <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded-sm">/api/categories</code> is running and accessible.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-xl shadow-lg">
        <List className="mx-auto h-12 w-12 text-primary mb-4" />
        <CardTitle className="text-4xl font-headline font-bold text-primary mb-2">Product Categories</CardTitle>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our wide range of products, neatly organized into categories for your convenience.
        </p>
      </section>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <Link key={category.id} href={`/shop/categories/${category.slug}`} passHref>
              <Card className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
                <CardHeader className="p-0 relative aspect-[4/3]">
                  <Image
                    src={category.image_url || `https://placehold.co/400x300.png?text=${encodeURIComponent(category.name)}`}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:brightness-75 transition-all duration-300"
                    data-ai-hint={category.dataAiHint || category.name.toLowerCase().split(' ').slice(0,2).join(' ')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <CardTitle className="absolute bottom-4 left-4 text-2xl font-headline text-white group-hover:text-accent transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {category.description || `Explore all products in the ${category.name.toLowerCase()} category.`}
                  </p>
                  <Button variant="outline" className="w-full mt-auto border-primary text-primary hover:bg-primary/10 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
                    View {category.name} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
            <List className="mx-auto h-24 w-24 text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">No Categories Found</h2>
            <p className="text-foreground/70">
                It seems there are no product categories available at the moment. Please check back later.
            </p>
        </div>
      )}
    </div>
  );
}

