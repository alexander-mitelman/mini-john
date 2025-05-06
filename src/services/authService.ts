
import { URI_SETTINGS } from '../utils/config';
import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'auth_token';
const AUTH_FAILURE_COUNT_KEY = 'auth_failure_count';
const MAX_AUTH_FAILURES = 3;

// Retrieve token from local storage
export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log('Retrieved token from storage:', token ? 'Token exists' : 'No token found');
  return token;
}

// Store token in local storage
export function setToken(token: string): void {
  console.log('Storing new token in localStorage');
  localStorage.setItem(TOKEN_KEY, token);
  // Reset auth failure count on successful token set
  resetAuthFailureCount();
}

// Clear token from storage (useful for debugging)
export function clearToken(): void {
  console.log('Clearing token from localStorage');
  localStorage.removeItem(TOKEN_KEY);
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

// Generic function to make an authenticated request
// If we get a 401 or any network error, refresh & retry
export async function fetchWithToken(url: string, config = { headers: {} }): Promise<any> {
  // If already exceeded max failures, don't even try
  if (hasExceededMaxFailures()) {
    console.error('Maximum authentication failures exceeded');
    throw new Error('MAX_AUTH_FAILURES_EXCEEDED');
  }

  let token = getToken();
  
  if (!token) {
    console.log('No token found, fetching a new one before request');
    token = await fetchToken();
  }

  // Insert token into request headers
  const finalConfig = {
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...config.headers,
    },
  };

  console.log(`Making authenticated request to: ${url}`);
  
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
        // Refresh the token
        token = await fetchToken();
        // Retry the request with the new token
        finalConfig.headers.Authorization = `Bearer ${token}`;
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
      
    console.error(`Error in request to ${url}:`, axiosError.message);
    throw error;
  }
}
