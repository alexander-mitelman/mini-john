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
      <h1 className="text-[rgba(67,83,255,1)] text-2xl font-bold text-center">
        {title}
      </h1>
      <p className="text-[rgba(102,112,133,1)] text-lg font-medium text-center mt-8">
        {description}
      </p>
    </header>
  );
};
