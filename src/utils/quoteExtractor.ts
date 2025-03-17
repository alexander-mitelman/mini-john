/**
 * Extracts quota information from server response with priority:
 * 1. Premium plan individual if exists
 * 2. Basic plan individual if exists
 * 3. Direct response if it's already a quota object
 */
export const extractQuota = (responseData: any): any | null => {
  if (!responseData) return null;
  
  console.log("Extracting quota from:", responseData);
  
  // Check if premium plan with individual exists
  if (responseData.premium && responseData.premium.individual !== undefined) {
    console.log("Using premium.individual:", responseData.premium.individual);
    
    // Create a standardized response
    return {
      price: `$${responseData.premium.individual.toFixed(2)}/week`,
      weeklyPrice: responseData.premium.individual,
    };
  }
  
  // Check if basic plan with individual exists
  if (responseData.basic && responseData.basic.individual !== undefined) {
    console.log("Using basic.individual:", responseData.basic.individual);
    
    // Create a standardized response
    return {
      price: `$${responseData.basic.individual.toFixed(2)}/week`,
      weeklyPrice: responseData.basic.individual,
    };
  }
  
  // If it's the old structure with plans.premium or plans.basic
  if (responseData.plans) {
    if (responseData.plans.premium) {
      const premium = responseData.plans.premium;
      console.log("Using plans.premium:", premium);
      
      // If premium has individual property
      if (premium.individual !== undefined) {
        return {
          price: `$${premium.individual.toFixed(2)}/week`,
          weeklyPrice: premium.individual,
        };
      }
      
      // Otherwise use the whole premium object
      if (typeof premium === 'number') {
        return {
          price: `$${premium.toFixed(2)}/week`,
          weeklyPrice: premium,
        };
      }
      
      // Ensure weeklyPrice is set if price exists but weeklyPrice doesn't
      if (premium.price && !premium.weeklyPrice) {
        if (typeof premium.price === 'number') {
          premium.weeklyPrice = premium.price;
        } else if (typeof premium.price === 'string') {
          const priceValue = parseFloat(premium.price.replace(/[^\d.]/g, ''));
          premium.weeklyPrice = priceValue;
        }
      }
      
      return premium;
    }
    
    if (responseData.plans.basic) {
      const basic = responseData.plans.basic;
      console.log("Using plans.basic:", basic);
      
      // If basic has individual property
      if (basic.individual !== undefined) {
        return {
          price: `$${basic.individual.toFixed(2)}/week`,
          weeklyPrice: basic.individual,
        };
      }
      
      // Otherwise use the whole basic object
      if (typeof basic === 'number') {
        return {
          price: `$${basic.toFixed(2)}/week`,
          weeklyPrice: basic,
        };
      }
      
      // Ensure weeklyPrice is set if price exists but weeklyPrice doesn't
      if (basic.price && !basic.weeklyPrice) {
        if (typeof basic.price === 'number') {
          basic.weeklyPrice = basic.price;
        } else if (typeof basic.price === 'string') {
          const priceValue = parseFloat(basic.price.replace(/[^\d.]/g, ''));
          basic.weeklyPrice = priceValue;
        }
      }
      
      return basic;
    }
  }
  
  // If data is already in the expected format with price or weeklyPrice
  if (responseData.price || responseData.weeklyPrice) {
    console.log("Using direct response with price:", responseData);
    
    // Ensure weeklyPrice is set if price exists but weeklyPrice doesn't
    if (responseData.price && !responseData.weeklyPrice) {
      if (typeof responseData.price === 'number') {
        responseData.weeklyPrice = responseData.price;
      } else if (typeof responseData.price === 'string') {
        const priceValue = parseFloat(responseData.price.replace(/[^\d.]/g, ''));
        responseData.weeklyPrice = priceValue;
      }
    }
    
    return responseData;
  }
  
  // If responseData itself is a number, assume it's the price
  if (typeof responseData === 'number') {
    console.log("Response is a direct number:", responseData);
    return {
      price: `$${responseData.toFixed(2)}/week`,
      weeklyPrice: responseData
    };
  }
  
  console.log("Could not extract quote from response data");
  return null;
};
