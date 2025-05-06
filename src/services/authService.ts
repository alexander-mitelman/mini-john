
import { URI_SETTINGS } from '../utils/config';
import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
const AUTH_FAILURE_COUNT_KEY = 'auth_failure_count';
const MAX_AUTH_FAILURES = 3;
const MAX_FETCH_RETRIES = 5;

// Retrieve token from local storage
export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('Retrieved token from storage:', token ? 'Token exists' : 'No token found');
  return token;
}

// Store token in local storage with an expiry time (1 hour from now by default)
export function setToken(token: string, expiryInMs = 3600000): void {
  console.log('Storing new token in localStorage');
  localStorage.setItem(TOKEN_KEY, token);
  
  // Set token expiry time
  const expiryTime = Date.now() + expiryInMs;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  
  // Reset auth failure count on successful token set
  resetAuthFailureCount();
}

// Check if the token is valid (not expired)
export function isTokenValid(): boolean {
  const token = getToken();
  if (!token) {
    console.log('No token found, not valid');
    return false;
  }
  
  const expiryTimeStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryTimeStr) {
    console.log('No expiry time found for token, considering invalid');
    return false;
  }
  
  const expiryTime = parseInt(expiryTimeStr, 10);
  const isValid = Date.now() < expiryTime;
  
  console.log('Token validity check:', isValid ? 'Valid' : 'Expired');
  return isValid;
}

// Clear token from storage (useful for debugging)
export function clearToken(): void {
  console.log('Clearing token from localStorage');
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

// Track authentication failures
export function getAuthFailureCount(): number {
  const count = localStorage.getItem(AUTH_FAILURE_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
}

export function incrementAuthFailureCount(): number {
  const currentCount = getAuthFailureCount();
  const newCount = currentCount + 1;
  localStorage.setItem(AUTH_FAILURE_COUNT_KEY, newCount.toString());
  console.log(`Auth failure count increased to ${newCount}`);
  return newCount;
}

export function resetAuthFailureCount(): void {
  localStorage.removeItem(AUTH_FAILURE_COUNT_KEY);
  console.log('Auth failure count reset');
}

export function hasExceededMaxFailures(): boolean {
  return getAuthFailureCount() >= MAX_AUTH_FAILURES;
}

// Ensure we have a valid token or fetch a new one
export async function ensureValidToken(): Promise<string> {
  console.log('Ensuring we have a valid token');
  
  // Check if we have a token and if it's still valid
  if (isTokenValid()) {
    console.log('Current token is still valid, using it');
    return getToken()!;
  }
  
  // No token or expired token, fetch a new one
  console.log('Token missing or expired, fetching a new one');
  return fetchToken();
}

// Fetch a new token from /auth
export async function fetchToken(): Promise<string> {
  // If already exceeded max failures, don't even try
  if (hasExceededMaxFailures()) {
    console.error('Maximum authentication failures exceeded');
    throw new Error('MAX_AUTH_FAILURES_EXCEEDED');
  }

  console.log('Fetching new auth token from:', URI_SETTINGS.auth());
  try {
    const response = await axios.get(URI_SETTINGS.auth());
    console.log('Auth response received:', response.status);
    
    // Assume the token is in response.data.access_token
    const newToken = response.data.access_token;
    if (!newToken) {
      console.error('No token found in response:', response.data);
      throw new Error('No token in response');
    }
    
    setToken(newToken);
    return newToken;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    incrementAuthFailureCount();
    throw error;
  }
}

// Generic function to make an authenticated request with retry logic
// If we get a 401 or any network error, refresh & retry up to 5 times
export async function fetchWithToken(url: string, config = { headers: {} }): Promise<any> {
  // If already exceeded max failures, don't even try
  if (hasExceededMaxFailures()) {
    console.error('Maximum authentication failures exceeded');
    throw new Error('MAX_AUTH_FAILURES_EXCEEDED');
  }

  let retryCount = 0;
  const executeRequest = async (): Promise<any> => {
    // Ensure we have a valid token before making the request
    const token = await ensureValidToken();
    
    // Insert token into request headers
    const finalConfig = {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };

    console.log(`Making authenticated request to: ${url} (Attempt ${retryCount + 1}/${MAX_FETCH_RETRIES + 1})`);
    
    try {
      const resp = await axios(url, finalConfig);
      console.log(`Request to ${url} successful:`, resp.status);
      return resp;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      
      // If unauthorized (401) or network error, refresh token and retry
      if (axiosError.response?.status === 401 || axiosError.code === 'ERR_NETWORK') {
        console.error('Token has expired or network error, refreshing token...');
        try {
          // Clear existing token and fetch a new one
          clearToken();
          const newToken = await fetchToken();
          
          // Retry the request with the new token
          finalConfig.headers.Authorization = `Bearer ${newToken}`;
          console.log(`Retrying request to ${url} with new token`);
          return axios(url, finalConfig);
        } catch (refreshError) {
          // Check if we've exceeded max failures after the refresh attempt
          if (hasExceededMaxFailures()) {
            throw new Error('MAX_AUTH_FAILURES_EXCEEDED');
          }
          throw refreshError;
        }
      }
      
      // For other errors, if we haven't exceeded max retries, try again
      if (retryCount < MAX_FETCH_RETRIES) {
        retryCount++;
        console.log(`Request failed, retry attempt ${retryCount} of ${MAX_FETCH_RETRIES}`);
        // Exponential backoff: wait 2^retryCount * 500ms before retrying (500ms, 1s, 2s, 4s, 8s)
        const delay = Math.pow(2, retryCount - 1) * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
        return executeRequest();
      }
        
      console.error(`Error in request to ${url} after ${MAX_FETCH_RETRIES + 1} attempts:`, axiosError.message);
      throw error;
    }
  };

  return executeRequest();
}
