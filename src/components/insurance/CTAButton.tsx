
import React from "react";

interface CTAButtonProps {
  text: string;
  onClick?: () => void;
}

export const CTAButton: React.FC<CTAButtonProps> = ({
  text,
  onClick = () => {},
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full justify-center items-center shadow-[0px_16px_60px_0px_rgba(67,83,255,0.40)] bg-white flex gap-[7px] text-base font-extrabold capitalize leading-loose px-[34px] py-[13px] rounded-[38.814px] border-[2.477px] border-solid border-primary hover:bg-primary hover:text-white transition-all duration-300 group"
    >
      <span className="bg-clip-text bg-primary text-transparent self-stretch my-auto group-hover:text-white transition-colors">
        {text}
      </span>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0c25d284680a9e60708dbe93107025cc030001ffa4c15a17634725478aabc02?placeholderIfAbsent=true"
        alt="Arrow right"
        className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto transition-transform group-hover:translate-x-1"
      />
    </button>
  );
};
