
/**
 * Extracts quota information from server response with priority:
 * 1. Premium plan if exists
 * 2. Basic plan if exists
 * 3. Individual quota within the selected plan
 */
export const extractQuota = (responseData: any): any | null => {
  if (!responseData) return null;
  
  // Check if response has a plans structure
  if (responseData.plans) {
    // First priority: Check for premium plan
    if (responseData.plans.premium) {
      return responseData.plans.premium;
    }
    
    // Second priority: Check for basic plan
    if (responseData.plans.basic) {
      // If basic plan has individual quota, return that
      if (responseData.plans.basic.individual) {
        return responseData.plans.basic.individual;
      }
      return responseData.plans.basic;
    }
  }
  
  // If no plans structure or no valid plans found, return the original response
  // It might already be the quota object directly
  return responseData;
};
