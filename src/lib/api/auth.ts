// lib/api/auth.ts - Authentication API
import type { 
  ApiResponse, 
  User, 
  SignInForm, 
  SignUpForm, 
  UserProfile,
  ID 
} from '@/types';
import { apiClient, ApiError } from './base';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string; // Optional based on your backend strategy
}

export const authApi = {
  async signIn(credentials: SignInForm): Promise<AuthResponse> {
    // Type assertion to indicate that the data part of ApiResponse will be AuthResponse
    const response = await apiClient.post<ApiResponse<AuthResponse>>('login', credentials);
    
    if (response.data && response.data.token) { // Assuming Laravel returns data directly, not nested under 'data' for this specific case
      apiClient.setAuthToken(response.data.token);
      return response.data;
    }
    
    throw new ApiError(response.message || 'Sign in failed', response.error ? 400 : 500, response);
  },

  async signUp(userData: SignUpForm): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('register', {
      ...userData,
      // Laravel often requires password_confirmation
      password_confirmation: userData.password 
    });
    
    if (response.data && response.data.token) {
      apiClient.setAuthToken(response.data.token);
      return response.data;
    }
    
    throw new ApiError(response.message || 'Sign up failed', response.error ? 400 : 500, response);
  },

  async signOut(): Promise<void> {
    try {
      await apiClient.post('logout'); // Endpoint to invalidate token on backend if applicable
    } catch (error) {
        // Log or handle server-side logout error, but still clear client-side token
        console.warn('Error during server-side sign out:', error);
    } finally {
      apiClient.setAuthToken(null); // Always clear local token
    }
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('auth/refresh', { // Assuming a standard refresh endpoint
      refreshToken,
    });
    
    if (response.data && response.data.token) {
      apiClient.setAuthToken(response.data.token);
      return response.data;
    }
    
    throw new ApiError(response.message || 'Token refresh failed', response.error ? 400 : 500, response);
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('user'); // Common Laravel endpoint for current user
    
    if (response.data) { // Assuming Laravel returns user directly
      return response.data;
    }
    
    throw new ApiError(response.message || 'Failed to get current user', response.error ? 400 : 500, response);
  },

  async updateProfile(profileData: Partial<UserProfile>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>('profile', profileData); // Typically PUT or PATCH
    
    if (response.data) {
      return response.data;
    }
    
    throw new ApiError(response.message || 'Failed to update profile', response.error ? 400 : 500, response);
  },

  async changePassword(current_password: string, new_password: string, new_password_confirmation: string): Promise<void> {
    // Corrected payload for Laravel
    const response = await apiClient.post<ApiResponse>('profile/change-password', {
      current_password,
      new_password,
      new_password_confirmation
    });
    
    // Assuming 2xx response means success, no specific data needed
    if (response && response.message === "Password updated successfully") { // Or check status code if no specific message
        return;
    }
    
    throw new ApiError(response.message || 'Failed to change password', response.error ? 400 : 500, response);
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await apiClient.post<ApiResponse>('forgot-password', { email }); // Common Laravel endpoint
    
    if (response.message) { // Laravel often returns a message on success
        return;
    }
    
    throw new ApiError(response.message || 'Failed to request password reset', response.error ? 400 : 500, response);
  },

  async resetPassword(token: string, email: string, password: string, password_confirmation: string): Promise<void> {
     // Common Laravel endpoint and payload
    const response = await apiClient.post<ApiResponse>('reset-password', {
      token,
      email,
      password,
      password_confirmation,
    });
    
    if (response.message) {
        return;
    }
    
    throw new ApiError(response.message || 'Failed to reset password', response.error ? 400 : 500, response);
  },
};
