import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate } from "react-router-dom";
import { signupSchema } from "../../schemas";
import type { SignupFormData } from "../../schemas";
import { useAuth } from "../../hooks";
import { FormInput, SubmitButton } from "../../components";
import tccdLogo from "@/assets/TCCD_logo.svg";

export const SignupPage = () => {
  const { handleSignup, isSigningUp, isAuthenticated } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      englishFullName: "",
      arabicFullName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: SignupFormData) => {
    await handleSignup(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-[#f8f6f1] text-[#121212]">
      <form className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 pb-16">
        <section
          className="w-full max-w-md rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur"
          aria-labelledby="signup-title"
        >
          {/* Header */}
          <header className="w-full flex flex-col gap-3 text-center items-center">
            <img src={tccdLogo} width={100} alt="tccd-logo" />
            <h2
              id="signup-title"
              className="text-2xl font-bold  text-[#3B3D41]"
            >
              Create your account
            </h2>
            <p className="text-sm text-[#5E6064]">
              Join the TCCD Portal to get started
            </p>
          </header>

          {/* Form fields */}
          <div className="space-y-5 mt-6">
            {/* Email */}
            <FormInput
              name="email"
              control={control}
              label="Email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
            />

            {/* Full names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="englishFullName"
                control={control}
                label="Full Name (English)"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
              />
              <FormInput
                name="arabicFullName"
                control={control}
                label="Full Name (Arabic)"
                type="text"
                placeholder="محمد علي"
                autoComplete="name"
                dir="rtl"
              />
            </div>

            {/* Phone */}
            <FormInput
              name="phoneNumber"
              control={control}
              label="Phone Number"
              type="tel"
              placeholder="+201234567890"
              autoComplete="tel"
            />

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="password"
                control={control}
                label="Password"
                type="password"
                placeholder="Enter a strong password"
                autoComplete="new-password"
              />
              <FormInput
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            </div>

            {/* Submit */}
            <SubmitButton
              isLoading={isSigningUp}
              loadingText="Creating account..."
              disabled={!isValid}
              onClick={handleSubmit(onSubmit)}
            >
              Create Account
            </SubmitButton>
          </div>

          {/* Footer */}
          <footer className="pt-8">
            <p className="text-center text-sm text-[#A5A9B2]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-secondary font-semibold hover:underline hover:text-[#2a2b2f] transition-colors"
              >
                Log in
              </Link>
            </p>
          </footer>
        </section>
      </form>
    </main>
  );
};
