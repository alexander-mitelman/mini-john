
// Define base types for our API
export interface UserInfo {
  age: number;
  zipCode: string;
  income: string;
  annualSalary?: number;
  employeeCoverage?: number;
  spouseCoverage?: number;
}

export type IndividualInfo = UserInfo;

export interface ProductResponse {
  price: string;
  weeklyPrice?: number;
  features?: Array<{
    icon: string;
    text: string;
  }>;
}

export interface InsuranceProducts {
  ltd: ProductResponse;
  std: ProductResponse;
  life: ProductResponse;
  accident: ProductResponse;
  dental: ProductResponse;
  vision: ProductResponse;
  critical?: ProductResponse;
}

// Define the product trigger interface
export interface ProductTriggers {
  age?: boolean;
  annualSalary?: boolean;
  zipCode?: boolean;
  employeeCoverage?: boolean;
  spouseCoverage?: boolean;
}

// Product configuration with triggers and URL builders
export const productConfig = {
  ltd: {
    triggers: { annualSalary: true } as ProductTriggers,
    buildUrl: ({ annualSalary }: UserInfo) => `/ltd/?salary=${annualSalary}`
  },
  std: {
    triggers: { annualSalary: true, age: true } as ProductTriggers,
    buildUrl: ({ annualSalary, age }: UserInfo) => `/std/?salary=${annualSalary}&age=${age}`
  },
  life: {
    triggers: { age: true, employeeCoverage: true, spouseCoverage: true } as ProductTriggers,
    buildUrl: ({ age, employeeCoverage, spouseCoverage }: UserInfo) => 
      `/life/?age=${age}&employeeCoverage=${employeeCoverage}&spouseCoverage=${spouseCoverage}`
  },
  accident: {
    triggers: { annualSalary: true, age: true, zipCode: true, employeeCoverage: true, spouseCoverage: true } as ProductTriggers,
    buildUrl: () => `/accident`
  },
  dental: {
    triggers: { zipCode: true } as ProductTriggers,
    buildUrl: ({ zipCode }: UserInfo) => `/dental/?zipCode=${zipCode}`
  },
  vision: {
    triggers: { zipCode: true } as ProductTriggers,
    buildUrl: ({ zipCode }: UserInfo) => `/vision/?zipCode=${zipCode}`
  },
  critical: {
    triggers: { age: true } as ProductTriggers,
    buildUrl: ({ age }: UserInfo) => `/critical/?age=${age}`
  },
};

// Mock API functions that simulate fetching from a server
// This could be replaced with real API calls in the future
const mockProductData: Record<string, ProductResponse> = {
  ltd: {
    price: "$28.21/week",
    weeklyPrice: 28.21,
    features: [
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1a8ce5d1400d6d9ddccb3d7b44ef7987bef61e346c61dca4d08743b45201c135?placeholderIfAbsent=true",
        text: "Up to $10,000 of monthly benefit",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/17bc3e1790425a777f677b9f946a429aaeaa56d6832a85e738e1bcf9081b4630?placeholderIfAbsent=true",
        text: "Benefit paid up to normal retirement age",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/aa0461f3a5d51685647cbc8959d7e56a49174f4f6c8e6a89f18e754bc9cbfadf?placeholderIfAbsent=true",
        text: "Guaranteed Issue enrollment",
      },
      {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f808076e963d98f94ed4a29b59a6571600739a0cafefc0673ad2821f3917e34a?placeholderIfAbsent=true",
        text: "Income protection for extended illnesses",
      },
    ],
  },
  std: {
    price: "$30.00/week",
    weeklyPrice: 30.00,
  },
  life: {
    price: "$3.60/week",
    weeklyPrice: 3.60,
  },
  accident: {
    price: "$11.74/week",
    weeklyPrice: 11.74,
  },
  dental: {
    price: "$34.51/week",
    weeklyPrice: 34.51,
  },
  vision: {
    price: "$9.48/week",
    weeklyPrice: 9.48,
  },
  critical: {
    price: "$15.30/week",
    weeklyPrice: 15.30,
  },
};

// Helper function to simulate API responses with some variation based on user info
const calculateAdjustedPrice = (
  baseProduct: ProductResponse,
  userInfo: UserInfo,
  productKey: string
): ProductResponse => {
  let adjustmentFactor = 1.0;
  
  // Apply some basic logic to adjust prices based on user info
  if (userInfo.age > 50 && (productKey === 'ltd' || productKey === 'std' || productKey === 'life')) {
    adjustmentFactor += 0.2; // 20% increase for older ages
  }
  
  if (userInfo.annualSalary && userInfo.annualSalary > 100000 && (productKey === 'ltd' || productKey === 'std')) {
    adjustmentFactor += 0.15; // 15% increase for higher salaries
  }
  
  if (productKey === 'dental' || productKey === 'vision') {
    // Zip code based adjustment (just a simple example)
    const zipFirstDigit = parseInt(userInfo.zipCode.charAt(0));
    adjustmentFactor += (zipFirstDigit % 5) * 0.02; // Up to 8% adjustment based on zip
  }
  
  const weeklyPrice = baseProduct.weeklyPrice ? 
    parseFloat((baseProduct.weeklyPrice * adjustmentFactor).toFixed(2)) : 0;
  
  return {
    ...baseProduct,
    price: `$${weeklyPrice.toFixed(2)}/week`,
    weeklyPrice,
  };
};

// Simulate fetching all products based on user info
export const fetchAllProducts = async (userInfo: UserInfo): Promise<InsuranceProducts> => {
  // In a real app, you would make actual API calls here
  console.log('Fetching all products with user info:', userInfo);
  
  // Add default values for coverage if not present
  const enrichedUserInfo = {
    ...userInfo,
    employeeCoverage: userInfo.employeeCoverage || 20000,
    spouseCoverage: userInfo.spouseCoverage || 10000,
    annualSalary: userInfo.annualSalary || parseInt(userInfo.income.replace(/\$|,/g, '')),
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    ltd: calculateAdjustedPrice(mockProductData.ltd, enrichedUserInfo, 'ltd'),
    std: calculateAdjustedPrice(mockProductData.std, enrichedUserInfo, 'std'),
    life: calculateAdjustedPrice(mockProductData.life, enrichedUserInfo, 'life'),
    accident: calculateAdjustedPrice(mockProductData.accident, enrichedUserInfo, 'accident'),
    dental: calculateAdjustedPrice(mockProductData.dental, enrichedUserInfo, 'dental'),
    vision: calculateAdjustedPrice(mockProductData.vision, enrichedUserInfo, 'vision'),
    critical: calculateAdjustedPrice(mockProductData.critical, enrichedUserInfo, 'critical'),
  };
};

// Fetch individual product updates based on what was changed
export const fetchProductUpdates = async (
  userInfo: UserInfo, 
  changedFields: string[]
): Promise<Partial<InsuranceProducts>> => {
  console.log('Fetching product updates for changed fields:', changedFields);
  
  const enrichedUserInfo = {
    ...userInfo,
    employeeCoverage: userInfo.employeeCoverage || 20000,
    spouseCoverage: userInfo.spouseCoverage || 10000,
    annualSalary: userInfo.annualSalary || parseInt(userInfo.income.replace(/\$|,/g, '')),
  };

  const result: Partial<InsuranceProducts> = {};
  
  // Check each product to see if it needs updating based on changed fields
  Object.entries(productConfig).forEach(([productKey, config]) => {
    const triggers = config.triggers;
    
    // Check if any of the changed fields are triggers for this product
    const needsUpdate = changedFields.some(field => triggers[field as keyof typeof triggers]);
    
    if (needsUpdate) {
      const productKeyTyped = productKey as keyof InsuranceProducts;
      if (mockProductData[productKey]) {
        result[productKeyTyped] = calculateAdjustedPrice(
          mockProductData[productKey], 
          enrichedUserInfo,
          productKey
        );
      }
    }
  });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return result;
};
