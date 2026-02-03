import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate } from "react-router-dom";
import { forgotPasswordSchema } from "../../schemas";
import type { ForgotPasswordFormData } from "../../schemas";
import { useAuth } from "../../hooks";
import { FormInput, SubmitButton } from "../../components";
import tccdLogo from "@/assets/TCCD_logo.svg";

/**
 * ForgotPasswordPage Component
 * 
 * Allows users to request a password reset by entering their email address.
 * Sends an OTP to the provided email for verification.
 * 
 * FEATURES:
 * - Email validation using Zod schema
 * - Real-time form validation
 * - Error handling for invalid emails
 * - Consistent UI with login and signup pages
 * - Uses tccd-ui components
 * - Navigates to OTP verification page on success
 * 
 * @example
 * // Route: /forgot-password
 * <ForgotPasswordPage />
 */
export const ForgotPasswordPage = () => {
  const { handleForgotPassword, isSendingResetEmail, isAuthenticated } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange", // Validate on change for better UX
    reValidateMode: "onChange", // Re-validate on every change
    defaultValues: {
      email: "",
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await handleForgotPassword(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-[#f8f6f1] text-[#121212]">
      <form 
        className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 pb-16"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section
          className="w-full max-w-md rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur"
          aria-labelledby="forgot-password-title"
        >
          <header className="w-full flex flex-col gap-3 text-center items-center">
            <img src={tccdLogo} width={100} alt="TCCD Logo" />
            <h2 id="forgot-password-title" className="text-2xl font-bold text-[#3B3D41]">
              Reset Password
            </h2>
            <p className="text-sm text-[#5E6064]">
              Enter your email address and we'll send you an OTP to reset your password
            </p>
          </header>

          <div className="space-y-5 mt-8">
            {/* Email Input */}
            <FormInput
              name="email"
              control={control}
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
            />

            {/* Submit Button */}
            <SubmitButton
              isLoading={isSendingResetEmail}
              loadingText="Sending OTP..."
              disabled={!isValid}
            >
              Send OTP
            </SubmitButton>

            {/* Back to Login Link */}
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors inline-flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Login
              </Link>
            </div>
          </div>

          <footer className="px-10 pb-10 pt-8">
            <p className="text-center text-sm text-[#A5A9B2]">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-secondary font-semibold hover:underline hover:text-[#2a2b2f] transition-colors"
              >
                Log in
              </Link>{" "}
              or{" "}
              <Link
                to="/sign-up"
                className="text-secondary font-semibold hover:underline hover:text-[#2a2b2f] transition-colors"
              >
                sign up
              </Link>{" "}
              to create a new account.
            </p>
          </footer>
        </section>
      </form>
    </main>
  );
};
