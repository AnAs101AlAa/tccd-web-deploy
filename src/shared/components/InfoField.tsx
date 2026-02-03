import React from "react";
import type { IconType } from "react-icons";

interface InfoFieldProps {
  icon: IconType;
  label: string;
  value: string;
  truncate?: boolean;
}

const InfoField: React.FC<InfoFieldProps> = ({
  icon: Icon,
  label,
  value,
  truncate = false,
}) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-200/50 rounded-lg">
      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
      <div className={truncate ? "overflow-hidden" : ""}>
        <p className="text-xs text-label">{label}</p>
        <p
          className={`text-sm font-medium text-contrast ${
            truncate ? "truncate" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default InfoField;
