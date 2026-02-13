import type { Control } from "react-hook-form";
import type { AccountTypeFormData } from "../../schemas";
import { FiUsers, /*FiBriefcase, FiBook*/ } from "react-icons/fi";

interface AccountTypeStepProps {
  control: Control<AccountTypeFormData>;
  selectedType: string | undefined;
  onSelect: (type: "student" | "company_representative" | "academic") => void;
}

/**
 * Step 1: Account Type Selection
 */
export const AccountTypeStep = ({ selectedType, onSelect }: AccountTypeStepProps) => {
  const accountTypes = [
    {
      id: "student" as const,
      title: "Student",
      description: "For university students looking to connect and grow",
      icon: FiUsers,
    },
    // {
    //   id: "company_representative" as const,
    //   title: "Company Representative",
    //   description: "For companies seeking talented students",
    //   icon: FiBriefcase,
    // },
    // {
    //   id: "academic" as const,
    //   title: "Academic",
    //   description: "For teaching assistants and doctors",
    //   icon: FiBook,
    // },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-[#3B3D41] mb-2">
          Choose Your Account Type
        </h3>
        <p className="text-sm text-[#636569]">
          Select the type that best describes you
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {accountTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect(type.id)}
              className={`
                p-6 rounded-xl border-2 transition-all duration-200
                flex items-start gap-4 text-left
                ${
                  isSelected
                    ? "border-secondary bg-muted-secondary/10 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }
              `}
            >
              <div
                className={`
                  w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                  ${
                    isSelected
                      ? "bg-secondary text-white"
                      : "bg-gray-100 text-gray-500"
                  }
                `}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#3B3D41] mb-1">
                  {type.title}
                </h4>
                <p className="text-sm text-[#636569]">{type.description}</p>
              </div>
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1
                  ${
                    isSelected
                      ? "border-secondary bg-secondary"
                      : "border-gray-300"
                  }
                `}
              >
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
