import React, { type ReactNode } from "react";

interface FormFieldWithErrorProps {
    children: ReactNode;
    error?: string;
}

const FormFieldWithError: React.FC<FormFieldWithErrorProps> = ({ children, error }) => {
    return (
        <div>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default FormFieldWithError;
