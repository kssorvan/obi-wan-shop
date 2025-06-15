// lib/api/cart.ts - Cart API
import type { Cart, CartItem, ID, ApiResponse } from '@/types';
import { apiClient, ApiError } from './base';

export const cartApi = {
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<ApiResponse<Cart>>('cart');
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to fetch cart', (response as any).status || 500, response);
  },

  async addToCart(productId: ID, variantId?: ID, quantity: number = 1): Promise<Cart> {
    const response = await apiClient.post<ApiResponse<Cart>>('cart/items', {
      product_id: productId, // Snake case for Laravel
      variant_id: variantId, // Snake case for Laravel
      quantity,
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to add item to cart', (response as any).status || 400, response);
  },

  async updateCartItem(itemId: ID, quantity: number): Promise<Cart> {
    const response = await apiClient.patch<ApiResponse<Cart>>(`cart/items/${itemId}`, {
      quantity,
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to update cart item', (response as any).status || 400, response);
  },

  async removeCartItem(itemId: ID): Promise<Cart> {
    const response = await apiClient.delete<ApiResponse<Cart>>(`cart/items/${itemId}`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to remove cart item', (response as any).status || 400, response);
  },

  async clearCart(): Promise<void> {
    // Some APIs might return the cleared (empty) cart, some just 204 No Content
    const response = await apiClient.delete<ApiResponse<null | Cart>>('cart'); // Allow null or Cart for response.data
    
    if (response) { // Check if response itself is truthy (i.e., request succeeded in some form)
        return;
    }

    throw new ApiError((response as any).message || 'Failed to clear cart', (response as any).status || 500, response);
  },

  async applyCoupon(code: string): Promise<Cart> {
    const response = await apiClient.post<ApiResponse<Cart>>('cart/coupon', { code });
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to apply coupon', (response as any).status || 400, response);
  },

  async removeCoupon(): Promise<Cart> {
    const response = await apiClient.delete<ApiResponse<Cart>>('cart/coupon');
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to remove coupon', (response as any).status || 400, response);
  },
};
