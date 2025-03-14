
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
    <section className="shadow-[0px_16px_60px_0px_rgba(162,148,253,0.40)] bg-white flex w-full items-stretch px-4 py-3 rounded-2xl">
      <div className="flex-shrink-0 mr-3">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4bae8ab4ade46b5819ca1b2a1499e1e34f15ceba057bc8b1866f5f9b12d1b149?placeholderIfAbsent=true"
            alt="User profile"
          />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-[rgba(67,83,255,1)] font-bold">Your Information</div>
          <button
            onClick={() => onEdit()}
            className="text-[10px] text-[rgba(67,83,255,1)] whitespace-nowrap underline p-1 rounded-lg"
          >
            Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-[5px] text-[10px] text-black font-semibold">
          <div 
            onClick={() => onEdit('age')}
            className="bg-white shadow-[0px_15px_56px_rgba(162,148,253,0.4)] flex items-center justify-center h-7 px-2 py-0.5 rounded-xl border-transparent hover:border-[rgba(67,83,255,1)] border border-solid cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-[9px] text-[rgba(102,112,133,1)] mr-1">Age</span>
            <span>{age}</span>
          </div>
          <div 
            onClick={() => onEdit('zipCode')}
            className="bg-white shadow-[0px_15px_56px_rgba(162,148,253,0.4)] flex items-center justify-center h-7 px-2 py-0.5 rounded-xl border-transparent hover:border-[rgba(67,83,255,1)] border border-solid cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-[9px] text-[rgba(102,112,133,1)] mr-1">
              Zip
            </span>
            <span>{zipCode}</span>
          </div>
          <div 
            onClick={() => onEdit('income')}
            className="bg-white shadow-[0px_15px_56px_rgba(162,148,253,0.4)] flex items-center justify-center h-7 px-2 py-0.5 rounded-xl border-transparent hover:border-[rgba(67,83,255,1)] border border-solid cursor-pointer hover:bg-gray-50 transition-colors"
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
