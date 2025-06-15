// lib/api/favorites.ts - Favorites API
import type { 
  ID, 
  Product, 
  SearchResult,
  PaginatedResponse,
  ApiResponse // Added ApiResponse
} from '@/types';
import { apiClient, ApiError } from './base';

export const favoritesApi = {
  async getFavorites(): Promise<ID[]> { // Assuming this returns an array of product IDs
    const response = await apiClient.get<ApiResponse<ID[]>>('favorites');
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to fetch favorites IDs', (response as any).status || 500, response);
  },

  async getFavoriteProducts(page: number = 1, limit: number = 10): Promise<SearchResult<Product>> {
    // This endpoint might fetch full product details for favorited items
    const response = await apiClient.get<PaginatedResponse<Product[]>>('favorites/products', { page, limit });
    
    if (response.data && response.data.length !== undefined && response.meta && response.links) {
      return {
        data: response.data,
        total: response.meta.total,
        page: response.meta.current_page,
        limit: response.meta.per_page,
        hasNext: !!response.links.next,
        hasPrev: !!response.links.prev,
      };
    }
    
    throw new ApiError((response as any).message || 'Failed to fetch favorite products', (response as any).status || 500, response);
  },

  async addToFavorites(productId: ID): Promise<void> {
    const response = await apiClient.post<ApiResponse<any>>('favorites', { product_id: productId }); // snake_case for Laravel
    
    // Typically, a successful POST might return 201 Created or 200 OK with data
    // If no specific data is returned on success, check for a success message or status
    if (response && (response.data || response.message)) { // Looser check for success
        return;
    }
    
    throw new ApiError((response as any).message || 'Failed to add to favorites', (response as any).status || 400, response);
  },

  async removeFromFavorites(productId: ID): Promise<void> {
    const response = await apiClient.delete<ApiResponse<any>>(`favorites/${productId}`);
    
    if (response) { // Looser check, DELETE might return 204 No Content
        return;
    }
    
    throw new ApiError((response as any).message || 'Failed to remove from favorites', (response as any).status || 400, response);
  },
};
