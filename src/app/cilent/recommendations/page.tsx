import { StyleRecommendations } from '@/components/style-recommendations';
import { Wand2 } from 'lucide-react';

export default function AIRecommendationsPage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-xl shadow-lg">
        <Wand2 className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-4xl font-headline font-bold text-primary mb-2">Your AI Style Picks</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover products and styles tailored just for you by our intelligent style advisor.
        </p>
      </section>
      
      <StyleRecommendations />
    </div>
  );
}
