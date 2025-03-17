
import React from "react";
import { Check } from "lucide-react";

interface InsurancePlanFeatureProps {
  feature: string;
}

export const InsurancePlanFeature: React.FC<InsurancePlanFeatureProps> = ({ feature }) => {
  return (
    <div className="flex items-center">
      <div className="bg-[#4361EE] rounded-full w-4 h-4 mr-2 flex items-center justify-center">
        <Check className="h-3 w-3 text-white" />
      </div>
      <div className="text-xs text-gray-700">{feature}</div>
    </div>
  );
};
