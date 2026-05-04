import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  growth: number;
  colorClass: "orange" | "green" | "yellow" | "blue";
}

const iconBg: Record<string, string> = {
  orange: "bg-orange-50 text-[#e8590c]",
  green: "bg-green-50 text-green-600",
  yellow: "bg-amber-50 text-amber-500",
  blue: "bg-blue-50 text-blue-600",
};

const StatCard = ({ icon, label, value, growth, colorClass }: StatCardProps) => {
  const isPositive = growth >= 0;

  return (
    <div className="flex items-center gap-3.5 bg-white rounded-[14px] px-[22px] py-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${iconBg[colorClass]}`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[12.5px] text-gray-500 font-medium mb-0.5">
          {label}
        </span>
        <span className="text-[26px] font-bold text-gray-800 leading-tight">
          {value}
        </span>
        <span
          className={`text-xs font-semibold mt-0.5 ${
            isPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(Math.round(growth))}%
        </span>
      </div>
    </div>
  );
};

export default StatCard;
