
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  UserInfoCard,
  InsurancePlanCard,
  InsuranceSummary,
  CTAButton,
  EditUserInfoDialog,
} from "@/components/insurance";
import { useQuotes } from "@/hooks/useQuotes";
import { IndividualInfo } from "@/utils/insuranceApi";
import { HeartPulse } from "lucide-react";

const Index = () => {
  const { toast } = useToast();

  // User information state
  const [userInfo, setUserInfo] = useState<IndividualInfo>({
    age: 46,
    zipCode: "070730",
    income: "$200,000",
    annualSalary: 200000,
    employeeCoverage: 20000,
    spouseCoverage: 10000,
  });
  
  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [focusField, setFocusField] = useState<'age' | 'zipCode' | 'income' | undefined>(undefined);
  const [inputError, setInputError] = useState("");

  // Track which product is expanded
  const [expandedProduct, setExpandedProduct] = useState<string | null>("ltd");

  // Get quotes from hook
  const { quotes, loading, error } = useQuotes(userInfo, inputError);

  // Track which products are enabled
  const [enabledProducts, setEnabledProducts] = useState<Record<string, boolean>>({
    ltd: true,
    std: true,
    life: true,
    accident: true,
    dental: true,
    vision: true,
    critical: true,
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

  // Handle expanding a product
  const handleExpandProduct = (product: string) => {
    setExpandedProduct(prev => prev === product ? null : product);
  };

  // Total weekly price calculation (only for enabled products)
  const totalWeeklyPrice = Object.entries(quotes)
    .reduce((sum, [key, product]) => {
      if (enabledProducts[key] && product && product.weeklyPrice) {
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

  // Handle edit user info dialog
  const handleEditUserInfo = (field?: 'age' | 'zipCode' | 'income') => {
    setFocusField(field);
    setIsEditDialogOpen(true);
  };
  
  // Handle user info submission
  const handleUserInfoSubmit = (updatedInfo: IndividualInfo) => {
    // Calculate annualSalary from income if income has changed
    const previousIncome = parseInt(userInfo.income.replace(/\$|,/g, ''));
    const newIncome = parseInt(updatedInfo.income.replace(/\$|,/g, ''));
    
    if (previousIncome !== newIncome) {
      updatedInfo.annualSalary = newIncome;
    }
    
    setUserInfo(updatedInfo);
    setIsEditDialogOpen(false);
    
    // Notify user that prices are updating
    if (Object.keys(updatedInfo).some(key => updatedInfo[key as keyof IndividualInfo] !== userInfo[key as keyof IndividualInfo])) {
      toast({
        title: "Updating prices",
        description: "Recalculating your insurance quotes based on new information.",
      });
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

  // Features content for each product
  const productFeatures = {
    ltd: [
      "Up to $1,200 of weekly benefit",
      "Pregnancy coverage for women",
      "Guaranteed Issue enrollment",
      "Quick benefit payments"
    ],
    std: [
      "Up to $1,200 of weekly benefit",
      "Pregnancy coverage for women",
      "Guaranteed Issue enrollment",
      "Quick benefit payments"
    ],
    life: [
      "Cover funeral costs (avg. $15,000), payoff credit debt or establish a college fund.",
      "Up to $150,000 of coverage.",
      "Accidental death and dismemberment (AD&D) is part of the policy at the same coverage amount.",
      "Guaranteed Issue - meaning just sign-up and you're enrolled.",
      "Spouse is eligible for up to $20,000 of coverage.",
      "$2.50 provides $10,000 of coverage for all your children.",
      "Available for employees and dependents"
    ],
    dental: [
      "Same coverage in/out of network",
      "$1,500 annual maximum per person",
      "80% coverage for root canals",
      "$1,000 lifetime child orthodontics"
    ],
    vision: [
      "$10 copay for annual exam",
      "Annual frames and lenses",
      "VSP Network coverage",
      "Preventive care focus"
    ],
    accident: [
      "Large benefits for medical attention",
      "Direct payment to you",
      "24/7 coverage on/off job",
      "+25% for organized sports"
    ],
    critical: [
      "Helps cover expenses that other insurance won't",
      "Pays $15,000 lump sum for initial diagnosis of covered illnesses",
      "Pays same lump sum for reoccurrence",
      "Pays $15,000 on the initial diagnosis of invasive cancer",
      "Benefit is paid directly to you",
      "Dozens of illnesses are covered by this policy",
      "Available for employees and dependents"
    ]
  };

  // Product descriptions
  const productDescriptions = {
    ltd: "LTD insurance protects your ability to earn an income with benefits that can be paid up to your normal retirement age. With guaranteed issue, you're enrolled as soon as you sign up.",
    std: "Get weekly benefits of $1,200 for lost income, including coverage for pregnancy-related work absence. Guaranteed Issue means immediate enrollment upon sign-up.",
    life: "Life insurance helps loved ones financially in the event of a premature death.",
    dental: "Maintain your oral health with comprehensive coverage that works both in and out of network. Includes $1,500 annual maximum per person and generous coverage for procedures like root canals.",
    vision: "Protect your eye health with annual exams, frames, and lenses through the VSP Network. Just $10 copay for your annual eye exam.",
    accident: "Get coverage for both on and off-the-job accidents, with benefits paid directly to you. Receive an extra 25% for accidents during organized sports.",
    critical: "Money won't fix everything but our lump sum payment can help relieve some of the financial stress if cancer or other critical illnesses were to strike."
  };

  // Product captions
  const productCaptions = {
    ltd: "Protect Your Income When You Need It Most",
    std: "Short-Term Coverage For Immediate Needs",
    life: "Financial Protection For Your Loved Ones",
    dental: "Coverage For Routine Dental Care And Procedures",
    vision: "Coverage For Eye Exams And Vision Correction",
    accident: "Financial Help If You Experience A Covered Accident",
    critical: "Financial Protection For Serious Illness"
  };

  return (
    <main data-lov-name="main" className="bg-white flex max-w-[480px] w-full flex-col items-stretch mx-auto">
      <div className="mt-[33px] px-4">
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

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-pulse text-center text-gray-500">
            Loading insurance options...
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 px-4">
            <InsurancePlanCard
              title="Long-Term Disability"
              caption={productCaptions.ltd}
              description={productDescriptions.ltd}
              price={quotes.ltd?.price || "$0.00/week"}
              isExpanded={expandedProduct === "ltd"} 
              features={productFeatures.ltd}
              enabled={enabledProducts.ltd}
              onToggle={(enabled) => handleToggleProduct('ltd', enabled)}
              onExpand={() => handleExpandProduct('ltd')}
            />
          </div>

          <div className="mt-3 px-4">
            <InsurancePlanCard
              title="Short-Term Disability"
              caption={productCaptions.std}
              description={productDescriptions.std}
              price={quotes.std?.price || "$0.00/week"}
              isExpanded={expandedProduct === "std"}
              features={productFeatures.std}
              enabled={enabledProducts.std}
              onToggle={(enabled) => handleToggleProduct('std', enabled)}
              onExpand={() => handleExpandProduct('std')}
            />
          </div>

          <div className="mt-3 px-4">
            <InsurancePlanCard
              title="Life Insurance"
              caption={productCaptions.life}
              description={productDescriptions.life}
              price={quotes.life?.price || "$0.00/week"}
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/5f9c57b11ebaa7eadf51a69256cff48f2f948c6626ed844068459f36c7c8202b?placeholderIfAbsent=true"
              isExpanded={expandedProduct === "life"}
              features={productFeatures.life}
              enabled={enabledProducts.life}
              onToggle={(enabled) => handleToggleProduct('life', enabled)}
              onExpand={() => handleExpandProduct('life')}
            />
          </div>

          <div className="mt-3 px-4">
            <InsurancePlanCard
              title="Dental"
              caption={productCaptions.dental}
              description={productDescriptions.dental}
              price={quotes.dental?.price || "$0.00/week"}
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/4c06ccf7d2f8aefefb4333aaca45e934f2f147688a0d3ac41633515a9a80897c?placeholderIfAbsent=true"
              isExpanded={expandedProduct === "dental"}
              features={productFeatures.dental}
              enabled={enabledProducts.dental}
              onToggle={(enabled) => handleToggleProduct('dental', enabled)}
              onExpand={() => handleExpandProduct('dental')}
            />
          </div>

          <div className="mt-3 px-4">
            <InsurancePlanCard
              title="Vision"
              caption={productCaptions.vision}
              description={productDescriptions.vision}
              price={quotes.vision?.price || "$0.00/week"}
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/0bbf0b198321af45e362d12ca231b34a03288994a5e4eb7382e767e586308d22?placeholderIfAbsent=true"
              isExpanded={expandedProduct === "vision"}
              features={productFeatures.vision}
              enabled={enabledProducts.vision}
              onToggle={(enabled) => handleToggleProduct('vision', enabled)}
              onExpand={() => handleExpandProduct('vision')}
            />
          </div>

          <div className="mt-3 px-4">
            <InsurancePlanCard
              title="Accident"
              caption={productCaptions.accident}
              description={productDescriptions.accident}
              price={quotes.accident?.price || "$0.00/week"}
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1d6e8727f71bc0136354086a0262a101904e839fe1987b76d93802397374cd47?placeholderIfAbsent=true"
              isExpanded={expandedProduct === "accident"}
              features={productFeatures.accident}
              enabled={enabledProducts.accident}
              onToggle={(enabled) => handleToggleProduct('accident', enabled)}
              onExpand={() => handleExpandProduct('accident')}
            />
          </div>

          <div className="mt-3 px-4">
            <InsurancePlanCard
              title="Critical Illness/Cancer"
              caption={productCaptions.critical}
              description={productDescriptions.critical}
              price={quotes.critical?.price || "$0.00/week"}
              icon="/lovable-uploads/489b614e-ea23-49c3-854d-f469ef9e211e.png"
              isExpanded={expandedProduct === "critical"}
              features={productFeatures.critical}
              enabled={enabledProducts.critical}
              onToggle={(enabled) => handleToggleProduct('critical', enabled)}
              onExpand={() => handleExpandProduct('critical')}
            />
          </div>

          <div className="mt-4 px-4">
            <InsuranceSummary 
              weeklyPrice={`$${totalWeeklyPrice}`} 
              hoursOfWork={calculateHoursOfWork()} 
            />
          </div>

          <div className="mt-4 px-4 mb-4">
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
