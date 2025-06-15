// lib/api/index.ts - Main API exports
export * from './base';
export * from './auth';
export * from './products';
export * from './categories';
export * from './cart';
export * from './orders';
export * from './favorites';
export * from './addresses';

// Import individual API modules
import { authApi } from './auth';
import { productsApi } from './products';
import { categoriesApi } from './categories';
import { cartApi } from './cart';
import { ordersApi } from './orders';
import { favoritesApi } from './favorites';
import { addressesApi } from './addresses';

// Centralized API object for easier imports
export const api = {
  auth: authApi,
  products: productsApi,
  categories: categoriesApi,
  cart: cartApi,
  orders: ordersApi,
  favorites: favoritesApi,
  addresses: addressesApi,
};

// Error handling utility
import { ApiError } from './base'; // Ensure ApiError is exported from base.ts

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    // You can add more specific error handling here if needed
    // e.g., if (error.statusCode === 401) { /* handle auth error */ }
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}
