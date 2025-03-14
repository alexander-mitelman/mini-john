
import React from "react";

interface UserInfoCardProps {
  age: number;
  zipCode: string;
  income: string;
  onEdit?: (field?: 'age' | 'zipCode' | 'income') => void;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
  age,
  zipCode,
  income,
  onEdit = () => {},
}) => {
  return (
    <section className="shadow-[0px_16px_60px_0px_rgba(162,148,253,0.40)] bg-white flex w-full items-stretch gap-1.5 px-[18px] py-[13px] rounded-2xl">
      <div className="flex items-center gap-2.5 p-2.5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/4bae8ab4ade46b5819ca1b2a1499e1e34f15ceba057bc8b1866f5f9b12d1b149?placeholderIfAbsent=true"
          alt="User profile"
          className="aspect-[1] object-contain w-[55px] self-stretch my-auto"
        />
      </div>
      <div className="grow shrink-0 basis-0 w-fit">
        <div className="flex w-full items-stretch gap-5 text-[rgba(67,83,255,1)] font-bold justify-between">
          <div className="text-sm mt-3">Your Information</div>
          <button
            onClick={() => onEdit()}
            className="self-stretch gap-2.5 text-[10px] whitespace-nowrap underline p-2 rounded-lg"
          >
            Edit
          </button>
        </div>
        <div className="flex gap-[7px] text-[10px] text-black font-semibold text-center leading-[3] justify-center mt-3">
          <div>
            <div 
              onClick={() => onEdit('age')}
              className="self-stretch bg-white shadow-[0px_15px_56px_rgba(162,148,253,0.4)] border min-h-[29px] gap-[19px] px-3 py-[11px] rounded-xl border-[rgba(67,83,255,1)] border-solid cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-[9px] text-[rgba(102,112,133,1)]">Age</span>{" "}
              {age}
            </div>
          </div>
          <div className="flex flex-col items-stretch justify-center">
            <div 
              onClick={() => onEdit('zipCode')}
              className="self-stretch bg-white border min-h-[29px] gap-[19px] px-[7px] py-[11px] rounded-xl border-[rgba(0,0,0,0.2)] border-solid cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="text-[9px] text-[rgba(102,112,133,1)]">
                ZipCode
              </span>{" "}
              {zipCode}
            </div>
          </div>
          <div 
            onClick={() => onEdit('income')}
            className="self-stretch bg-white border min-h-[29px] gap-[19px] px-[7px] py-[11px] rounded-xl border-[rgba(0,0,0,0.2)] border-solid cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-[9px] text-[rgba(102,112,133,1)]">
              Income
            </span>{" "}
            {income}
          </div>
        </div>
      </div>
    </section>
  );
};
