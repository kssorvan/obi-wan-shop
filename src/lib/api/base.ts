// lib/api/base.ts - Base API configuration and client
const API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api';

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

export class ApiClient {
  private config: ApiConfig;
  private authToken: string | null = null;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...config,
    };

    if (!this.config.baseURL.startsWith('http')) {
        console.warn(`API_BASE_URL might not be correctly configured: ${this.config.baseURL}. Ensure it includes http/https.`);
    }
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window !== 'undefined' && token) {
      localStorage.setItem('obiwanshop_auth_token', token);
    } else if (typeof window !== 'undefined' && !token) {
      localStorage.removeItem('obiwanshop_auth_token');
    }
  }

  private loadAuthTokenFromStorage() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('obiwanshop_auth_token');
      if (token) {
        this.authToken = token;
      }
    }
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    // Ensure endpoint doesn't start with a slash if baseURL already ends with one, or vice-versa
    const base = this.config.baseURL.endsWith('/') ? this.config.baseURL.slice(0, -1) : this.config.baseURL;
    const ep = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const fullPath = `${base}/${ep}`;
    
    const url = new URL(fullPath);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(`${key}[]`, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }
    
    return url.toString();
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.config.headers };
    
    this.loadAuthTokenFromStorage(); // Ensure token is loaded before request
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }
    
    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }
    
    return headers;
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers: customHeaders,
      params,
      data,
      timeout = this.config.timeout,
    } = options;

    const url = this.buildURL(endpoint, params);
    const headers = this.getHeaders(customHeaders);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        let errorData = {};
        try {
          errorData = JSON.parse(errorBody);
        } catch (e) {
            // If response is not JSON, use status text or the raw body
            errorData = { message: errorBody || `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new ApiError(
          (errorData as any).message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      if (response.status === 204) { // No Content
        return {} as T;
      }

      const result = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      if ((error as Error).name === 'AbortError') {
        throw new ApiError('Request timeout', 408, { message: 'The request took too long to complete.'});
      }
      
      // Handle network errors or other unexpected issues
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown network error occurred.';
      throw new ApiError(`Network error: ${errorMessage}`, 0, { originalError: error });
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, params?: Record<string, any>, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params, headers: customHeaders });
  }

  async post<T = any>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', data, headers: customHeaders });
  }

  async put<T = any>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', data, headers: customHeaders });
  }

  async patch<T = any>(endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', data, headers: customHeaders });
  }

  async delete<T = any>(endpoint: string, customHeaders?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers: customHeaders });
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any 
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  get isNetworkError(): boolean {
    return this.statusCode === 0; // Or handle AbortError specifically if needed
  }
}

// Create a default API client instance
export const apiClient = new ApiClient();
