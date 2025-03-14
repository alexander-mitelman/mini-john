import React from "react";

interface InsurancePlanFeatureProps {
  icon: string;
  text: string;
  className?: string;
}

export const InsurancePlanFeature: React.FC<InsurancePlanFeatureProps> = ({
  icon,
  text,
  className = "",
}) => {
  return (
    <div
      className={`flex items-center gap-2 py-1.5 rounded-[32px_32px_32px_2px] ${className}`}
    >
      <img
        src={icon}
        alt="Feature icon"
        className="aspect-[1] object-contain w-[23px] self-stretch shrink-0 my-auto"
      />
      <div className="self-stretch my-auto">{text}</div>
    </div>
  );
};
