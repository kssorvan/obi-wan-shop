
"use client";
import Link from 'next/link';
import { mockProducts, mockCategories } from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Function to get a sample image for a category
const getCategoryImage = (categoryName: string) => {
  const productInCategory = mockProducts.find(p => p.category === categoryName);
  return productInCategory ? productInCategory.imageUrl : 'https://placehold.co/400x300.png';
};
const getCategoryDataAiHint = (categoryName: string) => {
  const productInCategory = mockProducts.find(p => p.category === categoryName);
  return productInCategory?.dataAiHint || categoryName.toLowerCase();
}

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-xl shadow-lg">
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Product Categories</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our wide range of products, neatly organized into categories for your convenience.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCategories.map(category => (
          <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} passHref>
            <Card className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col">
              <CardHeader className="p-0 relative aspect-[4/3]">
                <Image
                  src={getCategoryImage(category)}
                  alt={category}
                  layout="fill"
                  objectFit="cover"
                  className="group-hover:brightness-75 transition-all duration-300"
                  data-ai-hint={getCategoryDataAiHint(category)}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                 <CardTitle className="absolute bottom-4 left-4 text-2xl font-headline text-white group-hover:text-accent transition-colors">
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col justify-between">
                <p className="text-sm text-muted-foreground mb-4">
                  Explore all {category.toLowerCase()} products.
                </p>
                <Button variant="outline" className="w-full mt-auto border-primary text-primary hover:bg-primary/10 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
                  View {category} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
