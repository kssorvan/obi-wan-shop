// lib/api/categories.ts - Categories API
import type { 
  Product, 
  ProductFilters, 
  SearchResult, 
  Category,
  ApiResponse, // Added ApiResponse
  ID 
} from '@/types';
import { apiClient, ApiError } from './base';
import { productsApi } from './products'; // For getCategoryProducts

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<Category[]>>('categories');
    
    // Handle cases where API might return data directly or nested under 'data'
    const categoriesData = response.data || (Array.isArray(response) ? response : undefined);

    if (categoriesData) {
      return categoriesData;
    }
    
    throw new ApiError((response as any).message || 'Failed to fetch categories', (response as any).status || 500, response);
  },

  async getCategory(id: ID): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(`categories/${id}`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Category not found', (response as any).status || 404, response);
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await apiClient.get<ApiResponse<Category>>(`categories/slug/${slug}`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Category not found', (response as any).status || 404, response);
  },

  async getCategoryProducts(categoryId: ID, filters?: ProductFilters): Promise<SearchResult<Product>> {
    // Ensure categoryId is passed in filters correctly
    return productsApi.getProducts({ ...filters, categoryId: categoryId });
  },
};
