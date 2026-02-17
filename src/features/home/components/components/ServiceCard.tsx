import React, { type ReactNode } from "react";

// ServiceCard component for displaying individual services
// Accepts an icon component, title and description as props
interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 md:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#295E7E] h-[200px] md:h-[240px] lg:h-[300px] flex flex-col">
      <div className="mb-3 md:mb-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-blue-50 text-[#295E7E] group-hover:bg-blue-100">
        {/* Icon passed as prop */}
        {icon}
      </div>
      <h3 className="mb-1 md:mb-2 text-lg md:text-xl font-bold text-blue-950">
        {title}
      </h3>
      <p className="text-sm md:text-base text-gray-500 flex-1 overflow-y-auto">
        {description}
      </p>

      {/* hover animation */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#295E7E] to-[#cd3a38] transition-all duration-300 group-hover:w-full"></div>
    </div>
  );
};
