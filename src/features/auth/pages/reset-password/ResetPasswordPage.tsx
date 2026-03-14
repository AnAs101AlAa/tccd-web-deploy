import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { resetPasswordSchema } from "../../schemas";
import type { ResetPasswordFormData } from "../../schemas";
import { FormInput, SubmitButton } from "../../components";
import { useResetPassword } from "../../../../shared/queries/auth/authQueries";
import { AiOutlineArrowLeft } from "react-icons/ai";

/**
 * ResetPasswordPage Component
 *
 * Allows users to reset their password after OTP verification.
 * User enters the new password and confirms it.
 *
 * FEATURES:
 * - Password validation using Zod schema (min 8 chars, uppercase, lowercase, number, special char)
 * - Password confirmation matching validation
 * - Real-time form validation
 * - Consistent UI with other auth pages
 * - Uses tccd-ui components
 * - Requires email and OTP from previous pages
 *
 * @example
 * // Route: /reset-password
 * // State passed from OTP page: { email, otp }
 * <ResetPasswordPage />
 */
export const ResetPasswordPage = () => {
  const navigate = useNavigate();

  // TanStack mutation
  const resetPasswordMutation = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync({
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      navigate("/login");
    } catch {
      // Error is already handled by mutation's onError
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-white to-[#f8f6f1] text-[#121212]">
      <div className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 py-16">
        <section
          className="w-full max-w-md rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur"
          aria-labelledby="reset-password-title"
        >
          <header className="w-full flex flex-col space-y-3 text-center items-center">
            <img
              src="https://res.cloudinary.com/do0yekzmf/image/upload/v1772147018/TCCD_logo_ucw7ki.svg"
              width={100}
              alt="TCCD Logo"
            />
            <h2 id="reset-password-title" className="text-2xl mb-0 font-bold text-[#3B3D41]">
              Create New Password
            </h2>
            <p className="text-sm text-[#5E6064]">
              Enter your new password below
            </p>
          </header>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Password Input */}
            <FormInput
              name="password"
              control={control}
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              helperText="At least 8 characters with uppercase, lowercase, number, and special character"
            />

            {/* Confirm Password Input */}
            <FormInput
              name="confirmPassword"
              control={control}
              label="Confirm Password"
              type="password"
              placeholder="Confirm your new password"
            />

            {/* Submit Button */}
            <SubmitButton
              isLoading={resetPasswordMutation.isPending}
              loadingText="Resetting Password..."
              disabled={!isValid || resetPasswordMutation.isPending}
            >
              Reset Password
            </SubmitButton>

            {/* Back to Login Link */}
            <div className="text-center pt-4 border-t border-gray-100">
              <Link
                to="/login"
                className="text-sm font-medium text-[#5E6064] hover:text-secondary transition-colors inline-flex items-center gap-1"
              >
                <AiOutlineArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};
