import { useState, useEffect } from "react";

type ToggleProps = {
  label?: string;
  initial?: boolean;
  disabled?: boolean;
  onToggle?: (state: boolean) => void;
};

export default function Toggle({ label, initial = false, disabled = false, onToggle }: ToggleProps) {
  const [enabled, setEnabled] = useState(initial);

  useEffect(() => {
    setEnabled(initial);
  }, [initial]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Just so it doesn't open the card when clicked
    if (disabled) return;
    
    const newState = !enabled;
    setEnabled(newState);
    onToggle?.(newState);
  };

  return (
    <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
      {label && <span className="text-sm font-medium">{label}</span>}
      <button
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-all ${
          enabled ? "bg-green-500" : "bg-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
