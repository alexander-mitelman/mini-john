
import { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { 
  fetchWithToken, 
  getToken, 
  fetchToken, 
  hasExceededMaxFailures, 
  resetAuthFailureCount,
  isTokenValid,
  isServerCalculations
} from '../services/authService';
import { IndividualInfo, productConfig } from '../utils/insuranceApi';
import { BABRM, DEBOUNCE_DELAY, URI_SETTINGS, isDistributor } from '../utils/config';
import { toast } from 'sonner';
import { extractQuota } from '../utils/quoteExtractor';
import AuthErrorModal from '../components/AuthErrorModal';

type ParsedUrlParams = {
  zipCode?: string;
  age?: number;
  annualSalary?: number;
};

interface Quotes {
  ltd: any | null;
  std: any | null;
  life: any | null;
  accident: any | null;
  dental: any | null;
  vision: any | null;
  critical: any | null;
  hospital: any | null;
  tele: any | null;
  identity: any | null;
}

function isStaticData(quotes: Quotes, product: keyof typeof productConfig) {
  return (
    (product === 'accident' && quotes.accident !== null)
  );
}

/**
 * Hook for managing insurance quotes
 * Fetches and updates quotes based on changes to user information
 */
export function useQuotes(individualInfo: IndividualInfo, urlParams: ParsedUrlParams, inputError: string) {

  // We'll store results for each product in an object:
  const [quotes, setQuotes] = useState<Quotes>({
    ltd: null,
    std: null,
    life: null,
    accident: null,
    dental: null,
    vision: null,
    critical: null,
    hospital: null,
    tele: null,
    identity: null,
  });

  // Track loading state—optional if you want partial loading per product
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenReady, setTokenReady] = useState(false);
  const [showAuthErrorModal, setShowAuthErrorModal] = useState(hasExceededMaxFailures());

  // We'll store old values of age, salary, zipCode
  const prevAgeRef = useRef(individualInfo.age);
  const prevSalaryRef = useRef(individualInfo.annualSalary);
  const prevZipRef = useRef(individualInfo.zipCode);
  const prevEmployeeCoverageRef = useRef(individualInfo.employeeCoverage);
  const prevSpouseCoverageRef = useRef(individualInfo.spouseCoverage);

  const handleCloseAuthErrorModal = useCallback(() => {
    setShowAuthErrorModal(false);
    resetAuthFailureCount();
  }, []);

  const init = useCallback(() => {
    const productsToFetch = [] as string[];
  
    // For each product, check if any triggers changed
    for (const product of Object.keys(productConfig)) {
      const triggers = productConfig[product as keyof typeof productConfig].triggers;
  
      let needsFetch = false;
      if (triggers && triggers.age && urlParams.age && urlParams.age > 0) needsFetch = true;
      if (triggers && triggers.annualSalary && urlParams.annualSalary && urlParams.annualSalary > 0) needsFetch = true;
      if (triggers && triggers.zipCode && urlParams.zipCode) needsFetch = true;

      if (!needsFetch) {
        continue;
      }
  
      productsToFetch.push(product);
    }
  
    if (productsToFetch.length <= 0) { 
      return;
    }

    return fetchProducts(productsToFetch, {
      age: individualInfo.age,
      annualSalary: individualInfo.annualSalary,
      zipCode: individualInfo.zipCode,
      employeeCoverage: individualInfo.employeeCoverage,
      spouseCoverage: individualInfo.spouseCoverage,
    });
  }, [individualInfo, urlParams, fetchProducts]);

  // Effect 1: Ensure token is valid
  useEffect(() => {
    if (!isServerCalculations()) return;

    async function ensureToken() {
      if (!isTokenValid()) {
        try {
          await fetchToken();
        } catch (err) {
          console.error('Error fetching initial token:', err);
          
          if (hasExceededMaxFailures()) {
            setShowAuthErrorModal(true);
            return;
          }
          
          toast.error("Failed to authenticate. Retrying...");
          setTimeout(ensureToken, 3000);
        }
      }
      setTokenReady(true);
    }

    ensureToken();
  }, []);

  useEffect(() => {
    if (hasExceededMaxFailures() && !showAuthErrorModal) {
      setShowAuthErrorModal(true);
    }
  }, [showAuthErrorModal]);

  // Effect 2: Run quote fetching only when token is ready
  useEffect(() => {
    if (!isServerCalculations() || !tokenReady) return;

    init();
  }, [tokenReady, init]);

  // The main function to fetch quotes for a set of products
  const fetchProducts = useCallback(async (productsToFetch: string[], individualInfo: Partial<IndividualInfo>) => {
    if (inputError) {
      return;
    }
    
    if (!tokenReady) {
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
      // We'll do all requests in parallel
      const requests = productsToFetch.map(async (product) => {
        const { buildUrl } = productConfig[product as keyof typeof productConfig];
        const pathname = buildUrl(individualInfo as IndividualInfo);
        let url = URI_SETTINGS.quote() + pathname;
        url += ((url.includes('?') ? '&' : '?') + 'a=babrm');

        try {
          console.log(`Fetching ${product} from URL:`, url);
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
          
          console.warn(`Error fetching ${product}:`, err);
          toast.error(`Failed to fetch ${product} quote. Please try again.`);
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
            updated[result.value.product as keyof Quotes] = result.value.data;
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
        toast.error("Failed to fetch quotes. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [inputError, tokenReady]);

  // Debounced version of fetchProducts
  const debouncedFetchProducts = useCallback(
    debounce((productsToFetch, values) => {
      return fetchProducts(productsToFetch, values);
    }, DEBOUNCE_DELAY),
    [fetchProducts]
  );

  // The effect that checks what changed
  useEffect(() => {
    if (!isServerCalculations() || !tokenReady) {
      return;
    }

    const changedAge = individualInfo.age !== prevAgeRef.current;
    const changedSalary = individualInfo.annualSalary !== prevSalaryRef.current;
    const changedZip = individualInfo.zipCode.slice(0,3) !== prevZipRef.current.slice(0,3);
    const changedEmployeeCoverage = individualInfo.employeeCoverage !== prevEmployeeCoverageRef.current;
    const changedSpouseCoverage = individualInfo.spouseCoverage !== prevSpouseCoverageRef.current;

    const productsToFetch = [] as string[];

    // For each product, check if any triggers changed
    for (const product of Object.keys(productConfig)) {
      const triggers = productConfig[product as keyof typeof productConfig].triggers;
      // If triggers.age is true and changedAge is true -> fetch
      // If triggers.salary is true and changedSalary is true -> fetch
      // If triggers.zipCode is true and changedZip is true -> fetch
      // and etc...

      let needsFetch = false;
      if (triggers && triggers.age && changedAge) needsFetch = true;
      if (triggers && triggers.annualSalary && changedSalary) needsFetch = true;
      if (triggers && triggers.zipCode && changedZip) needsFetch = true;
      if (triggers && triggers.employeeCoverage && changedEmployeeCoverage) needsFetch = true;
      if (triggers && triggers.spouseCoverage && changedSpouseCoverage) needsFetch = true;

      if (needsFetch) {
        // Skip 'accident' if we've already fetched it
        if (isStaticData(quotes, product as keyof typeof productConfig)) {
          // Do nothing
          // accident should be fetched only once, because it doesn't have any dependencies
        }
        // Skip 'std' if there's no salary info
        else if (product === 'std' && individualInfo.annualSalary <= 0) { 
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
  }, [
    individualInfo.age, 
    individualInfo.annualSalary, 
    individualInfo.zipCode, 
    individualInfo.employeeCoverage, 
    individualInfo.spouseCoverage, 
    tokenReady,
    quotes,
    debouncedFetchProducts
  ]);

  return {
    quotes,
    loading,
    error,
    showAuthErrorModal,
    handleCloseAuthErrorModal
  };
}
