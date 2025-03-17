
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
  onToggle = () => {},
  onExpand = () => {},
  className,
}) => {
  return (
    <div className={`bg-white shadow-[0px_16px_60px_0px_rgba(162,148,253,0.40)] rounded-2xl overflow-hidden`}>
      <div 
        className="flex w-full items-stretch justify-between px-[11px] py-[21px] cursor-pointer"
        onClick={onExpand}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <img
              loading="lazy"
              src={icon}
              alt={title}
              className="w-6 h-6 object-contain"
            />
          )}
          <div className="flex flex-col">
            <div className={`text-sm font-bold ${isExpanded ? "text-[rgba(67,83,255,1)]" : "text-black"}`}>
              {title}
            </div>
            {description && !isExpanded && (
              <div className="text-[10px] text-[rgba(67,83,255,1)] mt-[3px]">
                {description}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-xs font-bold ${isExpanded ? "text-[rgba(67,83,255,1)]" : "text-black"}`}>
            {price}
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-[rgba(67,83,255,1)]"
            />
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div 
          className="px-[11px] pb-[21px] transition-all duration-300 ease-in-out animate-accordion-down"
        >
          {description && (
            <p className="text-xs text-[rgba(67,83,255,1)] mb-4">
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
