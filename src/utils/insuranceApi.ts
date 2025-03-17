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
        icon: `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1426_15574)">
<path d="M4.79162 6.89995C4.79162 6.34079 5.01375 5.80453 5.40914 5.40914C5.80453 5.01375 6.34079 4.79162 6.89995 4.79162H7.85829C8.41498 4.7913 8.94896 4.57082 9.3437 4.17829L10.0145 3.50745C10.2105 3.31042 10.4434 3.15406 10.7 3.04736C10.9565 2.94067 11.2317 2.88574 11.5095 2.88574C11.7874 2.88574 12.0625 2.94067 12.3191 3.04736C12.5757 3.15406 12.8086 3.31042 13.0045 3.50745L13.6754 4.17829C14.0702 4.5712 14.605 4.79162 15.1608 4.79162H16.1191C16.6783 4.79162 17.2145 5.01375 17.6099 5.40914C18.0053 5.80453 18.2275 6.34079 18.2275 6.89995V7.85829C18.2275 8.41412 18.4479 8.94887 18.8408 9.3437L19.5116 10.0145C19.7087 10.2105 19.865 10.4434 19.9717 10.7C20.0784 10.9565 20.1333 11.2317 20.1333 11.5095C20.1333 11.7874 20.0784 12.0625 19.9717 12.3191C19.865 12.5757 19.7087 12.8086 19.5116 13.0045L18.8408 13.6754C18.4483 14.0701 18.2278 14.6041 18.2275 15.1608V16.1191C18.2275 16.6783 18.0053 17.2145 17.6099 17.6099C17.2145 18.0053 16.6783 18.2275 16.1191 18.2275H15.1608C14.6041 18.2278 14.0701 18.4483 13.6754 18.8408L13.0045 19.5116C12.8086 19.7087 12.5757 19.865 12.3191 19.9717C12.0625 20.0784 11.7874 20.1333 11.5095 20.1333C11.2317 20.1333 10.9565 20.0784 10.7 19.9717C10.4434 19.865 10.2105 19.7087 10.0145 19.5116L9.3437 18.8408C8.94896 18.4483 8.41498 18.2278 7.85829 18.2275H6.89995C6.34079 18.2275 5.80453 18.0053 5.40914 17.6099C5.01375 17.2145 4.79162 16.6783 4.79162 16.1191V15.1608C4.7913 14.6041 4.57082 14.0701 4.17829 13.6754L3.50745 13.0045C3.31042 12.8086 3.15406 12.5757 3.04736 12.3191C2.94067 12.0625 2.88574 11.7874 2.88574 11.5095C2.88574 11.2317 2.94067 10.9565 3.04736 10.7C3.15406 10.4434 3.31042 10.2105 3.50745 10.0145L4.17829 9.3437C4.57082 8.94896 4.7913 8.41498 4.79162 7.85829V6.89995Z" fill="#4353FF"/>
<path d="M8.625 11.5L10.5417 13.4167L14.375 9.58337" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1426_15574">
<rect width="23" height="23" fill="white"/>
</clipPath>
</defs>
</svg>`,
        text: "Up to $10,000 monthly benefit",
      },
      {
        icon: `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1426_15574)">
<path d="M4.79162 6.89995C4.79162 6.34079 5.01375 5.80453 5.40914 5.40914C5.80453 5.01375 6.34079 4.79162 6.89995 4.79162H7.85829C8.41498 4.7913 8.94896 4.57082 9.3437 4.17829L10.0145 3.50745C10.2105 3.31042 10.4434 3.15406 10.7 3.04736C10.9565 2.94067 11.2317 2.88574 11.5095 2.88574C11.7874 2.88574 12.0625 2.94067 12.3191 3.04736C12.5757 3.15406 12.8086 3.31042 13.0045 3.50745L13.6754 4.17829C14.0702 4.5712 14.605 4.79162 15.1608 4.79162H16.1191C16.6783 4.79162 17.2145 5.01375 17.6099 5.40914C18.0053 5.80453 18.2275 6.34079 18.2275 6.89995V7.85829C18.2275 8.41412 18.4479 8.94887 18.8408 9.3437L19.5116 10.0145C19.7087 10.2105 19.865 10.4434 19.9717 10.7C20.0784 10.9565 20.1333 11.2317 20.1333 11.5095C20.1333 11.7874 20.0784 12.0625 19.9717 12.3191C19.865 12.5757 19.7087 12.8086 19.5116 13.0045L18.8408 13.6754C18.4483 14.0701 18.2278 14.6041 18.2275 15.1608V16.1191C18.2275 16.6783 18.0053 17.2145 17.6099 17.6099C17.2145 18.0053 16.6783 18.2275 16.1191 18.2275H15.1608C14.6041 18.2278 14.0701 18.4483 13.6754 18.8408L13.0045 19.5116C12.8086 19.7087 12.5757 19.865 12.3191 19.9717C12.0625 20.0784 11.7874 20.1333 11.5095 20.1333C11.2317 20.1333 10.9565 20.0784 10.7 19.9717C10.4434 19.865 10.2105 19.7087 10.0145 19.5116L9.3437 18.8408C8.94896 18.4483 8.41498 18.2278 7.85829 18.2275H6.89995C6.34079 18.2275 5.80453 18.0053 5.40914 17.6099C5.01375 17.2145 4.79162 16.6783 4.79162 16.1191V15.1608C4.7913 14.6041 4.57082 14.0701 4.17829 13.6754L3.50745 13.0045C3.31042 12.8086 3.15406 12.5757 3.04736 12.3191C2.94067 12.0625 2.88574 11.7874 2.88574 11.5095C2.88574 11.2317 2.94067 10.9565 3.04736 10.7C3.15406 10.4434 3.31042 10.2105 3.50745 10.0145L4.17829 9.3437C4.57082 8.94896 4.7913 8.41498 4.79162 7.85829V6.89995Z" fill="#4353FF"/>
<path d="M8.625 11.5L10.5417 13.4167L14.375 9.58337" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1426_15574">
<rect width="23" height="23" fill="white"/>
</clipPath>
</defs>
</svg>`,
        text: "Benefit paid up to normal retirement age",
      },
      {
        icon: `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1426_15574)">
<path d="M4.79162 6.89995C4.79162 6.34079 5.01375 5.80453 5.40914 5.40914C5.80453 5.01375 6.34079 4.79162 6.89995 4.79162H7.85829C8.41498 4.7913 8.94896 4.57082 9.3437 4.17829L10.0145 3.50745C10.2105 3.31042 10.4434 3.15406 10.7 3.04736C10.9565 2.94067 11.2317 2.88574 11.5095 2.88574C11.7874 2.88574 12.0625 2.94067 12.3191 3.04736C12.5757 3.15406 12.8086 3.31042 13.0045 3.50745L13.6754 4.17829C14.0702 4.5712 14.605 4.79162 15.1608 4.79162H16.1191C16.6783 4.79162 17.2145 5.01375 17.6099 5.40914C18.0053 5.80453 18.2275 6.34079 18.2275 6.89995V7.85829C18.2275 8.41412 18.4479 8.94887 18.8408 9.3437L19.5116 10.0145C19.7087 10.2105 19.865 10.4434 19.9717 10.7C20.0784 10.9565 20.1333 11.2317 20.1333 11.5095C20.1333 11.7874 20.0784 12.0625 19.9717 12.3191C19.865 12.5757 19.7087 12.8086 19.5116 13.0045L18.8408 13.6754C18.4483 14.0701 18.2278 14.6041 18.2275 15.1608V16.1191C18.2275 16.6783 18.0053 17.2145 17.6099 17.6099C17.2145 18.0053 16.6783 18.2275 16.1191 18.2275H15.1608C14.6041 18.2278 14.0701 18.4483 13.6754 18.8408L13.0045 19.5116C12.8086 19.7087 12.5757 19.865 12.3191 19.9717C12.0625 20.0784 11.7874 20.1333 11.5095 20.1333C11.2317 20.1333 10.9565 20.0784 10.7 19.9717C10.4434 19.865 10.2105 19.7087 10.0145 19.5116L9.3437 18.8408C8.94896 18.4483 8.41498 18.2278 7.85829 18.2275H6.89995C6.34079 18.2275 5.80453 18.0053 5.40914 17.6099C5.01375 17.2145 4.79162 16.6783 4.79162 16.1191V15.1608C4.7913 14.6041 4.57082 14.0701 4.17829 13.6754L3.50745 13.0045C3.31042 12.8086 3.15406 12.5757 3.04736 12.3191C2.94067 12.0625 2.88574 11.7874 2.88574 11.5095C2.88574 11.2317 2.94067 10.9565 3.04736 10.7C3.15406 10.4434 3.31042 10.2105 3.50745 10.0145L4.17829 9.3437C4.57082 8.94896 4.7913 8.41498 4.79162 7.85829V6.89995Z" fill="#4353FF"/>
<path d="M8.625 11.5L10.5417 13.4167L14.375 9.58337" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1426_15574">
<rect width="23" height="23" fill="white"/>
</clipPath>
</defs>
</svg>`,
        text: "Guaranteed Issue enrollment",
      },
      {
        icon: `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1426_15574)">
<path d="M4.79162 6.89995C4.79162 6.34079 5.01375 5.80453 5.40914 5.40914C5.80453 5.01375 6.34079 4.79162 6.89995 4.79162H7.85829C8.41498 4.7913 8.94896 4.57082 9.3437 4.17829L10.0145 3.50745C10.2105 3.31042 10.4434 3.15406 10.7 3.04736C10.9565 2.94067 11.2317 2.88574 11.5095 2.88574C11.7874 2.88574 12.0625 2.94067 12.3191 3.04736C12.5757 3.15406 12.8086 3.31042 13.0045 3.50745L13.6754 4.17829C14.0702 4.5712 14.605 4.79162 15.1608 4.79162H16.1191C16.6783 4.79162 17.2145 5.01375 17.6099 5.40914C18.0053 5.80453 18.2275 6.34079 18.2275 6.89995V7.85829C18.2275 8.41412 18.4479 8.94887 18.8408 9.3437L19.5116 10.0145C19.7087 10.2105 19.865 10.4434 19.9717 10.7C20.0784 10.9565 20.1333 11.2317 20.1333 11.5095C20.1333 11.7874 20.0784 12.0625 19.9717 12.3191C19.865 12.5757 19.7087 12.8086 19.5116 13.0045L18.8408 13.6754C18.4483 14.0701 18.2278 14.6041 18.2275 15.1608V16.1191C18.2275 16.6783 18.0053 17.2145 17.6099 17.6099C17.2145 18.0053 16.6783 18.2275 16.1191 18.2275H15.1608C14.6041 18.2278 14.0701 18.4483 13.6754 18.8408L13.0045 19.5116C12.8086 19.7087 12.5757 19.865 12.3191 19.9717C12.0625 20.0784 11.7874 20.1333 11.5095 20.1333C11.2317 20.1333 10.9565 20.0784 10.7 19.9717C10.4434 19.865 10.2105 19.7087 10.0145 19.5116L9.3437 18.8408C8.94896 18.4483 8.41498 18.2278 7.85829 18.2275H6.89995C6.34079 18.2275 5.80453 18.0053 5.40914 17.6099C5.01375 17.2145 4.79162 16.6783 4.79162 16.1191V15.1608C4.7913 14.6041 4.57082 14.0701 4.17829 13.6754L3.50745 13.0045C3.31042 12.8086 3.15406 12.5757 3.04736 12.3191C2.94067 12.0625 2.88574 11.7874 2.88574 11.5095C2.88574 11.2317 2.94067 10.9565 3.04736 10.7C3.15406 10.4434 3.31042 10.2105 3.50745 10.0145L4.17829 9.3437C4.57082 8.94896 4.7913 8.41498 4.79162 7.85829V6.89995Z" fill="#4353FF"/>
<path d="M8.625 11.5L10.5417 13.4167L14.375 9.58337" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1426_15574">
<rect width="23" height="23" fill="white"/>
</clipPath>
</defs>
</svg>`,
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
  
  // Calculate the monthly price and then divide by 4 to get weekly price
  const monthlyPrice = baseProduct.weeklyPrice ? 
    parseFloat((baseProduct.weeklyPrice * adjustmentFactor).toFixed(2)) : 0;
  
  // Convert to weekly price (monthly price divided by 4)
  const weeklyPrice = parseFloat((monthlyPrice / 4).toFixed(2));
  
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

