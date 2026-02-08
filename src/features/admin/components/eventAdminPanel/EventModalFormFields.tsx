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
