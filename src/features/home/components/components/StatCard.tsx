import React, { type ReactNode } from "react";

// StatCard component for displaying key features with icons
// Updated to accept a ReactNode for the icon/number, a title, and description text
interface StatCardProps {
  number: ReactNode;
  title?: string;
  text: string;
}

export const StatCard: React.FC<StatCardProps> = ({ number, title, text }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 text-center h-[200px] md:h-[260px] lg:h-[320px]">
      {/* Icon or number */}
      <div className="mb-3 md:mb-4">{number}</div>

      {/* Title */}
      {title && (
        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{title}</h3>
      )}

      {/* Description text */}
      <p className="text-xs md:text-sm lg:text-base text-blue-50 max-w-[350px]">
        {text}
      </p>

      {/* Visual separator */}
      <div className="mt-3 md:mt-4 h-1 w-8 md:w-10 rounded-full bg-white/30"></div>
    </div>
  );
};
