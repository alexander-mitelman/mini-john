
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
  // Ensure annualSalary is derived from income if needed
  const enrichedInfo = {
    ...individualInfo,
    // Convert income string to annualSalary number if annualSalary is missing
    annualSalary: individualInfo.annualSalary || 
      (individualInfo.income ? parseInt(individualInfo.income.replace(/\$|,/g, '')) : 0),
    // Ensure default values for coverage
    employeeCoverage: individualInfo.employeeCoverage || 20000,
    spouseCoverage: individualInfo.spouseCoverage || 10000,
  };

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
  const prevAgeRef = useRef(enrichedInfo.age);
  const prevSalaryRef = useRef(enrichedInfo.annualSalary);
  const prevZipRef = useRef(enrichedInfo.zipCode);
  const prevEmployeeCoverageRef = useRef(enrichedInfo.employeeCoverage);
  const prevSpouseCoverageRef = useRef(enrichedInfo.spouseCoverage);

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
    const changedAge = enrichedInfo.age !== prevAgeRef.current;
    const changedSalary = enrichedInfo.annualSalary !== prevSalaryRef.current;
    const changedZip = enrichedInfo.zipCode !== prevZipRef.current;
    const changedEmployeeCoverage = enrichedInfo.employeeCoverage !== prevEmployeeCoverageRef.current;
    const changedSpouseCoverage = enrichedInfo.spouseCoverage !== prevSpouseCoverageRef.current;

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
        else if (product === 'std' && enrichedInfo.annualSalary && enrichedInfo.annualSalary <= 0) { 
          // Do nothing
        } 
        else {
          productsToFetch.push(product);
        }
      }
    }

    if (productsToFetch.length > 0) {
      debouncedFetchProducts(productsToFetch, {
        age: enrichedInfo.age,
        annualSalary: enrichedInfo.annualSalary,
        zipCode: enrichedInfo.zipCode,
        employeeCoverage: enrichedInfo.employeeCoverage,
        spouseCoverage: enrichedInfo.spouseCoverage,
      });
    }

    prevAgeRef.current = enrichedInfo.age;
    prevSalaryRef.current = enrichedInfo.annualSalary;
    prevZipRef.current = enrichedInfo.zipCode;
    prevEmployeeCoverageRef.current = enrichedInfo.employeeCoverage;
    prevSpouseCoverageRef.current = enrichedInfo.spouseCoverage;

    // Cleanup to avoid memory leaks
    return () => {
      // debouncedFetchProducts.cancel();
    };
  }, [enrichedInfo.age, enrichedInfo.annualSalary, enrichedInfo.zipCode, 
    enrichedInfo.employeeCoverage, enrichedInfo.spouseCoverage, debouncedFetchProducts, quotes.accident]);

  return {
    quotes,
    loading,
    error
  };
}
