
/**
 * Utility functions and constants for configuration
 */

// Environment detection
export const isDev = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Distributor identification
export const isDistributor = (code: string): boolean => {
  return false; // Example implementation - can be updated as needed
};

// Constants
export const BABRM = 'BABRM';
export const DEBOUNCE_DELAY = 500;

// URIs for different services
export const URI_SETTINGS = {
  auth() {
    if (isDev()) {
      return 'https://ltfuhej4l0.execute-api.us-east-1.amazonaws.com/dev/auth';
    }
    return 'https://9t1c2qgm8j.execute-api.us-east-1.amazonaws.com/prod/auth';
  },
  quote() {
    if (isDev()) {
      return 'https://5kfkw0uyea.execute-api.us-east-1.amazonaws.com/dev/quote';
    }
    return 'https://ubucgvtxog.execute-api.us-east-1.amazonaws.com/prod/quote';
  }
};
