
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
      <div className="flex items-center justify-center p-2.5">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4bae8ab4ade46b5819ca1b2a1499e1e34f15ceba057bc8b1866f5f9b12d1b149?placeholderIfAbsent=true"
            alt="User profile"
          />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
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
        <div className="flex gap-[5px] text-[10px] text-black font-semibold text-center justify-center mt-2">
          <div 
            onClick={() => onEdit('age')}
            className="bg-white shadow-[0px_15px_56px_rgba(162,148,253,0.4)] border flex items-center justify-center h-7 px-2 py-0.5 rounded-xl border-[rgba(67,83,255,1)] border-solid cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-[9px] text-[rgba(102,112,133,1)] mr-1">Age</span>
            <span>{age}</span>
          </div>
          <div 
            onClick={() => onEdit('zipCode')}
            className="bg-white shadow-[0px_15px_56px_rgba(162,148,253,0.4)] border flex items-center justify-center h-7 px-2 py-0.5 rounded-xl border-[rgba(67,83,255,1)] border-solid cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-[9px] text-[rgba(102,112,133,1)] mr-1">
              ZipCode
            </span>
            <span>{zipCode}</span>
          </div>
          <div 
            onClick={() => onEdit('income')}
            className="bg-white shadow-[0px_15px_56px_rgba(162,148,253,0.4)] border flex items-center justify-center h-7 px-2 py-0.5 rounded-xl border-[rgba(67,83,255,1)] border-solid cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-[9px] text-[rgba(102,112,133,1)] mr-1">
              Income
            </span>
            <span>{income}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
