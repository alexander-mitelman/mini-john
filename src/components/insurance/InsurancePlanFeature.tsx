
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
  // Check if icon is an SVG string (starts with "data:image/svg" or "<svg")
  const isSvgString = icon.startsWith("data:image/svg") || icon.startsWith("<svg");

  return (
    <div
      className={`flex items-center gap-2 py-1.5 rounded-[32px_32px_32px_2px] ${className}`}
    >
      {isSvgString ? (
        <div 
          className="w-[23px] h-[23px] self-stretch shrink-0 my-auto"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      ) : (
        <img
          src={icon}
          alt="Feature icon"
          className="aspect-[1] object-contain w-[23px] h-[23px] self-stretch shrink-0 my-auto"
        />
      )}
      <div className="self-stretch my-auto">{text}</div>
    </div>
  );
};
