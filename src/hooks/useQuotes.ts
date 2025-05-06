import { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { 
  fetchWithToken, 
  getToken, 
  fetchToken, 
  hasExceededMaxFailures, 
  resetAuthFailureCount,
  isTokenValid,
  ensureValidToken
} from '../services/authService';
import { IndividualInfo, productConfig } from '../utils/insuranceApi';
import { DEBOUNCE_DELAY, URI_SETTINGS } from '../utils/config';
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
  const [tokenReady, setTokenReady] = useState(false);
  const [showAuthErrorModal, setShowAuthErrorModal] = useState(hasExceededMaxFailures());

  const prevAgeRef = useRef(enrichedInfo.age);
  const prevSalaryRef = useRef(enrichedInfo.annualSalary);
  const prevZipRef = useRef(enrichedInfo.zipCode);
  const prevEmployeeCoverageRef = useRef(enrichedInfo.employeeCoverage);
  const prevSpouseCoverageRef = useRef(enrichedInfo.spouseCoverage);
  const zipPrefixChangedRef = useRef(false);

  // Initialize auth and ensure we have a valid token
  useEffect(() => {
    console.log('Component mounted, checking authentication status');
    
    if (hasExceededMaxFailures()) {
      console.log('Maximum auth failures detected at startup');
      setShowAuthErrorModal(true);
      return;
    }
    
    const initializeAuth = async () => {
      try {
        // This will check if token exists and is valid
        // If not valid or doesn't exist, it will fetch a new one
        await ensureValidToken();
        setTokenReady(true);
      } catch (err) {
        console.error('Error during token initialization:', err);
        
        if (hasExceededMaxFailures()) {
          setShowAuthErrorModal(true);
          return;
        }
        
        toast.error("Failed to authenticate. Retrying...");
        setTimeout(initializeAuth, 3000);
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
    
    if (!tokenReady) {
      console.log('Token not ready yet, waiting...');
      return;
    }
    
    if (hasExceededMaxFailures()) {
      setShowAuthErrorModal(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching products:", productsToFetch);
      const requests = productsToFetch.map(async (product) => {
        const { buildUrl } = productConfig[product as keyof typeof productConfig];
        const pathname = buildUrl(individualInfo as IndividualInfo);
        
        // Always append the 'a=babrm' parameter
        let url = URI_SETTINGS.quote() + pathname;
        url += ((url.includes('?') ? '&' : '?') + 'a=babrm');

        try {
          console.log(`Fetching ${product} from URL:`, url);
          // fetchWithToken now has built-in retry logic
          const response = await fetchWithToken(url);
          console.log(`${product} response:`, response.data);
          
          const extractedQuota = extractQuota(response.data);
          console.log(`${product} extracted quota:`, extractedQuota);
          
          // Ensure we have proper price formatting
          if (extractedQuota) {
            // If we have a price value that's a number, convert it to weekly price
            if (extractedQuota.price && typeof extractedQuota.price === 'number') {
              // Divide by 4 to convert monthly to weekly
              extractedQuota.weeklyPrice = parseFloat((extractedQuota.price / 4).toFixed(2));
              extractedQuota.price = `$${extractedQuota.weeklyPrice.toFixed(2)}/week`;
            } 
            // If we have a weeklyPrice but no formatted price
            else if (!extractedQuota.price && extractedQuota.weeklyPrice) {
              // Ensure weeklyPrice is divided by 4 to convert monthly to weekly
              extractedQuota.weeklyPrice = parseFloat((extractedQuota.weeklyPrice / 4).toFixed(2));
              extractedQuota.price = `$${extractedQuota.weeklyPrice.toFixed(2)}/week`;
            }
            
            // Make sure weeklyPrice is a number if it exists
            if (extractedQuota.weeklyPrice && typeof extractedQuota.weeklyPrice === 'string') {
              extractedQuota.weeklyPrice = parseFloat(extractedQuota.weeklyPrice.replace(/[^\d.]/g, '')) / 4;
            }
          }
          
          return { product, data: extractedQuota };
        } catch (err) {
          if (err instanceof Error && err.message === 'MAX_AUTH_FAILURES_EXCEEDED') {
            setShowAuthErrorModal(true);
            throw err;
          }
          
          console.warn(`Error fetching ${product} after multiple retries:`, err);
          toast.error(`Failed to fetch ${product} quote after multiple attempts.`);
          return { product, data: null };
        }
      });

      const promiseResults = await Promise.allSettled(requests);
      let hasFailures = false;
      
      console.log("All products fetch results:", promiseResults);
      
      setQuotes(prev => {
        const updated = { ...prev };
        for (const result of promiseResults) {
          if (result.status === 'fulfilled') {
            updated[result.value.product as keyof ProductQuotes] = result.value.data;
          } else {
            hasFailures = true;
          }
        }
        
        console.log("Updated quotes:", updated);
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
        toast.error("Failed to fetch quotes after multiple retries. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [inputError, tokenReady]);

  const debouncedFetchProducts = useCallback(
    debounce((productsToFetch, values) => {
      return fetchProducts(productsToFetch, values);
    }, DEBOUNCE_DELAY),
    [fetchProducts]
  );

  useEffect(() => {
    const fetchAllProductsOnMount = async () => {
      if (!initialFetchComplete && !inputError && tokenReady) {
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
  }, [fetchProducts, enrichedInfo, initialFetchComplete, inputError, tokenReady]);

  useEffect(() => {
    const changedAge = enrichedInfo.age !== prevAgeRef.current;
    const changedSalary = enrichedInfo.annualSalary !== prevSalaryRef.current;
    const changedZip = enrichedInfo.zipCode !== prevZipRef.current && (
      (individualInfo.zipPrefixChanged !== undefined 
        ? individualInfo.zipPrefixChanged 
        : true)
    );
    
    if (individualInfo.zipPrefixChanged !== undefined) {
      zipPrefixChangedRef.current = individualInfo.zipPrefixChanged;
    }
    
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

    if (productsToFetch.length > 0 && tokenReady) {
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
    enrichedInfo.employeeCoverage, enrichedInfo.spouseCoverage, debouncedFetchProducts, quotes.accident, 
    individualInfo.zipPrefixChanged, tokenReady]);

  return {
    quotes,
    loading,
    error,
    showAuthErrorModal,
    handleCloseAuthErrorModal
  };
}
