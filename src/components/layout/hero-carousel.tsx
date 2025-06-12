
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";

const carouselItems = [
  {
    id: 1,
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "fashion sale seasonal",
    title: "New Season Styles Arrived!",
    description: "Discover the latest trends and refresh your wardrobe.",
    buttonText: "Shop New Arrivals",
    buttonLink: "/products?category=Clothing"
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "accessories collection modern",
    title: "Accessorize Your Look",
    description: "Find the perfect finishing touches for any outfit.",
    buttonText: "Explore Accessories",
    buttonLink: "/products?category=Accessories"
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/1200x600.png",
    dataAiHint: "footwear comfort style",
    title: "Step Up Your Shoe Game",
    description: "Comfortable and stylish footwear for every occasion.",
    buttonText: "Browse Shoes",
    buttonLink: "/products?category=Shoes"
  },
];

export function HeroCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
        }),
      ]}
      className="w-full rounded-xl overflow-hidden shadow-2xl"
    >
      <CarouselContent>
        {carouselItems.map((item) => (
          <CarouselItem key={item.id}>
            <div className="relative aspect-[2/1] w-full">
              <Image
                src={item.imageUrl}
                alt={item.title}
                layout="fill"
                objectFit="cover"
                priority={item.id === 1}
                data-ai-hint={item.dataAiHint}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center p-8 md:p-16">
                <div className="max-w-md md:max-w-lg text-primary-foreground">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold mb-4 leading-tight">
                    {item.title}
                  </h1>
                  <p className="text-md sm:text-lg md:text-xl mb-6 md:mb-8 opacity-90">
                    {item.description}
                  </p>
                  <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md">
                    <Link href={item.buttonLink}>
                      {item.buttonText}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        <CarouselPrevious className="static translate-y-0 bg-background/70 hover:bg-background text-primary" />
        <CarouselNext className="static translate-y-0 bg-background/70 hover:bg-background text-primary" />
      </div>
    </Carousel>
  );
}
