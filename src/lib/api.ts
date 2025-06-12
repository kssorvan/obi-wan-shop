// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;

console.log('API_BASE_URL loaded:', API_BASE_URL); // Debug log

if (!API_BASE_URL) {
  console.error(
    "CRITICAL ERROR: NEXT_PUBLIC_LARAVEL_API_URL is not set. API calls WILL FAIL."
  );
}

interface FetchOptions extends RequestInit {
  // Add any custom options you might need
}

async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    const criticalError = "API calls cannot proceed: NEXT_PUBLIC_LARAVEL_API_URL is not configured.";
    console.error(criticalError, { endpoint, options });
    throw new Error(criticalError);
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('Making API call to:', url); // Debug log

  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    // Add CORS headers
    'Access-Control-Allow-Origin': '*',
  };

  const config: RequestInit = {
    mode: 'cors', // Explicitly set CORS mode
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    console.log('Fetch config:', config); // Debug log
    const response = await fetch(url, config);
    console.log('Response received:', response.status, response.statusText); // Debug log

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP error ${response.status}: ${response.statusText}` 
      }));
      let errorMessage = errorData.message || `API Error: ${response.status}`;
      if (errorData.errors) { 
        const validationMessages = Object.values(errorData.errors).flat().join(' ');
        errorMessage = `${errorMessage} ${validationMessages}`;
      }
      console.error(`API Error for ${url} (${response.status}):`, errorMessage, errorData);
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T; 
    }

    const data = await response.json() as T;
    console.log('API response data:', data); // Debug log
    return data;
  } catch (error: any) {
    console.error(`Network or other error during API call to ${url}:`, {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    if (error.message.startsWith("API calls cannot proceed")) {
      throw error;
    }
    
    if (error.message.toLowerCase().includes('failed to fetch')) {
      throw new Error(`Failed to connect to the API server at ${url}. Please check:
        1. Laravel server is running (php artisan serve)
        2. CORS is properly configured
        3. URL is correct: ${API_BASE_URL}`);
    }
    throw error;
  }
}

export const getFromApi = <T>(endpoint: string, options: FetchOptions = {}) => {
  return fetcher<T>(endpoint, { ...options, method: 'GET' });
};

export const postToApi = <T>(endpoint: string, body: any, options: FetchOptions = {}) => {
  return fetcher<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
};

export const putToApi = <T>(endpoint: string, body: any, options: FetchOptions = {}) => {
  return fetcher<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
};

export const deleteFromApi = <T>(endpoint: string, options: FetchOptions = {}) => {
  return fetcher<T>(endpoint, { ...options, method: 'DELETE' });
};