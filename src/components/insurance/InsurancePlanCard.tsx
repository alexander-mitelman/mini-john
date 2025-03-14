
import React, { useState } from "react";
import { InsurancePlanFeature } from "./InsurancePlanFeature";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Feature {
  icon: string;
  text: string;
}

interface InsurancePlanCardProps {
  title: string;
  description: string;
  price?: string;
  icon?: string;
  features?: Feature[];
  isExpanded?: boolean;
  className?: string;
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export const InsurancePlanCard: React.FC<InsurancePlanCardProps> = ({
  title,
  description,
  price = "",
  icon,
  features = [],
  isExpanded: initialExpanded = false,
  className = "",
  enabled = true,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Format the price display with dollar amount on top line and /week on bottom line
  const formatPrice = (price: string) => {
    if (!price) return "";
    const parts = price.split("/");
    return (
      <div className="flex flex-col items-end">
        <span className={`font-[900] text-[rgba(102,112,133,1)] text-lg leading-tight ${!enabled ? "opacity-50" : ""}`}>
          {parts[0]}
        </span>
        <span className={`text-[12px] text-[rgba(181,179,179,1)] leading-tight ${!enabled ? "opacity-50" : ""}`}>
          {parts.length > 1 ? `/${parts[1]}` : ""}
        </span>
      </div>
    );
  };

  // For long term disability with collapsible content
  if (title === "Long Term Disability") {
    return (
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className={`border-2 rounded-2xl ${isExpanded ? "border-[color:var(--Color,#4353FF)]" : "border-[rgba(67,83,255,0.4)]"} shadow-[0px_16px_60px_0px_rgba(162,148,253,0.40)] bg-white ${!enabled ? "opacity-70" : ""}`}
      >
        {/* Card layout with dedicated icon column */}
        <div className="flex w-full">
          {/* Icon column */}
          <div className="flex-shrink-0 py-4 pl-3.5 pr-2">
            <img
              src="/lovable-uploads/41ab950c-abc1-4bd0-9edf-50a79e9e8638.png"
              alt="Long Term Disability icon"
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Content column */}
          <div className="flex-grow flex flex-col">
            {/* Title at the top */}
            <div className="pt-4 pb-2">
              <h3 className={`text-[rgba(67,83,255,1)] text-base font-bold leading-none font-nunito-sans font-[700] ${!enabled ? "opacity-50" : ""}`}>
                {title}
              </h3>
            </div>
            
            {/* Description and controls */}
            <div className="flex w-full pr-3.5 pb-3 items-center">
              <p className={`text-[#6C757D] text-xs font-normal leading-loose font-nunito-sans font-[400] mr-auto ${!enabled ? "opacity-50" : ""}`}>
                {description}
              </p>
              
              <div className="flex items-center gap-3 shrink-0">
                {!isExpanded && price && formatPrice(price)}
                
                <div className="flex items-center">
                  <Switch 
                    checked={enabled}
                    onCheckedChange={(checked) => onToggle && onToggle(checked)}
                  />
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CollapsibleTrigger className="p-2 rounded-full bg-[rgba(67,83,255,0.1)] text-[rgba(67,83,255,1)] hover:bg-[rgba(67,83,255,0.2)] transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <div className="flex items-center">
                            <Info className="h-5 w-5" />
                          </div>
                        )}
                      </CollapsibleTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{isExpanded ? "Show less" : "View more details"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <CollapsibleContent className="px-3 pb-5 animate-accordion-down">
          <div className="flex w-full max-w-full flex-col items-stretch">
            <p className={`text-black text-sm font-normal leading-[23px] font-nunito-sans ${!enabled ? "opacity-50" : ""}`}>
              LTD Insurance protects your ability to earn an income with benefits
              that can be paid up to your normal retirement age. With Guaranteed
              Issue, you're enrolled as soon as you sign up.
            </p>
            <div className={`flex flex-col text-xs text-[rgba(74,85,104,1)] font-bold text-center leading-loose mt-2 ${!enabled ? "opacity-50" : ""}`}>
              {features.map((feature, index) => (
                <InsurancePlanFeature
                  key={index}
                  icon={feature.icon}
                  text={feature.text}
                  className={index === 2 ? "text-zinc-600" : ""}
                />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // For Short Term Disability with icon
  if (title === "Short-term Disability") {
    return (
      <article
        className={`bg-white rounded-2xl border-[rgba(67,83,255,0.4)] border-solid border-2 ${className} ${!enabled ? "opacity-70" : ""}`}
      >
        <div className="flex w-full">
          {/* Icon column */}
          <div className="flex-shrink-0 py-3 pl-3.5 pr-2">
            <img
              src="/lovable-uploads/a5306ff3-7263-4423-87ad-d4f5af4145cb.png"
              alt={`${title} icon`}
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Content column */}
          <div className="flex-grow flex flex-col pr-3.5">
            {/* Title at the top */}
            <div className="pt-3 pb-2">
              <h3 className={`text-[rgba(67,83,255,1)] text-base font-bold leading-none font-nunito-sans font-[700] ${!enabled ? "opacity-50" : ""}`}>
                {title}
              </h3>
            </div>
            
            {/* Description and controls */}
            <div className="flex w-full items-center pb-3">
              <p className={`text-[#6C757D] text-xs font-normal leading-loose font-nunito-sans font-[400] mr-auto ${!enabled ? "opacity-50" : ""}`}>
                {description}
              </p>
              
              <div className="flex items-center gap-3 shrink-0">
                {price && formatPrice(price)}
                
                <div className="flex items-center">
                  <Switch 
                    checked={enabled}
                    onCheckedChange={(checked) => onToggle && onToggle(checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Compact version with icon for other plans
  if (icon) {
    return (
      <article
        className={`bg-white rounded-2xl border-[rgba(67,83,255,0.4)] border-solid border-2 ${className} ${!enabled ? "opacity-70" : ""}`}
      >
        <div className="flex w-full">
          {/* Icon column */}
          <div className="flex-shrink-0 py-3 pl-3.5 pr-2">
            <img
              src={icon}
              alt={`${title} icon`}
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* Content column */}
          <div className="flex-grow flex flex-col pr-3.5">
            {/* Title at the top */}
            <div className="pt-3 pb-2">
              <h3 className={`text-[rgba(67,83,255,1)] text-base font-bold leading-none font-nunito-sans font-[700] ${!enabled ? "opacity-50" : ""}`}>
                {title}
              </h3>
            </div>
            
            {/* Description and controls */}
            <div className="flex w-full items-center pb-3">
              <p className={`text-[#6C757D] text-xs font-normal leading-loose font-nunito-sans font-[400] mr-auto ${!enabled ? "opacity-50" : ""}`}>
                {description}
              </p>
              
              <div className="flex items-center gap-3 shrink-0">
                {price && formatPrice(price)}
                
                <div className="flex items-center">
                  <Switch 
                    checked={enabled}
                    onCheckedChange={(checked) => onToggle && onToggle(checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Compact version without icon
  return (
    <article
      className={`bg-white flex flex-col px-[70px] py-3 rounded-2xl border-[rgba(67,83,255,0.4)] border-solid border-2 max-md:px-5 ${className} ${!enabled ? "opacity-70" : ""}`}
    >
      {/* Title at the top */}
      <div className="pb-2">
        <h3 className={`text-[rgba(67,83,255,1)] text-base font-bold leading-none font-nunito-sans font-[700] ${!enabled ? "opacity-50" : ""}`}>
          {title}
        </h3>
      </div>
      
      {/* Main row with description, price, switch */}
      <div className="flex items-center">
        <p className={`text-[#6C757D] text-xs font-normal leading-loose font-nunito-sans font-[400] mr-auto ${!enabled ? "opacity-50" : ""}`}>
          {description}
        </p>
        
        <div className="flex items-center gap-3 shrink-0">
          {price && formatPrice(price)}
          
          <div className="flex items-center">
            <Switch 
              checked={enabled}
              onCheckedChange={(checked) => onToggle && onToggle(checked)}
            />
          </div>
        </div>
      </div>
    </article>
  );
};
