
import React from "react";

interface InsuranceHeaderProps {
  title: string;
  description: string;
}

export const InsuranceHeader: React.FC<InsuranceHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <header className="flex flex-col items-center">
      <h1 className="text-[#4353FF] text-2xl font-bold text-center font-nunito">
        {title}
      </h1>
      <p className="text-[#6B7280] text-lg font-medium text-center mt-8 font-nunito">
        {description}
      </p>
    </header>
  );
};
