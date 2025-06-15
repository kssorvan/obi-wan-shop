
// src/lib/api.ts
// A simple API service for interacting with the Laravel backend.

const API_BASE_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;

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
    // Prevent fetch attempts if the base URL is not configured.
    const criticalError = "API calls cannot proceed: NEXT_PUBLIC_LARAVEL_API_URL is not configured.";
    console.error(criticalError, { endpoint, options });
    throw new Error(criticalError);
  }
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };

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
      const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}: ${response.statusText}` }));
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

    return await response.json() as T;
  } catch (error: any) {
    // This will catch network errors (like "Failed to fetch") or errors thrown above.
    if (error.message.startsWith("API calls cannot proceed")) { // Specific check for the config error
        throw error; // Re-throw the critical config error
    }
    console.error(`Network or other error during API call to ${url}:`, error.message, {originalError: error});
    // For "Failed to fetch", error.message is often just "Failed to fetch"
    // Provide a more user-friendly message.
    if (error.message.toLowerCase().includes('failed to fetch')) {
        throw new Error(`Failed to connect to the API server at ${url}. Please ensure the server is running and accessible.`);
    }
    throw error; // Re-throw the original or a more specific error
  }
}

// Example GET request
export const getFromApi = <T>(endpoint: string, options: FetchOptions = {}) => {
  return fetcher<T>(endpoint, { ...options, method: 'GET' });
};

// Example POST request
export const postToApi = <T>(endpoint: string, body: any, options: FetchOptions = {}) => {
  return fetcher<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
};

// Example PUT request
export const putToApi = <T>(endpoint: string, body: any, options: FetchOptions = {}) => {
  return fetcher<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
};

// Example DELETE request
export const deleteFromApi = <T>(endpoint: string, options: FetchOptions = {}) => {
  return fetcher<T>(endpoint, { ...options, method: 'DELETE' });
};
