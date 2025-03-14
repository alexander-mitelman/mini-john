
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  InsuranceHeader,
  UserInfoCard,
  InsurancePlanCard,
  InsuranceSummary,
  CTAButton,
  EditUserInfoDialog,
} from "@/components/insurance";
import { UserInfo, InsuranceProducts, fetchAllProducts, fetchProductUpdates } from "@/utils/insuranceApi";

const Index = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // User information state
  const [userInfo, setUserInfo] = useState<UserInfo>({
    age: 46,
    zipCode: "070730",
    income: "$200,000",
    annualSalary: 200000,
  });
  
  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [focusField, setFocusField] = useState<'age' | 'zipCode' | 'income' | undefined>(undefined);

  // Insurance products state
  const [products, setProducts] = useState<InsuranceProducts>({
    ltd: { price: "$28.21/week", weeklyPrice: 28.21, features: [] },
    std: { price: "$30.00/week", weeklyPrice: 30.00 },
    life: { price: "$3.60/week", weeklyPrice: 3.60 },
    accident: { price: "$11.74/week", weeklyPrice: 11.74 },
    dental: { price: "$34.51/week", weeklyPrice: 34.51 },
    vision: { price: "$9.48/week", weeklyPrice: 9.48 },
  });

  // Track which products are enabled
  const [enabledProducts, setEnabledProducts] = useState<Record<string, boolean>>({
    ltd: true,
    std: true,
    life: true,
    accident: true,
    dental: true,
    vision: true,
  });

  // Handle toggling a product on/off
  const handleToggleProduct = (product: string, enabled: boolean) => {
    setEnabledProducts(prev => ({
      ...prev,
      [product]: enabled
    }));
    
    toast({
      title: enabled ? "Product added" : "Product removed",
      description: `${product.toUpperCase()} insurance has been ${enabled ? "added to" : "removed from"} your plan.`,
    });
  };

  // Total weekly price calculation (only for enabled products)
  const totalWeeklyPrice = Object.entries(products)
    .reduce((sum, [key, product]) => {
      if (enabledProducts[key]) {
        return sum + (product.weeklyPrice || 0);
      }
      return sum;
    }, 0)
    .toFixed(2);

  // Hours of work calculation based on income
  const calculateHoursOfWork = () => {
    const annualIncome = parseInt(userInfo.income.replace(/\$|,/g, ''));
    const hourlyRate = annualIncome / 2080; // 40 hours * 52 weeks
    const weeklyPrice = parseFloat(totalWeeklyPrice);
    return (weeklyPrice / hourlyRate).toFixed(1);
  };

  // Initial data fetch
  useEffect(() => {
    const initializeProducts = async () => {
      try {
        setIsLoading(true);
        const allProducts = await fetchAllProducts(userInfo);
        setProducts(allProducts);
      } catch (error) {
        console.error("Failed to fetch initial products:", error);
        toast({
          title: "Error",
          description: "Failed to load insurance products.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeProducts();
  }, []);

  // Handle edit user info dialog
  const handleEditUserInfo = (field?: 'age' | 'zipCode' | 'income') => {
    setFocusField(field);
    setIsEditDialogOpen(true);
  };
  
  // Handle user info submission and fetch updated product prices
  const handleUserInfoSubmit = async (updatedInfo: UserInfo) => {
    const previousInfo = { ...userInfo };
    setUserInfo(updatedInfo);
    setIsEditDialogOpen(false);
    
    // Determine which fields have changed
    const changedFields: string[] = [];
    if (updatedInfo.age !== previousInfo.age) changedFields.push('age');
    if (updatedInfo.zipCode !== previousInfo.zipCode) changedFields.push('zipCode');
    
    // Check if income has changed and calculate annualSalary
    const previousIncome = parseInt(previousInfo.income.replace(/\$|,/g, ''));
    const newIncome = parseInt(updatedInfo.income.replace(/\$|,/g, ''));
    if (previousIncome !== newIncome) {
      changedFields.push('income');
      changedFields.push('annualSalary');
      updatedInfo.annualSalary = newIncome;
    }
    
    if (changedFields.length > 0) {
      try {
        setIsLoading(true);
        toast({
          title: "Updating prices",
          description: "Recalculating your insurance quotes based on new information.",
        });
        
        // Fetch updated products based on changed fields
        const updatedProducts = await fetchProductUpdates(updatedInfo, changedFields);
        
        // Update products state with the new values
        setProducts(prevProducts => ({
          ...prevProducts,
          ...updatedProducts,
        }));
        
        toast({
          title: "Prices updated",
          description: "Your insurance quotes have been updated.",
        });
      } catch (error) {
        console.error("Failed to update products:", error);
        toast({
          title: "Error",
          description: "Failed to update insurance products.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGetQuote = () => {
    // In a real app, this would navigate to the quote page
    console.log("Get quote clicked");
    toast({
      title: "Quote requested",
      description: "Your personalized quote is being prepared.",
    });
  };

  const longTermDisabilityFeatures = products.ltd.features || [];

  return (
    <main className="bg-white flex max-w-[480px] w-full flex-col items-stretch mx-auto px-[60px] py-[81px] max-md:px-5">
      <InsuranceHeader
        title="Insurance That Fits Your Budget"
        description="Each Of These Affordable Insurance Options Takes Less Than One Hour Of Work Per Week To Cover."
      />

      <div className="mt-[33px]">
        <UserInfoCard
          age={userInfo.age}
          zipCode={userInfo.zipCode}
          income={userInfo.income}
          onEdit={handleEditUserInfo}
        />
      </div>

      <EditUserInfoDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        initialValues={userInfo}
        onSubmit={handleUserInfoSubmit}
        focusField={focusField}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse text-center text-gray-500">
            Loading insurance options...
          </div>
        </div>
      ) : (
        <>
          <div className="mt-2">
            <InsurancePlanCard
              title="Long Term Disability"
              description="Protect your income when you need it most"
              price={products.ltd.price}
              isExpanded={false}
              features={longTermDisabilityFeatures}
              enabled={enabledProducts.ltd}
              onToggle={(enabled) => handleToggleProduct('ltd', enabled)}
            />
          </div>

          <div className="mt-2.5">
            <InsurancePlanCard
              title="Short-term Disability"
              description="Protect your income when you need it most"
              price={products.std.price}
              enabled={enabledProducts.std}
              onToggle={(enabled) => handleToggleProduct('std', enabled)}
            />
          </div>

          <div className="mt-4">
            <InsurancePlanCard
              title="Life Insurance"
              description="Financial protection for your loved ones"
              price={products.life.price}
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/5f9c57b11ebaa7eadf51a69256cff48f2f948c6626ed844068459f36c7c8202b?placeholderIfAbsent=true"
              enabled={enabledProducts.life}
              onToggle={(enabled) => handleToggleProduct('life', enabled)}
            />
          </div>

          <div className="mt-4">
            <InsurancePlanCard
              title="Dental"
              description="Coverage for routine dental care and procedures"
              price={products.dental.price}
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/4c06ccf7d2f8aefefb4333aaca45e934f2f147688a0d3ac41633515a9a80897c?placeholderIfAbsent=true"
              className="flex w-full items-stretch gap-5 justify-between px-[11px] py-[21px]"
              enabled={enabledProducts.dental}
              onToggle={(enabled) => handleToggleProduct('dental', enabled)}
            />
          </div>

          <div className="mt-4">
            <InsurancePlanCard
              title="Vision"
              description="Coverage for eye exams and vision correction"
              price={products.vision.price}
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/0bbf0b198321af45e362d12ca231b34a03288994a5e4eb7382e767e586308d22?placeholderIfAbsent=true"
              className="flex w-full items-stretch gap-5 justify-between px-3 py-[22px]"
              enabled={enabledProducts.vision}
              onToggle={(enabled) => handleToggleProduct('vision', enabled)}
            />
          </div>

          <div className="mt-4">
            <InsurancePlanCard
              title="Accident"
              description="Financial help if you experience a covered accident"
              price={products.accident.price}
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1d6e8727f71bc0136354086a0262a101904e839fe1987b76d93802397374cd47?placeholderIfAbsent=true"
              className="flex gap-5 justify-between px-3.5 py-[22px]"
              enabled={enabledProducts.accident}
              onToggle={(enabled) => handleToggleProduct('accident', enabled)}
            />
          </div>

          <div className="mt-2">
            <InsuranceSummary 
              weeklyPrice={`$${totalWeeklyPrice}`} 
              hoursOfWork={calculateHoursOfWork()} 
            />
          </div>

          <div className="mt-3.5">
            <CTAButton
              text="Get Your Personalized Quote"
              onClick={handleGetQuote}
            />
          </div>
        </>
      )}
    </main>
  );
};

export default Index;
