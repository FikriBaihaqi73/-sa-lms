/**
 * Centralized API configuration to ensure base URLs are never hardcoded.
 */

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("VITE_API_URL is not defined in environment variables. Falling back to default.");
}

export const config = {
  apiUrl: API_URL || "http://localhost:5000",
};

/**
 * Standard fetch wrapper that prepends the base API URL
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${config.apiUrl}${endpoint}`;
  console.log('Sending request to:', url);
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}
