import { FiCheck } from "react-icons/fi";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

/**
 * StepIndicator Component
 * 
 * Visual indicator for multi-step forms showing progress
 */
export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-secondary text-white"
                        : isCurrent
                        ? "bg-secondary text-white ring-4 ring-muted-secondary/20"
                        : "bg-gray-200 text-gray-500"
                    }
                  `}
                >
                  {isCompleted ? <FiCheck className="w-5 h-5" /> : stepNumber}
                </div>
                <p
                  className={`
                    mt-2 text-xs font-medium hidden sm:block
                    ${isCurrent ? "text-secondary" : "text-gray-500"}
                  `}
                >
                  {step}
                </p>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2">
                  <div
                    className={`
                      h-full transition-all duration-300
                      ${isCompleted ? "bg-secondary" : "bg-gray-200"}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
