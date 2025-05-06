
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

// SVG components for insurance icons
const LTDIcon = () => (
  <svg width="24" height="24" viewBox="0 0 37 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5452 42.733C18.3691 42.733 23.0903 37.9097 23.0903 31.96C23.0903 26.0102 18.3691 21.187 12.5452 21.187C6.72121 21.187 2 26.0102 2 31.96C2 37.9097 6.72121 42.733 12.5452 42.733Z" fill="#D7E0FF"/>
    <path d="M20.0674 15.0322V24.1428C20.0674 25.9107 21.4741 27.3109 23.1991 27.4519C29.9796 28.0065 32.3484 30.9807 34.4687 42.7333" stroke="#4147D5" stroke-width="3.13333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.5342 21.187C10.6307 21.189 8.76326 21.7173 7.12995 22.7159C5.49661 23.7144 4.1583 25.146 3.25702 26.8588C2.35572 28.5716 1.92504 30.5017 2.01068 32.4442C2.09628 34.3869 2.69503 36.2695 3.74335 37.8927C4.79167 39.5159 6.25052 40.8188 7.96508 41.6632C9.67964 42.5079 11.586 42.8626 13.4819 42.6898C15.3779 42.5169 17.1927 41.8229 18.7338 40.6818C20.2749 39.5406 21.485 37.9942 22.2355 36.2074" stroke="#4147D5" stroke-width="3.13333" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20.0903 14.3321C23.9531 14.3321 26.126 12.1123 26.126 8.16603C26.126 4.21977 23.9531 2 20.0903 2C16.2275 2 14.0547 4.21977 14.0547 8.16603C14.0547 12.1123 16.2275 14.3321 20.0903 14.3321Z" fill="#D7E0FF"/>
    <path d="M20.0903 14.3321C23.9531 14.3321 26.126 12.1123 26.126 8.16603C26.126 4.21977 23.9531 2 20.0903 2C16.2275 2 14.0547 4.21977 14.0547 8.16603C14.0547 12.1123 16.2275 14.3321 20.0903 14.3321Z" stroke="#4147D5" stroke-width="3.13333" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

const STDIcon = () => (
  <svg width="24" height="24" viewBox="0 0 46 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 36L7 42.5H18.5V34.5C16.6667 32.5 14.3 29.3 13.5 28.5C12.7 27.7 11.5 26.2 9.5 27V20C9.16667 19 7.8 16.9 5 16.5C2.2 16.1 1.16667 17.3333 1 18V36Z" fill="#D7E0FF"/>
    <path d="M7 42.5L3.65196 38.8729C1.94684 37.0257 1 34.604 1 32.0901V19.231C1 18.4134 1.06077 17.5129 1.72236 17.0324C2.33171 16.59 3.36446 16.2663 5 16.5C6.77555 16.7536 7.97473 17.6909 8.69955 18.5977C9.3706 19.4373 9.5 20.548 9.5 21.6228V27M9.5 27C11.5 26.2 12.7 27.7 13.5 28.5C13.9543 28.9543 14.9138 30.1826 15.994 31.5255C17.5621 33.4751 18.5 35.8879 18.5 38.3898V42.5M9.5 27C7.83333 27.6667 6.76706 30.9006 8.5 33.5L11 37.5" stroke="#4353FF" stroke-width="2"/>
    <path d="M44.5 36L38.5 42.5H27V34.5C28.8333 32.5 31.2 29.3 32 28.5C32.8 27.7 34 26.2 36 27V20C36.3333 19 37.7 16.9 40.5 16.5C43.3 16.1 44.3333 17.3333 44.5 18V36Z" fill="#D7E0FF"/>
    <path d="M38.5 42.5L41.848 38.8729C43.5532 37.0257 44.5 34.604 44.5 32.0901V19.231C44.5 18.4134 44.4392 17.5129 43.7776 17.0324C43.1683 16.59 42.1355 16.2663 40.5 16.5C38.7245 16.7536 37.5253 17.6909 36.8004 18.5977C36.1294 19.4373 36 20.548 36 21.6228V27M36 27C34 26.2 32.8 27.7 32 28.5C31.5457 28.9543 30.5862 30.1826 29.506 31.5255C27.9379 33.4751 27 35.8879 27 38.3898V42.5M36 27C37.6667 27.6667 38.7329 30.9006 37 33.5L34.5 37.5" stroke="#4353FF" stroke-width="2"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M27 6V0H18L18 6H12V15H18L18 21H27V15H33V6H27Z" fill="#4353FF"/>
  </svg>
);

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
      return <LTDIcon />;
    } else if (title.includes("Short-Term Disability")) {
      return <STDIcon />;
    }
    return null;
  };

  // Format price to display in two rows
  const formatPrice = () => {
    // Make sure price is a string and has the expected format
    const priceStr = typeof price === 'string' ? price : `$0.00/week`;
    
    // Check if the string contains a slash (e.g., "$25.00/week")
    let priceValue = '$0.00';
    let interval = '/week';
    
    if (priceStr.includes('/')) {
      [priceValue, interval] = priceStr.split('/');
      interval = '/' + interval;
    } else {
      // If there's no slash, use the whole string as the price value
      priceValue = priceStr;
    }
    
    return (
      <div className="flex flex-col items-end">
        <span className={`text-sm font-bold ${isExpanded ? 'text-[#4361EE]' : 'text-[#000000]'}`}>
          {priceValue}
        </span>
        <span className="text-xs text-gray-500">{interval}</span>
      </div>
    );
  };

  return (
    <div className={`${isExpanded ? 'bg-[rgba(67,83,255,0.05)] border-2 border-[#4361EE]' : 'bg-white border border-[#E2E8F0]'} rounded-xl overflow-hidden shadow-sm ${className}`}>
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
