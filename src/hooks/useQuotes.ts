
import { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { fetchWithToken, getToken, fetchToken } from '../services/authService';
import { IndividualInfo, productConfig } from '../utils/insuranceApi';
import { BABRM, DEBOUNCE_DELAY, URI_SETTINGS, isDistributor, isServerCalculations } from '../utils/config';

interface ProductQuotes {
  ltd: any | null;
  std: any | null;
  life: any | null;
  accident: any | null;
  dental: any | null;
  vision: any | null;
  critical: any | null;
}

// Define a proper interface for the triggers
interface ProductTriggers {
  age?: boolean;
  annualSalary?: boolean;
  zipCode?: boolean;
  employeeCoverage?: boolean;
  spouseCoverage?: boolean;
}

/**
 * Hook for managing insurance quotes
 * Fetches and updates quotes based on changes to user information
 */
export function useQuotes(individualInfo: IndividualInfo, inputError: string) {
  // We'll store results for each product in an object:
  const [quotes, setQuotes] = useState<ProductQuotes>({
    ltd: null,
    std: null,
    life: null,
    accident: null,
    dental: null,
    vision: null,
    critical: null,
  });

  // Track loading state—optional if you want partial loading per product
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We'll store old values of age, salary, zipCode
  const prevAgeRef = useRef(individualInfo.age);
  const prevSalaryRef = useRef(individualInfo.annualSalary);
  const prevZipRef = useRef(individualInfo.zipCode);
  const prevEmployeeCoverageRef = useRef(individualInfo.employeeCoverage);
  const prevSpouseCoverageRef = useRef(individualInfo.spouseCoverage);

  // On mount, ensure we have a token
  useEffect(() => {
    if (!isServerCalculations()) {
      return;
    }
    // else
    if (!getToken()) {
      fetchToken().catch(err => {
        console.error('Error fetching initial token:', err);
      });
    }
  }, []);

  // The main function to fetch quotes for a set of products
  const fetchProducts = useCallback(async (productsToFetch: string[], individualInfo: Partial<IndividualInfo>) => {
    if (inputError) {
      return;
    }
    // else
    setLoading(true);
    setError(null);
    try {
      // We'll do all requests in parallel
      const requests = productsToFetch.map(async (product) => {
        const { buildUrl } = productConfig[product as keyof typeof productConfig];
        const pathname = buildUrl(individualInfo as IndividualInfo);
        let url = URI_SETTINGS.quote() + pathname;
        
        if (isDistributor(BABRM)) {
          url += ((url.includes('?') ? '&' : '?') + 'a=babrm');
        }

        let response;
        try {
          response = await fetchWithToken(url);
          console.log('response', response, 'product', product);
          return { product, data: response.data };
        } catch {
          console.warn(`Unexpected status for ${product}:`, response?.status);
          return { product, data: null };
        }
      });

      const results = await Promise.allSettled(requests);

      setQuotes(prev => {
        const updated = { ...prev };
        for (const productResult of results) {
          if (productResult.status === 'rejected') {
            updated[productResult.reason.product as keyof ProductQuotes] = productResult.reason.data;
          } else {
            updated[productResult.value.product as keyof ProductQuotes] = productResult.value.data;
          }
        }
        return updated;
      });
    } catch (err) {
      console.error('Error fetching product quotes:', err);
      if (err instanceof Error) {
        setError(err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }, [inputError]);

  // Debounced version of fetchProducts
  const debouncedFetchProducts = useCallback(
    debounce((productsToFetch, values) => {
      return fetchProducts(productsToFetch, values);
    }, DEBOUNCE_DELAY),
    [fetchProducts]
  );

  // The effect that checks what changed
  useEffect(() => {
    if (!isServerCalculations()) {
      return;
    }
    const changedAge = individualInfo.age !== prevAgeRef.current;
    const changedSalary = individualInfo.annualSalary !== prevSalaryRef.current;
    const changedZip = individualInfo.zipCode !== prevZipRef.current;
    const changedEmployeeCoverage = individualInfo.employeeCoverage !== prevEmployeeCoverageRef.current;
    const changedSpouseCoverage = individualInfo.spouseCoverage !== prevSpouseCoverageRef.current;

    const productsToFetch: string[] = [];

    // For each product, check if any triggers changed
    for (const product of Object.keys(productConfig)) {
      const triggers = productConfig[product as keyof typeof productConfig].triggers as ProductTriggers;
      
      // Check if any of the triggers match the changed fields
      let needsFetch = false;
      
      if (triggers.age && changedAge) needsFetch = true;
      if (triggers.annualSalary && changedSalary) needsFetch = true;
      if (triggers.zipCode && changedZip) needsFetch = true;
      if (triggers.employeeCoverage && changedEmployeeCoverage) needsFetch = true;
      if (triggers.spouseCoverage && changedSpouseCoverage) needsFetch = true;

      if (needsFetch) {
        // Skip 'accident' if we've already fetched it
        if (product === 'accident' && quotes.accident !== null) {
          // Do nothing
          // accident should be fetched only once, because it doesn't have any dependencies
        }
        // Skip 'std' if there's no salary info
        else if (product === 'std' && individualInfo.annualSalary && individualInfo.annualSalary <= 0) { 
          // Do nothing
        } 
        else {
          productsToFetch.push(product);
        }
      }
    }

    if (productsToFetch.length > 0) {
      debouncedFetchProducts(productsToFetch, {
        age: individualInfo.age,
        annualSalary: individualInfo.annualSalary,
        zipCode: individualInfo.zipCode,
        employeeCoverage: individualInfo.employeeCoverage,
        spouseCoverage: individualInfo.spouseCoverage,
      });
    }

    prevAgeRef.current = individualInfo.age;
    prevSalaryRef.current = individualInfo.annualSalary;
    prevZipRef.current = individualInfo.zipCode;
    prevEmployeeCoverageRef.current = individualInfo.employeeCoverage;
    prevSpouseCoverageRef.current = individualInfo.spouseCoverage;

    // Cleanup to avoid memory leaks
    return () => {
      // debouncedFetchProducts.cancel();
    };
  }, [individualInfo.age, individualInfo.annualSalary, individualInfo.zipCode, 
    individualInfo.employeeCoverage, individualInfo.spouseCoverage, debouncedFetchProducts, quotes.accident]);

  return {
    quotes,
    loading,
    error
  };
}
