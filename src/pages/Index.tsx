import React, { useState } from "react";
import {
  InsuranceHeader,
  UserInfoCard,
  InsurancePlanCard,
  InsuranceSummary,
  CTAButton,
  EditUserInfoDialog,
} from "@/components/insurance";

const Index = () => {
  const [userInfo, setUserInfo] = useState({
    age: 46,
    zipCode: "070730",
    income: "$200,000",
  });
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [focusField, setFocusField] = useState<'age' | 'zipCode' | 'income' | undefined>(undefined);

  const handleEditUserInfo = (field?: 'age' | 'zipCode' | 'income') => {
    setFocusField(field);
    setIsEditDialogOpen(true);
  };
  
  const handleUserInfoSubmit = (updatedInfo: {
    age: number;
    zipCode: string;
    income: string;
  }) => {
    setUserInfo(updatedInfo);
    setIsEditDialogOpen(false);
  };

  const handleGetQuote = () => {
    // In a real app, this would navigate to the quote page
    console.log("Get quote clicked");
  };

  const longTermDisabilityFeatures = [
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
  ];

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

      <div className="mt-2">
        <InsurancePlanCard
          title="Long Term Disability"
          description="Protect your income when you need it most"
          isExpanded={true}
          features={longTermDisabilityFeatures}
        />
      </div>

      <div className="mt-2.5">
        <InsurancePlanCard
          title="Short-term Disability"
          description="Protect your income when you need it most"
          price="$30.00/week"
        />
      </div>

      <div className="mt-4">
        <InsurancePlanCard
          title="Life Insurance"
          description="Financial protection for your loved ones"
          price="$3.60/week"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/5f9c57b11ebaa7eadf51a69256cff48f2f948c6626ed844068459f36c7c8202b?placeholderIfAbsent=true"
        />
      </div>

      <div className="mt-4">
        <InsurancePlanCard
          title="Dental"
          description="Coverage for routine dental care and procedures"
          price="$34.51/week"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/4c06ccf7d2f8aefefb4333aaca45e934f2f147688a0d3ac41633515a9a80897c?placeholderIfAbsent=true"
          className="flex w-full items-stretch gap-5 justify-between px-[11px] py-[21px]"
        />
      </div>

      <div className="mt-4">
        <InsurancePlanCard
          title="Vision"
          description="Coverage for eye exams and vision correction"
          price="$9.48/week"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/0bbf0b198321af45e362d12ca231b34a03288994a5e4eb7382e767e586308d22?placeholderIfAbsent=true"
          className="flex w-full items-stretch gap-5 justify-between px-3 py-[22px]"
        />
      </div>

      <div className="mt-4">
        <InsurancePlanCard
          title="Accident"
          description="Financial help if you experience a covered accident"
          price="$11.74/week"
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1d6e8727f71bc0136354086a0262a101904e839fe1987b76d93802397374cd47?placeholderIfAbsent=true"
          className="flex gap-5 justify-between px-3.5 py-[22px]"
        />
      </div>

      <div className="mt-2">
        <InsuranceSummary weeklyPrice="$34.70" hoursOfWork="1.4" />
      </div>

      <div className="mt-3.5">
        <CTAButton
          text="Get Your Personalized Quote"
          onClick={handleGetQuote}
        />
      </div>
    </main>
  );
};

export default Index;
