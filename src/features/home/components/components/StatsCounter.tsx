import { FaBriefcase, FaGraduationCap } from "react-icons/fa";
import { IconType } from "react-icons";

interface StatsCounterProps {
  companyCount: number;
  eventsCount: number;
}

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

const StatsCounter = ({ companyCount, eventsCount }: StatsCounterProps) => {
  return (
    <>
      <StatItem
        positionClass="-right-1 -bottom-1"
        bgClass="bg-secondary"
        iconBgClass="bg-[#1d4259]"
        Icon={FaGraduationCap}
        labelCount={companyCount}
        labelText="Companies affliated"
        labelColorClass="text-blue-100"
      />
      <StatItem
        positionClass="-left-2 -top-2"
        bgClass="bg-primary"
        iconBgClass="bg-[#b33432]"
        Icon={FaBriefcase}
        labelCount={eventsCount}
        labelText="Completed Events"
        labelColorClass="text-red-100"
      />
    </>
  );
};

export default StatsCounter;
