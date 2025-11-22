import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate } from "react-router-dom";
import { loginSchema } from "../../schemas";
import type { LoginFormData } from "../../schemas";
import { useAuth } from "../../hooks";
import { FormInput, SubmitButton } from "../../components";
import tccdLogo from "@/assets/TCCD_logo.svg";

export const LoginPage = () => {
  const { handleLogin, isLoggingIn, isAuthenticated } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validate on change for better UX
    reValidateMode: "onChange", // Re-validate on every change
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    await handleLogin(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-[#f8f6f1] text-[#121212]">
      <div className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 pb-16">
        <section
          className="w-full max-w-md rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur"
          aria-labelledby="login-title"
        >
          <header className="w-full flex flex-col gap-3 text-center items-center">
            <img src={tccdLogo} width={100} alt="azha-logo" />
            <h2 className="text-2xl font-bold text-[#3B3D41]">Welcome Back</h2>
          </header>

          <div className="space-y-5 mt-5">
            {/* Email */}
            <div className="space-y-2">
              <h2 className="text-[#5E6064] text-center font-bold mb-5">
                Login to your account
              </h2>
              {/* Email Input */}
              <FormInput
                name="email"
                control={control}
                label="Email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
              />

              {/* Password Input */}
              <FormInput
                name="password"
                control={control}
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {/* Forgot Password Link */}
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-[#515151] hover:text-[#3B3D41] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <SubmitButton
                isLoading={isLoggingIn}
                loadingText="Logging in..."
                disabled={!isValid}
                onClick={handleSubmit(onSubmit)}
              >
                Login
              </SubmitButton>
            </div>
          </div>
          <footer className="px-10 pb-10 pt-5">
            <p className="text-center text-sm text-[#A5A9B2]">
              Welcome to the TCCD Portal! <br /> Please log in to access your
              account or{" "}
              <Link
                to="/sign-up"
                className="text-secondary font-semibold hover:underline hover:text-[#2a2b2f] transition-colors"
              >
                sign up
              </Link>{" "}
              to join our community.
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
};
