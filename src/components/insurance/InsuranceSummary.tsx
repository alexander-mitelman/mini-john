import React from "react";

interface InsuranceSummaryProps {
  weeklyPrice: string;
  hoursOfWork: string;
}

export const InsuranceSummary: React.FC<InsuranceSummaryProps> = ({
  weeklyPrice,
  hoursOfWork,
}) => {
  return (
    <section className="items-center shadow-[0px_16px_60px_0px_rgba(162,148,253,0.40)] bg-[linear-gradient(342deg,#4353FF_12.19%,var(--Color-2,#A294FD)_107.12%)] flex gap-[26px] text-[25px] text-white font-black text-center tracking-[0.27px] leading-[35px] px-4 py-[22px] rounded-[21.864px]">
      <div className="self-stretch flex min-w-60 w-[338px] items-center gap-[29px] my-auto">
        <div className="self-stretch min-w-60 w-[338px] my-auto">
          <span className="font-bold text-base text-white">
            For Less Than 1 Hour Of Work Per Week
          </span>
          <br />
          <span className="text-xl text-white">{weeklyPrice} / week</span>
          <br />
          <span className="font-semibold text-xs leading-[26px] text-white">
            That's less than{" "}
          </span>
          <span className="font-bold text-xs leading-[26px] text-white">
            {hoursOfWork} hours
          </span>
          <span className="font-semibold text-xs leading-[26px] text-white">
            {" "}
            of work at your pay rate
          </span>
        </div>
      </div>
    </section>
  );
};
