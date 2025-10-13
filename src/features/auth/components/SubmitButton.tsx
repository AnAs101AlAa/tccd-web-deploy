import type { ReactNode } from "react";
import { Button } from "tccd-ui";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

/**
 * Submit Button Props
 */
export interface SubmitButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "primary" | "secondary" | "tertiary" | "danger" | "ghost" | "basic";
}

/**
 * SubmitButton Component
 *
 * Wrapper around tccd-ui Button with loading state for auth forms
 *
 * FEATURES:
 * - Uses tccd-ui Button component
 * - Loading state with animated icon from react-icons
 * - Disabled state handling
 * - Consistent styling
 * - Accessible
 *
 * @example
 * <SubmitButton isLoading={isLoggingIn} loadingText="Signing in...">
 *   Sign In
 * </SubmitButton>
 */
export const SubmitButton = ({
  isLoading = false,
  loadingText = "Loading...",
  children,
  disabled = false,
  onClick = () => {},
  type = "primary",
}: SubmitButtonProps) => {
  return (
    <Button
      buttonText={isLoading ? loadingText : (children as string)}
      buttonIcon={
        isLoading ? (
          <AiOutlineLoading3Quarters className="animate-spin" size={18} />
        ) : undefined
      }
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      loading={isLoading}
      width="full"
    />
  );
};
