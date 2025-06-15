
// src/lib/api.ts
// A simple API service for interacting with the Laravel backend.

const API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
const AUTH_TOKEN_KEY = 'obiwanshop_auth_token'; // Same key as in AuthContext

if (!API_BASE_URL) {
  console.error(
    "CRITICAL ERROR: NEXT_PUBLIC_LARAVEL_API_URL is not set. API calls WILL FAIL. " +
    "Please set this environment variable in your .env.local file (e.g., NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000/api) " +
    "and ensure your Laravel backend is running and accessible at that URL."
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

  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

  // Add JWT token to headers if available
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem(AUTH_TOKEN_KEY);
  }

  if (token) {
    (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Attempt to parse error response from API
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text
        errorData = { message: `HTTP error ${response.status}: ${response.statusText}` };
      }

      let errorMessage = errorData.message || `API Error: ${response.status}`;
      if (errorData.errors) { 
        const validationMessages = Object.values(errorData.errors).flat().join(' ');
        errorMessage = `${errorMessage} ${validationMessages}`;
      }
      // If 401, it might mean token is invalid/expired, could trigger logout
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY); 
        // Optionally, dispatch a global event or redirect to login
        // window.dispatchEvent(new Event('auth-error-401'));
        // Consider not redirecting from here to avoid tight coupling, let calling code decide.
      }
      console.error(`API Error for ${url} (${response.status}):`, errorMessage, errorData);
      throw new Error(errorMessage);
    }

    if (response.status === 204) { // No Content
      return {} as T; 
    }

    return await response.json() as T;
  } catch (error: any) {
    if (error.message.startsWith("API calls cannot proceed")) {
        throw error;
    }
    if (error.message.toLowerCase().includes('failed to fetch')) {
        throw new Error(`Failed to connect to the API server at ${url}. Please ensure the server is running and accessible.`);
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
