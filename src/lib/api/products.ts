// lib/api/products.ts - Products API
import type { 
  Product, 
  ProductFilters, 
  SearchResult, 
  Category, 
  ProductVariant,
  PaginatedResponse,
  ApiResponse, // Added ApiResponse
  ID 
} from '@/types';
import { apiClient, ApiError } from './base';

export const productsApi = {
  async getProducts(filters?: ProductFilters): Promise<SearchResult<Product>> {
    const response = await apiClient.get<PaginatedResponse<Product[]>>('products', filters);
    
    // Assuming Laravel pagination structure under 'data' and pagination info at root or under 'meta'/'links'
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
     // Fallback for direct array or simpler structure if not paginated as above
    if (Array.isArray(response)) {
      return {
        data: response,
        total: response.length,
        page: 1,
        limit: response.length,
        hasNext: false,
        hasPrev: false,
      };
    }
    
    throw new ApiError( (response as any).message || 'Failed to fetch products', (response as any).status || 500, response);
  },

  async getProduct(id: ID): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(`products/${id}`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Product not found', (response as any).status || 404, response);
  },

  async getProductBySlug(slug: string): Promise<Product> {
    // This endpoint might need to be `products/slug/${slug}` or similar depending on your API
    const response = await apiClient.get<ApiResponse<Product>>(`products/slug/${slug}`); 
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Product not found', (response as any).status || 404, response);
  },

  async getProductVariants(productId: ID): Promise<ProductVariant[]> {
    const response = await apiClient.get<ApiResponse<ProductVariant[]>>(`products/${productId}/variants`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to fetch product variants', (response as any).status || 500, response);
  },

  async getProductVariant(productId: ID, variantId: ID): Promise<ProductVariant> {
    const response = await apiClient.get<ApiResponse<ProductVariant>>(`products/${productId}/variants/${variantId}`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Product variant not found', (response as any).status || 404, response);
  },

  async searchProducts(query: string, filters?: Omit<ProductFilters, 'query'>): Promise<SearchResult<Product>> {
    return this.getProducts({ ...filters, query });
  },

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>('products/featured', { limit });
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to fetch featured products', (response as any).status || 500, response);
  },

  async getRelatedProducts(productId: ID, limit: number = 5): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(`products/${productId}/related`, { limit });
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to fetch related products', (response as any).status || 500, response);
  },
};
