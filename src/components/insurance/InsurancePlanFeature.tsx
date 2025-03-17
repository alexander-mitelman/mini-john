
import React from "react";
import { Check } from "lucide-react";

interface InsurancePlanFeatureProps {
  feature: string;
}

export const InsurancePlanFeature: React.FC<InsurancePlanFeatureProps> = ({ feature }) => {
  return (
    <div className="flex items-start">
      <div className="min-w-[20px] h-5 mr-2 flex items-center justify-center">
        <Check className="h-4 w-4 text-[rgba(67,83,255,1)]" />
      </div>
      <div className="text-xs text-black">{feature}</div>
    </div>
  );
};
