
// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
// Prisma import is kept if this route might be used for other purposes,
// or if some products are still managed by Prisma directly.
// If ALL products come from Laravel, Prisma here is not needed for this specific route.
// import prisma from '@/lib/db'; 
// import type { Product, MotorcycleProductDBSchema } from '@/types'; 

// Helper function to transform database schema to Product type
// This was for Prisma; if not using Prisma here, it's not needed for this route.
// const transformToProduct = (dbProduct: MotorcycleProductDBSchema): Product => { ... };


export async function GET() {
  // This Next.js API route is likely to be deprecated or used for other purposes
  // if the frontend directly fetches products from the Laravel API.
  
  // Option 1: Return an empty array or a message indicating deprecation.
  // console.warn("/api/products Next.js route was called. Consider fetching directly from Laravel.");
  // return NextResponse.json([]);

  // Option 2: If you still want this to be a proxy or fallback (not recommended for primary data flow)
  // try {
  //   // Example: Fetch from Laravel API if this were a proxy
  //   // const laravelApiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  //   // if (!laravelApiUrl) throw new Error("Laravel API URL not configured");
  //   // const response = await fetch(`${laravelApiUrl}/products`);
  //   // if (!response.ok) throw new Error('Failed to fetch from Laravel');
  //   // const products = await response.json();
  //   // return NextResponse.json(products);

  //   // If still using Prisma as a fallback or for specific products:
  //   // const productsFromDb = await prisma.products.findMany({...});
  //   // const products: Product[] = productsFromDb.map(p => transformToProduct(p as unknown as MotorcycleProductDBSchema));
  //   // return NextResponse.json(products);

  // } catch (error) {
  //   console.error('API Error - /api/products Next.js route:', error);
  //   let errorMessage = 'Failed to fetch products via Next.js API route';
  //   if (error instanceof Error) {
  //       errorMessage = error.message;
  //   }
  //   return NextResponse.json({ error: errorMessage, details: String(error) }, { status: 500 });
  // }

  // For now, let's return a clear message and empty data.
  return NextResponse.json({ 
    message: "This Next.js API endpoint for products is for placeholder/fallback purposes. Product data should primarily be fetched from the Laravel backend.",
    data: [] 
  });
}
