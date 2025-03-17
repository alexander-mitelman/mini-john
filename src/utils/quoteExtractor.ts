
export const extractQuota = (data: any) => {
  console.log('Extracting quota from data:', data);
  
  // If data is null or undefined
  if (!data) {
    console.log('Data is null or undefined');
    return null;
  }
  
  try {
    // Case 1: If data already has price, weeklyPrice, and features
    if (data.price !== undefined || data.weeklyPrice !== undefined) {
      console.log('Data already has price or weeklyPrice property');
      
      // Convert monthly price to weekly if weeklyPrice exists
      if (data.weeklyPrice) {
        // Divide by 4 to convert monthly to weekly
        data.weeklyPrice = parseFloat((data.weeklyPrice / 4).toFixed(2));
      }
      
      return data;
    }
    
    // Case 2: If data has "premium" and "individual" structure
    if (data.premium && data.premium.individual !== undefined) {
      console.log('Found premium.individual:', data.premium.individual);
      
      // Extract monthly premium and convert to weekly
      const monthlyPrice = data.premium.individual;
      const weeklyPrice = parseFloat((monthlyPrice / 4).toFixed(2));
      
      return {
        price: `$${weeklyPrice.toFixed(2)}/week`,
        weeklyPrice: weeklyPrice,
        features: data.features || []
      };
    }
    
    // Case 3: If data has "basic" and no "premium"
    if (!data.premium && data.basic && data.basic.individual !== undefined) {
      console.log('Found basic.individual:', data.basic.individual);
      
      // Extract monthly basic price and convert to weekly
      const monthlyPrice = data.basic.individual;
      const weeklyPrice = parseFloat((monthlyPrice / 4).toFixed(2));
      
      return {
        price: `$${weeklyPrice.toFixed(2)}/week`,
        weeklyPrice: weeklyPrice,
        features: data.features || []
      };
    }
    
    // Case 4: If data has direct price property
    if (typeof data === 'object' && Object.keys(data).length > 0) {
      // Try to find any numeric property that could be a price
      for (const key in data) {
        if (typeof data[key] === 'number') {
          console.log(`Found numeric property ${key}:`, data[key]);
          
          // Convert monthly to weekly
          const monthlyPrice = data[key];
          const weeklyPrice = parseFloat((monthlyPrice / 4).toFixed(2));
          
          return {
            price: `$${weeklyPrice.toFixed(2)}/week`,
            weeklyPrice: weeklyPrice,
            features: []
          };
        }
      }
    }
    
    console.log('Could not extract quota from data');
    return null;
  } catch (error) {
    console.error('Error extracting quota:', error);
    return null;
  }
};
