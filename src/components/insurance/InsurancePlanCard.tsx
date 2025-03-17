
import React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { InsurancePlanFeature } from "./InsurancePlanFeature";

interface InsurancePlanCardProps {
  title: string;
  description?: string;
  price: string;
  icon?: string;
  features?: string[];
  enabled: boolean;
  isExpanded?: boolean;
  caption?: string;
  onToggle?: (enabled: boolean) => void;
  onExpand?: () => void;
  className?: string;
}

export const InsurancePlanCard: React.FC<InsurancePlanCardProps> = ({
  title,
  description,
  price,
  icon,
  features = [],
  enabled,
  isExpanded = false,
  caption,
  onToggle = () => {},
  onExpand = () => {},
  className,
}) => {
  console.log(`Rendering ${title} with price:`, price);
  
  // Determine which icon to use for LTD and STD
  const renderIcon = () => {
    if (icon) {
      return <img
        loading="lazy"
        src={icon}
        alt={title}
        className="w-6 h-6 object-contain"
      />;
    } else if (title.includes("Long-Term Disability")) {
      return <img 
        loading="lazy" 
        src="/lovable-uploads/41ab950c-abc1-4bd0-9edf-50a79e9e8638.png" 
        alt="LTD" 
        className="w-6 h-6 object-contain" 
      />;
    } else if (title.includes("Short-Term Disability")) {
      return <img 
        loading="lazy" 
        src="/lovable-uploads/a5306ff3-7263-4423-87ad-d4f5af4145cb.png" 
        alt="STD" 
        className="w-6 h-6 object-contain" 
      />;
    }
    return null;
  };

  // Format price to display in two rows
  const formatPrice = () => {
    // Make sure price is a string and has the expected format
    const priceStr = typeof price === 'string' ? price : `$0.00/week`;
    const priceValue = priceStr.split('/')[0] || '$0.00';
    
    return (
      <div className="flex flex-col items-end">
        <span className={`text-sm font-bold ${isExpanded ? 'text-[#4361EE]' : 'text-[#000000]'}`}>
          {priceValue}
        </span>
        <span className="text-xs text-gray-500">/week</span>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-sm ${isExpanded ? 'border-2 border-[#4361EE]' : 'border border-[#E2E8F0]'} ${className}`}>
      <div 
        className="flex w-full items-center justify-between p-4 cursor-pointer"
        onClick={onExpand}
      >
        <div className="flex items-center gap-3">
          {renderIcon()}
          <div className="flex flex-col">
            <div className="text-sm font-bold text-[#4361EE]">
              {title}
            </div>
            {caption && (
              <div className="text-xs text-[#8E9196] mt-0.5">
                {caption}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {formatPrice()}
          <div className="flex items-center gap-2">
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-[#4361EE]"
            />
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div 
          className="px-4 pb-4"
        >
          {description && (
            <p className="text-sm text-gray-700 mb-4">
              {description}
            </p>
          )}
          
          {features.length > 0 && (
            <div className="flex flex-col space-y-3">
              {features.map((feature, index) => (
                <InsurancePlanFeature key={index} feature={feature} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
