
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Lightbulb, Zap } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-8">
          <Users className="mx-auto h-16 w-16 text-primary mb-6" />
          <CardTitle className="text-4xl font-headline text-primary">About Obi-Wan-Shop</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2 max-w-2xl mx-auto">
            Discover the future of personalized fashion with Obi-Wan-Shop. We're passionate about helping you find your unique style.
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none text-foreground/90 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-primary flex items-center"><Lightbulb className="mr-3 h-6 w-6" /> Our Mission</h2>
            <p>At Obi-Wan-Shop, our mission is to revolutionize the way you discover and shop for fashion. We believe that everyone has a unique style, and our AI-powered platform is designed to help you express it effortlessly. We aim to provide a seamless, enjoyable, and personalized shopping experience that inspires confidence and creativity.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-primary flex items-center"><Zap className="mr-3 h-6 w-6" /> What We Do</h2>
            <p>Obi-Wan-Shop leverages cutting-edge artificial intelligence to understand your preferences, analyze trends, and curate a selection of products tailored just for you. Our platform offers:</p>
            <ul>
              <li><strong>Personalized Recommendations:</strong> Get style suggestions based on your purchase history, browsing behavior, and favorite items.</li>
              <li><strong>Curated Product Showcase:</strong> Explore a wide range of products from top brands and emerging designers across clothing, shoes, and accessories.</li>
              <li><strong>Intuitive Shopping Experience:</strong> Enjoy features like easy navigation, smart search, favorites management, and a streamlined checkout process.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-primary">Why Choose Us?</h2>
            <p>We are more than just an e-commerce platform; we are your personal style partner. Our commitment to innovation, quality, and customer satisfaction drives us to continually enhance our services. Join the Obi-Wan-Shop community and experience fashion discovery like never before.</p>
          </section>

           <section className="text-center pt-6">
            <p className="text-xl font-medium text-primary">Thank you for being a part of Obi-Wan-Shop!</p>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
