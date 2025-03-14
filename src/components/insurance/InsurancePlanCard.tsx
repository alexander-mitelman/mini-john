
import React, { useState } from "react";
import { InsurancePlanFeature } from "./InsurancePlanFeature";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
}

export const InsurancePlanCard: React.FC<InsurancePlanCardProps> = ({
  title,
  description,
  price = "",
  icon,
  features = [],
  isExpanded: initialExpanded = false,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // For long term disability with collapsible content
  if (title === "Long Term Disability") {
    return (
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className={`border-2 rounded-2xl ${isExpanded ? "border-[color:var(--Color,#4353FF)]" : "border-[rgba(67,83,255,0.4)]"} shadow-[0px_16px_60px_0px_rgba(162,148,253,0.40)] bg-white`}
      >
        <div className="flex w-full justify-between px-3.5 py-[19px]">
          <div className="flex gap-[15px]">
            <img
              src="/lovable-uploads/41ab950c-abc1-4bd0-9edf-50a79e9e8638.png"
              alt="Long Term Disability icon"
              className="aspect-[0.76] object-contain w-[41px] self-stretch shrink-0"
            />
            <div className="flex flex-col items-stretch mt-1.5">
              <h3 className="text-[rgba(67,83,255,1)] text-base font-bold leading-none font-nunito">
                {title}
              </h3>
              <p className="text-[#6C757D] text-xs font-normal leading-loose capitalize mt-[11px] font-nunito">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {!isExpanded && (
              <div className="text-[rgba(102,112,133,1)] text-lg font-extrabold leading-[22px] text-right mr-2">
                $28.21
                <span className="text-[12px] text-[rgba(181,179,179,1)]">
                  /week
                </span>
              </div>
            )}
            <CollapsibleTrigger className="p-1">
              <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? "transform rotate-180" : ""}`} />
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="px-3 pb-5">
          <div className="flex w-full max-w-full flex-col items-stretch">
            <p className="text-black text-sm font-normal leading-[23px] font-nunito">
              LTD Insurance protects your ability to earn an income with benefits
              that can be paid up to your normal retirement age. With Guaranteed
              Issue, you're enrolled as soon as you sign up.
            </p>
            <div className="flex flex-col text-xs text-[rgba(74,85,104,1)] font-bold text-center leading-loose mt-2">
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
        className={`bg-white flex gap-5 justify-between px-3.5 py-[19px] rounded-2xl border-[rgba(67,83,255,0.4)] border-solid border-2 ${className}`}
      >
        <div className="flex gap-[15px]">
          <img
            src="/lovable-uploads/a5306ff3-7263-4423-87ad-d4f5af4145cb.png"
            alt={`${title} icon`}
            className="aspect-[0.76] object-contain w-[41px] self-stretch shrink-0"
          />
          <div className="flex flex-col items-stretch mt-1.5">
            <h3 className="text-[rgba(67,83,255,1)] text-base font-bold leading-none font-nunito">
              {title}
            </h3>
            <p className="text-[#6C757D] text-xs font-normal leading-loose capitalize mt-[11px] font-nunito">
              {description}
            </p>
          </div>
        </div>
        {price && (
          <div className="text-[rgba(102,112,133,1)] text-lg font-extrabold leading-[22px] text-right">
            {price.split("/")[0]}
            <span className="text-[12px] text-[rgba(181,179,179,1)]">
              {`/${price.split("/")[1]}`}
            </span>
          </div>
        )}
      </article>
    );
  }

  // Compact version with icon for other plans
  if (icon) {
    return (
      <article
        className={`bg-white flex gap-5 justify-between px-3.5 py-[19px] rounded-2xl border-[rgba(67,83,255,0.4)] border-solid border-2 ${className}`}
      >
        <div className="flex gap-[15px]">
          <img
            src={icon}
            alt={`${title} icon`}
            className="aspect-[0.76] object-contain w-[41px] self-stretch shrink-0"
          />
          <div className="flex flex-col items-stretch mt-1.5">
            <h3 className="text-[rgba(67,83,255,1)] text-base font-bold leading-none font-nunito">
              {title}
            </h3>
            <p className="text-[#6C757D] text-xs font-normal leading-loose capitalize mt-[11px] font-nunito">
              {description}
            </p>
          </div>
        </div>
        {price && (
          <div className="text-[rgba(102,112,133,1)] text-lg font-extrabold leading-[22px] text-right">
            {price.split("/")[0]}
            <span className="text-[12px] text-[rgba(181,179,179,1)]">
              {`/${price.split("/")[1]}`}
            </span>
          </div>
        )}
      </article>
    );
  }

  // Compact version without icon
  return (
    <article
      className={`bg-white flex gap-5 justify-between px-[70px] py-[21px] rounded-2xl border-[rgba(67,83,255,0.4)] border-solid border-2 max-md:px-5 ${className}`}
    >
      <div className="mt-1">
        <h3 className="text-[rgba(67,83,255,1)] text-base font-bold leading-none max-md:mr-[5px] font-nunito">
          {title}
        </h3>
        <p className="text-[#6C757D] text-xs font-normal capitalize mt-[11px] font-nunito">
          {description}
        </p>
      </div>
      {price && (
        <div className="text-black text-lg font-extrabold leading-[22px] text-right">
          <span className="font-[900] text-[rgba(102,112,133,1)]">
            {price.split("/")[0]}
          </span>
          <span className="text-[12px] text-[rgba(181,179,179,1)]">
            {`/${price.split("/")[1]}`}
          </span>
        </div>
      )}
    </article>
  );
};
