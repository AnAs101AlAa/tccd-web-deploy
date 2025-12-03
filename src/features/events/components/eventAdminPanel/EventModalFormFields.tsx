import React from "react";

interface FormFieldWithErrorProps {
  error?: string;
  children: React.ReactNode;
}

export const FormFieldWithError: React.FC<FormFieldWithErrorProps> = ({
  error,
  children,
}) => {
  return (
    <div className="space-y-1">
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface NumberInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  min?: string;
  max?: string;
}

export const NumberInputField: React.FC<NumberInputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  min,
  max,
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-contrast">
        {label}
      </label>
      <input
        type="number"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
    </div>
  );
};

interface DateTimeInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const DateTimeInputField: React.FC<DateTimeInputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-contrast">
        {label}
      </label>
      <input
        type="datetime-local"
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
    </div>
  );
};
