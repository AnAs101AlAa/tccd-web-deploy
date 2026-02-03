import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { InputField, PasswordField } from "tccd-ui";

/**
 * Form Input Component Props
 */
export interface FormInputProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  helperText?: string;
  placeholder?: string;
  // These props are accepted but not used by tccd-ui InputField
  // Keep them for API consistency and future use
  type?: string;
  autoComplete?: string;
  id?: string;
  dir?: string;
  disabled?: boolean;
}

/**
 * FormInput Component
 *
 * Wrapper around tccd-ui InputField with react-hook-form Controller integration.
 * Uses Controller for proper controlled component behavior.
 *
 * FEATURES:
 * - Uses tccd-ui InputField component
 * - Proper controlled component with Controller
 * - Accessible with proper labels
 * - Error state styling
 * - Helper text support
 *
 * @example
 * <FormInput
 *   name="email"
 *   control={control}
 *   label="Email"
 *   type="email"
 *   error={errors.email}
 * />
 */
export function FormInput<T extends FieldValues = FieldValues>({
  name,
  control,
  label,
  helperText,
  placeholder = "",
  id,
  type,
}: // Unused props for now, but kept in interface for API consistency
// autoComplete, dir, disabled
FormInputProps<T>) {
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, "-");
  const isPasswordField = type === "password";

  return (
    <div className="w-full">
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <>
              {isPasswordField ? (
                <div>
                  <PasswordField
                    value={field.value || ""}
                    onChange={field.onChange}
                    error={error?.message}
                    label={label}
                    labelClassName="text-[13px] text-contrast/60"
                    id={name}
                  />
                </div>
              ) : (
                <InputField
                  labelClassName="text-[13px] text-contrast/60"
                  label={label}
                  id={inputId}
                  value={field.value || ""}
                  placeholder={placeholder}
                  onChange={field.onChange}
                  error={error?.message}
                />
              )}

              {/* Display error message */}
              {error && (
                <p
                  id={`${inputId}-error`}
                  className="mt-1 text-sm text-red-600"
                  role="alert"
                >
                  {error.message}
                </p>
              )}

              {/* Display helper text when no error */}
              {!error && helperText && (
                <p
                  id={`${inputId}-helper`}
                  className="mt-1 text-sm text-gray-500"
                >
                  {helperText}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}

FormInput.displayName = "FormInput";
