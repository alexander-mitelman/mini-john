import { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { 
  fetchWithToken, 
  getToken, 
  fetchToken, 
  hasExceededMaxFailures, 
  resetAuthFailureCount 
} from '../services/authService';
import { IndividualInfo, productConfig } from '../utils/insuranceApi';
import { BABRM, DEBOUNCE_DELAY, URI_SETTINGS, isDistributor } from '../utils/config';
import { toast } from 'sonner';
import { extractQuota } from '../utils/quoteExtractor';
import AuthErrorModal from '../components/AuthErrorModal';

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
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  const [tokenInitialized, setTokenInitialized] = useState(!!getToken());
  const [showAuthErrorModal, setShowAuthErrorModal] = useState(hasExceededMaxFailures());

  const prevAgeRef = useRef(enrichedInfo.age);
  const prevSalaryRef = useRef(enrichedInfo.annualSalary);
  const prevZipRef = useRef(enrichedInfo.zipCode);
  const prevEmployeeCoverageRef = useRef(enrichedInfo.employeeCoverage);
  const prevSpouseCoverageRef = useRef(enrichedInfo.spouseCoverage);

  useEffect(() => {
    console.log('Component mounted, checking authentication status');
    
    if (hasExceededMaxFailures()) {
      console.log('Maximum auth failures detected at startup');
      setShowAuthErrorModal(true);
      return;
    }
    
    const initializeAuth = async () => {
      if (!getToken()) {
        console.log('No token found, initiating token fetch');
        try {
          await fetchToken();
          setTokenInitialized(true);
        } catch (err) {
          console.error('Error fetching initial token:', err);
          
          if (hasExceededMaxFailures()) {
            setShowAuthErrorModal(true);
            return;
          }
          
          toast.error("Failed to authenticate. Retrying...");
          setTimeout(initializeAuth, 3000);
        }
      } else {
        console.log('Token already exists in localStorage');
        setTokenInitialized(true);
      }
    };
    
    initializeAuth();
  }, []);

  useEffect(() => {
    if (hasExceededMaxFailures() && !showAuthErrorModal) {
      setShowAuthErrorModal(true);
    }
  }, [showAuthErrorModal]);

  const handleCloseAuthErrorModal = useCallback(() => {
    setShowAuthErrorModal(false);
    resetAuthFailureCount();
  }, []);

  const fetchProducts = useCallback(async (productsToFetch: string[], individualInfo: Partial<IndividualInfo>) => {
    if (inputError) {
      return;
    }
    
    if (!tokenInitialized) {
      console.log('Token not initialized yet, waiting...');
      return;
    }
    
    if (hasExceededMaxFailures()) {
      setShowAuthErrorModal(true);
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

        try {
          const response = await fetchWithToken(url);
          console.log('response', response, 'product', product);
          
          const extractedQuota = extractQuota(response.data);
          
          return { product, data: extractedQuota };
        } catch (err) {
          if (err instanceof Error && err.message === 'MAX_AUTH_FAILURES_EXCEEDED') {
            setShowAuthErrorModal(true);
            throw err;
          }
          
          console.warn(`Error fetching ${product}:`, err);
          toast.error(`Failed to fetch ${product} quote. Please try again.`);
          return { product, data: null };
        }
      });

      let hasFailures = false;
      setQuotes(prev => {
        const updated = { ...prev };
        for (const result of results) {
          if (result.status === 'fulfilled') {
            updated[result.value.product as keyof ProductQuotes] = result.value.data;
          } else {
            hasFailures = true;
          }
        }
        return updated;
      });
      
      if (hasFailures) {
        setError('Some quotes failed to load. Please try again later.');
      }
    } catch (err) {
      console.error('Error fetching product quotes:', err);
      
      if (err instanceof Error && err.message === 'MAX_AUTH_FAILURES_EXCEEDED') {
        return;
      }
      
      if (err instanceof Error) {
        setError(err.message || 'Unknown error');
        toast.error("Failed to fetch quotes. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [inputError, tokenInitialized]);

  const debouncedFetchProducts = useCallback(
    debounce((productsToFetch, values) => {
      return fetchProducts(productsToFetch, values);
    }, DEBOUNCE_DELAY),
    [fetchProducts]
  );

  useEffect(() => {
    const fetchAllProductsOnMount = async () => {
      if (!initialFetchComplete && !inputError && tokenInitialized) {
        console.log('Performing initial fetch of all products');
        const allProducts = Object.keys(productConfig);
        
        try {
          await fetchProducts(allProducts, enrichedInfo);
          setInitialFetchComplete(true);
        } catch (err) {
          console.error('Error during initial fetch:', err);
          setTimeout(() => {
            if (!initialFetchComplete) {
              fetchAllProductsOnMount();
            }
          }, 5000);
        }
      }
    };
    
    fetchAllProductsOnMount();
  }, [fetchProducts, enrichedInfo, initialFetchComplete, inputError, tokenInitialized]);

  useEffect(() => {
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

    if (productsToFetch.length > 0 && tokenInitialized) {
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
    enrichedInfo.employeeCoverage, enrichedInfo.spouseCoverage, debouncedFetchProducts, quotes.accident, tokenInitialized]);

  return {
    quotes,
    loading,
    error,
    showAuthErrorModal,
    handleCloseAuthErrorModal
  };
}
