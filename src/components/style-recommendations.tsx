
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { Alert, AlertDescription } from "@/components/ui/alert"; // Updated AlertTitle to CardTitle
import { ProductCard } from '@/components/shop/ProductCard';
import type { Product } from '@/types';
import { postToApi } from '@/lib/api'; // Import postToApi

interface StyleRecommendationInput {
  purchaseHistory: string; // Assuming JSON string as per Genkit flow
  browsingHistory: string; // Assuming JSON string
}

interface StyleRecommendationApiResponse {
  recommendations: string; // Textual recommendation
  // Potentially, the API could also return suggested product IDs or slugs
  // suggestedProductIds?: string[]; 
}

export function StyleRecommendations() {
  const { user } = useAuth();
  const [recommendationText, setRecommendationText] = useState<string | null>(null);
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
    setRecommendationText(null);
    setRecommendedProducts([]);

    try {
      const inputPayload: StyleRecommendationInput = {
        purchaseHistory: JSON.stringify(user.purchaseHistory || []),
        browsingHistory: JSON.stringify(user.browsingHistory || []),
      };
      
      // Assuming your Genkit flow is exposed via a Laravel API endpoint
      const result = await postToApi<StyleRecommendationApiResponse>('/ai/style-recommendations', inputPayload);
      
      setRecommendationText(result.recommendations);

      // TODO: Implement logic to fetch actual products based on recommendations
      // This might involve parsing product IDs/slugs from `result` if your API provides them,
      // or making another API call to search/filter products based on the recommendation text.
      // For now, mocking a few products as a placeholder if text is received.
      if (result.recommendations) {
        // This is a placeholder: fetch actual products based on recommendation logic
        // For example, if result.suggestedProductIds was populated:
        // const products = await getFromApi<Product[]>(`/products/batch?ids=${result.suggestedProductIds.join(',')}`);
        // setRecommendedProducts(products);
        
        // Fallback mock if no direct product IDs are returned:
        // You might need a more sophisticated way to get products based on textual recs.
        // This is a VERY basic mock:
        const mockProductIds = ['1', '3', '6']; // Example IDs
        const fetchedProducts = await Promise.all(
            mockProductIds.map(id => postToApi<Product>(`/products/${id}`, {}).catch(() => null) ) // Use GET or appropriate method
        );
        setRecommendedProducts(fetchedProducts.filter(p => p !== null) as Product[]);
      }

    } catch (err: any) {
      console.error("Error fetching style recommendations:", err);
      setError(err.message || "AI recommendations are currently unavailable. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


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
            <AlertTriangle className="h-4 w-4" />
            <CardTitle>Error</CardTitle> {/* Using CardTitle for consistency if AlertTitle is not available in this context */}
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {recommendationText && !isLoading && (
          <div className="space-y-6">
            <p className="text-lg text-foreground leading-relaxed italic border-l-4 border-accent pl-4 py-2 bg-accent/10 rounded-r-md">
              &quot;{recommendationText}&quot;
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
            {/* Show if AI gave text but no products were found/matched */}
            {recommendationText && recommendedProducts.length === 0 && !isLoading && (
                <p className="text-muted-foreground text-center py-4">No specific products matched the recommendation. Explore our collections!</p>
            )}
          </div>
        )}

        {!isLoading && !recommendationText && !error && (
            <p className="text-muted-foreground py-4 text-center">Click "Refresh Picks" to get your personalized recommendations for Obi-Wan-Shop.</p>
        )}
      </CardContent>
    </Card>
  );
}
