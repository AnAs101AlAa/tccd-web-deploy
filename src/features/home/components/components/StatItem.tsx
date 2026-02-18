import type { IconType } from "react-icons";

interface StatItemProps {
  positionClass: string;
  bgClass: string;
  iconBgClass: string;
  Icon: IconType;
  labelCount: number;
  labelText: string;
  labelColorClass: string;
  shadowClass?: string;
}

const StatItem = ({
  positionClass,
  bgClass,
  iconBgClass,
  Icon,
  labelCount,
  labelText,
  labelColorClass,
  shadowClass = "shadow-xl",
}: StatItemProps) => (
  <div
    className={`absolute ${positionClass} z-20 rounded-xl ${bgClass} p-4 ${shadowClass}`}
  >
    <div className="flex items-center gap-2">
      <div className={`rounded-full ${iconBgClass} p-1`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <div className={`text-xs font-medium ${labelColorClass}`}>
          {labelText}
        </div>
        <div className="text-xl font-bold text-white">{labelCount}</div>
      </div>
    </div>
  </div>
);

export default StatItem;
