// lib/api/orders.ts - Orders API
import type { 
  Order, 
  CheckoutForm, 
  OrderStatus, 
  PaymentStatus,
  ShippingMethod,
  SearchResult,
  PaginatedResponse,
  ApiResponse, // Added ApiResponse
  ID 
} from '@/types';
import { apiClient, ApiError } from './base';

export const ordersApi = {
  async getOrders(page: number = 1, limit: number = 10): Promise<SearchResult<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order[]>>('orders', { page, limit });
    
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
    
    throw new ApiError((response as any).message || 'Failed to fetch orders', (response as any).status || 500, response);
  },

  async getOrder(id: ID): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(`orders/${id}`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Order not found', (response as any).status || 404, response);
  },

  async createOrder(checkoutData: CheckoutForm): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>('orders', checkoutData);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to create order', (response as any).status || 400, response);
  },

  async cancelOrder(id: ID): Promise<Order> {
    const response = await apiClient.patch<ApiResponse<Order>>(`orders/${id}/cancel`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to cancel order', (response as any).status || 400, response);
  },

  async getShippingMethods(): Promise<ShippingMethod[]> {
    const response = await apiClient.get<ApiResponse<ShippingMethod[]>>('shipping/methods');
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to fetch shipping methods', (response as any).status || 500, response);
  },

  async trackOrder(orderNumber: string): Promise<Order> {
    // Laravel routes often use IDs, but tracking by order number is common. Adjust if your API uses ID.
    const response = await apiClient.get<ApiResponse<Order>>(`orders/track/${orderNumber}`); 
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Order not found for tracking', (response as any).status || 404, response);
  },
};
