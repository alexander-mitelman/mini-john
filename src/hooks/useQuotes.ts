import { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { fetchWithToken, getToken, fetchToken, clearToken } from '../services/authService';
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
  const enrichedInfo = {
    ...individualInfo,
    annualSalary: individualInfo.annualSalary || 
      (individualInfo.income ? parseInt(individualInfo.income.replace(/\$|,/g, '')) : 0),
    employeeCoverage: individualInfo.employeeCoverage || 20000,
    spouseCoverage: individualInfo.spouseCoverage || 10000,
  };

  const [quotes, setQuotes] = useState<ProductQuotes>({
    ltd: null,
    std: null,
    life: null,
    accident: null,
    dental: null,
    vision: null,
    critical: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prevAgeRef = useRef(enrichedInfo.age);
  const prevSalaryRef = useRef(enrichedInfo.annualSalary);
  const prevZipRef = useRef(enrichedInfo.zipCode);
  const prevEmployeeCoverageRef = useRef(enrichedInfo.employeeCoverage);
  const prevSpouseCoverageRef = useRef(enrichedInfo.spouseCoverage);

  useEffect(() => {
    if (!isServerCalculations()) {
      console.log('Server calculations disabled, skipping token fetch');
      return;
    }
    
    console.log('Component mounted, checking authentication status');
    
    clearToken();
    
    if (!getToken()) {
      console.log('No token found, initiating token fetch');
      fetchToken().catch(err => {
        console.error('Error fetching initial token:', err);
      });
    } else {
      console.log('Token already exists in localStorage');
    }
  }, []);

  const fetchProducts = useCallback(async (productsToFetch: string[], individualInfo: Partial<IndividualInfo>) => {
    if (inputError) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
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

  const debouncedFetchProducts = useCallback(
    debounce((productsToFetch, values) => {
      return fetchProducts(productsToFetch, values);
    }, DEBOUNCE_DELAY),
    [fetchProducts]
  );

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

    for (const product of Object.keys(productConfig)) {
      const triggers = productConfig[product as keyof typeof productConfig].triggers as ProductTriggers;
      
      let needsFetch = false;
      
      if (triggers.age && changedAge) needsFetch = true;
      if (triggers.annualSalary && changedSalary) needsFetch = true;
      if (triggers.zipCode && changedZip) needsFetch = true;
      if (triggers.employeeCoverage && changedEmployeeCoverage) needsFetch = true;
      if (triggers.spouseCoverage && changedSpouseCoverage) needsFetch = true;

      if (needsFetch) {
        if (product === 'accident' && quotes.accident !== null) {
          continue;
        }
        else if (product === 'std' && enrichedInfo.annualSalary && enrichedInfo.annualSalary <= 0) { 
          continue;
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
