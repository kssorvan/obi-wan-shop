
"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Send, Trash2, Settings, PlusCircle } from "lucide-react";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

const variants: Variant[] = ["default", "destructive", "outline", "secondary", "ghost", "link"];
const sizes: Size[] = ["default", "sm", "lg"];
const iconSizes: Size[] = ["default", "sm", "lg", "icon"]; // "icon" size is specifically for icon buttons

export default function ButtonStyleGuidePage() {
  return (
    <div className="container py-12 max-w-4xl mx-auto space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline text-primary">Button Style Guide</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            A showcase of all available button styles and sizes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Variants</h2>
            <div className="space-y-6">
              {variants.map((variant) => (
                <div key={variant}>
                  <h3 className="text-lg font-medium capitalize mb-2 text-foreground/80">{variant}</h3>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button variant={variant}>Default Size</Button>
                    <Button variant={variant} size="sm">Small Size</Button>
                    <Button variant={variant} size="lg">Large Size</Button>
                    <Button variant={variant} disabled>Disabled</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Sizes with Icons</h2>
            <p className="text-muted-foreground mb-4">Demonstrating different sizes with leading icons.</p>
            <div className="space-y-6">
              {sizes.map((size) => (
                <div key={size}>
                  <h3 className="text-lg font-medium capitalize mb-2 text-foreground/80">{size === 'default' ? 'Default Size' : size}</h3>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="default" size={size}><ShoppingCart className="mr-2" /> Add to Cart</Button>
                    <Button variant="secondary" size={size}><Heart className="mr-2" /> Favorite</Button>
                    <Button variant="outline" size={size}><Send className="mr-2" /> Submit</Button>
                     <Button variant="destructive" size={size}><Trash2 className="mr-2" /> Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <Separator />

          <section>
            <h2 className="text-2xl font-semibold text-primary mb-4">Icon Buttons</h2>
             <p className="text-muted-foreground mb-4">Buttons that only contain an icon, often used for actions in toolbars or compact UIs.</p>
            <div className="space-y-6">
              {iconSizes.map((size) => (
                 <div key={`icon-${size}`}>
                  <h3 className="text-lg font-medium capitalize mb-2 text-foreground/80">{size === 'default' ? 'Default Size' : size}</h3>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="default" size={size === "icon" ? "icon" : size} aria-label="Add Item">
                      <PlusCircle /> {size !== "icon" && "Add"}
                    </Button>
                    <Button variant="outline" size={size === "icon" ? "icon" : size} aria-label="Settings">
                      <Settings /> {size !== "icon" && "Settings"}
                    </Button>
                    <Button variant="ghost" size={size === "icon" ? "icon" : size} aria-label="Favorite">
                      <Heart /> {size !== "icon" && "Favorite"}
                    </Button>
                     <Button variant="destructive" size={size === "icon" ? "icon" : size} aria-label="Delete">
                      <Trash2 /> {size !== "icon" && "Delete"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  );
}
