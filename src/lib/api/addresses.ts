// lib/api/addresses.ts - Addresses API
import type { Address, ID, ApiResponse } from '@/types'; // Added ApiResponse
import { apiClient, ApiError } from './base';

export const addressesApi = {
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get<ApiResponse<Address[]>>('profile/addresses'); // Common RESTful pattern
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to fetch addresses', (response as any).status || 500, response);
  },

  async createAddress(addressData: Omit<Address, 'id' | 'isDefault' > & { is_default?: boolean }): Promise<Address> { 
    // Laravel might expect is_default
    const payload = { ...addressData, is_default: (addressData as any).isDefault };
    delete (payload as any).isDefault;

    const response = await apiClient.post<ApiResponse<Address>>('profile/addresses', payload);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to create address', (response as any).status || 400, response);
  },

  async updateAddress(id: ID, addressData: Partial<Omit<Address, 'id' | 'isDefault'>> & { is_default?: boolean }): Promise<Address> {
    const payload = { ...addressData, is_default: (addressData as any).isDefault };
    delete (payload as any).isDefault;

    const response = await apiClient.put<ApiResponse<Address>>(`profile/addresses/${id}`, payload); // PUT for full update, PATCH for partial
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to update address', (response as any).status || 400, response);
  },

  async deleteAddress(id: ID): Promise<void> {
    const response = await apiClient.delete<ApiResponse<any>>(`profile/addresses/${id}`);
    
    if (response) { // DELETE might return 204 No Content
        return;
    }
    
    throw new ApiError((response as any).message || 'Failed to delete address', (response as any).status || 400, response);
  },

  async setDefaultAddress(id: ID): Promise<Address> { 
    // Type 'billing' | 'shipping' might not be needed if addresses are generic
    const response = await apiClient.patch<ApiResponse<Address>>(`profile/addresses/${id}/default`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError((response as any).message || 'Failed to set default address', (response as any).status || 400, response);
  },
};
