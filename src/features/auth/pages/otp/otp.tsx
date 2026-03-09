import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useVerifyOtp, useResendOtp } from "../../../../shared/queries/otp/otpQueries";
import toast from "react-hot-toast";
import { Button } from "tccd-ui";
import { AiOutlineArrowLeft, AiOutlineLoading3Quarters } from "react-icons/ai";

const OTPPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isShaking, setIsShaking] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // TanStack mutations
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  useEffect(() => {
    // Redirect if no email in state
    if (!email) {
      toast.error("Please request a password reset first");
      navigate("/forgot-password");
      return;
    }
    inputsRef.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (rawValue: string, index: number) => {
    const value = rawValue.slice(-1);

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleConfirmClick();
    }
  };

  const handleConfirmClick = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      return;
    }

    try {
      const success = await verifyOtpMutation.mutateAsync({ email, otp: otpValue });
      if (success) {
        navigate("/reset-password");
      } else {
        setOtp(Array(6).fill(""));
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
        inputsRef.current[0]?.focus();
      }
    } catch {
      setOtp(Array(6).fill(""));
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      inputsRef.current[0]?.focus();
    }
  };

  const handleResendClick = async () => {
    try {
      await resendOtpMutation.mutateAsync(email);
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } catch {
      // Error is already handled by mutation onError
      setOtp(Array(6).fill(""));
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <>
      <style>
        {`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.3s ease-in-out; }
        `}
      </style>

      <main className="min-h-screen bg-linear-to-b from-white via-white to-[#f8f6f1] text-[#121212]">
        <div className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 py-16">
          <section
            className={`w-full max-w-md rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur transition-all ${
              isShaking ? "shake" : ""
            }`}
            aria-labelledby="otp-title"
          >
            <header className="w-full flex flex-col gap-3 text-center items-center">
              <img src="https://res.cloudinary.com/do0yekzmf/image/upload/v1772147018/TCCD_logo_ucw7ki.svg" width={100} alt="TCCD Logo" />
              <h2 id="otp-title" className="text-2xl font-bold text-[#3B3D41]">
                Verify Your Email
              </h2>
              <p className="text-sm text-[#5E6064]">
                We've sent a 6-digit code to
              </p>
              <p className="text-sm font-semibold text-secondary">{email}</p>
            </header>

            <div className="mt-8 space-y-6">
              {/* OTP Input Fields */}
              <div>
                <label className="block text-sm font-medium text-[#5E6064] mb-3 text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el: HTMLInputElement | null) => {
                        inputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg 
                                 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none 
                                 transition-all bg-white text-[#3B3D41]"
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                buttonText={verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
                buttonIcon={
                  verifyOtpMutation.isPending ? (
                    <AiOutlineLoading3Quarters
                      className="animate-spin"
                      size={18}
                    />
                  ) : undefined
                }
                onClick={handleConfirmClick}
                type="primary"
                disabled={verifyOtpMutation.isPending || !isOtpComplete}
                loading={verifyOtpMutation.isPending}
                width="full"
              />

              {/* Resend Button */}
              <div className="text-center">
                <p className="text-sm text-[#5E6064] mb-2">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendClick}
                  disabled={resendOtpMutation.isPending}
                  className={`text-sm font-semibold transition-colors
                             ${
                               resendOtpMutation.isPending
                                 ? "text-gray-400 cursor-not-allowed"
                                 : "text-secondary hover:text-secondary/80 hover:underline"
                             }`}
                >
                  {resendOtpMutation.isPending ? "Resending..." : "Resend OTP"}
                </button>
              </div>

              {/* Back to Login Link */}
              <div className="text-center pt-2 border-t border-gray-100">
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#5E6064] hover:text-secondary transition-colors inline-flex items-center gap-1"
                >
                    <AiOutlineArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export { OTPPage };
