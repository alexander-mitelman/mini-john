
/**
 * Extracts quota information from server response with priority:
 * 1. Premium plan if exists
 * 2. Basic plan if exists
 * 3. Individual quota within the selected plan
 */
export const extractQuota = (responseData: any): any | null => {
  if (!responseData) return null;
  
  console.log("Extracting quota from:", responseData);
  
  // Check if response has a plans structure
  if (responseData.plans) {
    // First priority: Check for premium plan
    if (responseData.plans.premium) {
      console.log("Using premium plan:", responseData.plans.premium);
      const premium = responseData.plans.premium;
      
      // Ensure weeklyPrice is set if price exists but weeklyPrice doesn't
      if (premium.price && !premium.weeklyPrice) {
        const priceValue = parseFloat(premium.price.replace(/[^\d.]/g, ''));
        premium.weeklyPrice = priceValue;
      }
      
      return premium;
    }
    
    // Second priority: Check for basic plan
    if (responseData.plans.basic) {
      // If basic plan has individual quota, return that
      if (responseData.plans.basic.individual) {
        console.log("Using basic.individual plan:", responseData.plans.basic.individual);
        const individual = responseData.plans.basic.individual;
        
        // Ensure weeklyPrice is set if price exists but weeklyPrice doesn't
        if (individual.price && !individual.weeklyPrice) {
          const priceValue = parseFloat(individual.price.replace(/[^\d.]/g, ''));
          individual.weeklyPrice = priceValue;
        }
        
        return individual;
      }
      
      console.log("Using basic plan:", responseData.plans.basic);
      const basic = responseData.plans.basic;
      
      // Ensure weeklyPrice is set if price exists but weeklyPrice doesn't
      if (basic.price && !basic.weeklyPrice) {
        const priceValue = parseFloat(basic.price.replace(/[^\d.]/g, ''));
        basic.weeklyPrice = priceValue;
      }
      
      return basic;
    }
  }
  
  // If no plans structure or no valid plans found, process the original response
  // It might already be the quota object directly
  if (responseData.price && !responseData.weeklyPrice) {
    // Convert price to weeklyPrice if it exists
    const priceValue = parseFloat(responseData.price.replace(/[^\d.]/g, ''));
    responseData.weeklyPrice = priceValue;
  }
  
  console.log("Using direct response:", responseData);
  return responseData;
};
