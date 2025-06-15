
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockProducts } from '@/data/products';
import { ProductCard } from '@/components/shop/ProductCard'; // Updated import
import type { Product } from '@/types';

interface StyleRecommendationOutput {
  recommendations: string;
}

export function StyleRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<StyleRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  const fetchRecommendations = async () => {
    if (!user) {
      setError("Please sign in to get personalized recommendations.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    setRecommendedProducts([]);

    try {
      // Simulate API call to Genkit flow
      // In a real app, this would call the Genkit flow deployed as an API endpoint
      // For now, mock the response
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const result: StyleRecommendationOutput = {
        // Mocked recommendations text
        recommendations: "Based on your interest in modern and minimalist styles, we think you'll love these selections. (Connect to Laravel API for real recommendations)"
      };
      setRecommendations(result);

      // Mock product filtering based on recommendations text
      // This is a very basic mock, real logic would depend on how Genkit output is structured
      if (result.recommendations) {
        const keywords = result.recommendations.toLowerCase().split(/\s+/).filter(k => k.length > 3);
        const productsToDisplay = mockProducts.filter(p => 
          keywords.some(keyword => p.name.toLowerCase().includes(keyword) || (p.description && p.description.toLowerCase().includes(keyword)))
        ).slice(0, 3); // Show up to 3 mock recommended products
        setRecommendedProducts(productsToDisplay.length > 0 ? productsToDisplay : mockProducts.slice(0,3)); // Fallback to first 3 if no match
      }

    } catch (err) {
      console.error("Error fetching style recommendations:", err);
      setError("AI recommendations are currently unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch recommendations only if user is logged in
    if (user) {
      fetchRecommendations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Re-fetch when user changes


  if (!user) {
    return (
      <Card className="my-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Wand2 className="mr-2 h-6 w-6" />
            Personalized Style Picks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Sign in to discover styles picked just for you!</p>
          <Button onClick={() => window.location.href='/auth/signin'} className="mt-4">Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-12 shadow-lg border-2 border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-2xl font-headline text-primary">
            <Wand2 className="mr-3 h-7 w-7" />
            Your Advisor Recommends
          </CardTitle>
          <Button onClick={fetchRecommendations} disabled={isLoading} variant="outline">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Refresh Picks
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Curating your style...</p>
          </div>
        )}
        {error && (
           <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {recommendations && !isLoading && (
          <div className="space-y-6">
            <p className="text-lg text-foreground leading-relaxed italic border-l-4 border-accent pl-4 py-2 bg-accent/10 rounded-r-md">
              &quot;{recommendations.recommendations}&quot;
            </p>
            {recommendedProducts.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-primary">Products you might like:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isLoading && !recommendations && !error && (
            <p className="text-muted-foreground py-4 text-center">Click "Refresh Picks" to get your personalized recommendations for Obi-Wan-Shop. (Note: AI features need backend integration)</p>
        )}
      </CardContent>
    </Card>
  );
}
