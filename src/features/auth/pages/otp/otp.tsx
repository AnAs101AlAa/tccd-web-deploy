import React, { useEffect, useRef, useState } from "react";
import { verifyOtp, resendOtp } from "../../../../shared/queries/otp/otp";

const OTP: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      handleConfirmClick();
    }
  };

  const handleConfirmClick = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) return;

    setIsLoading(true);
    const success = await verifyOtp(otpValue);
    setIsLoading(false);

    if (!success) {
      setOtp(Array(6).fill(""));
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      inputsRef.current[0]?.focus();
    }
  };

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

      <div
        className={`flex flex-col items-center justify-center min-h-screen px-4 transition-all ${
          isShaking ? "shake" : ""
        }`}
        style={{
          background: `linear-gradient(135deg, #44697E 30%, #CD3A38 )`
        }}
      >
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-bold mb-3 text-[#CD3A38] text-center">
            Enter Verification Code
          </h1>
          <p className="text-sm md:text-base text-center mb-4 text-[#295E7E]">
            Please enter the 6-digit code sent to your email
          </p>

          <div className="flex justify-center gap-2 mb-4">
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
                className="w-9 h-9 md:w-11 md:h-11 text-center text-lg font-semibold border-2 border-[#ffffff] rounded-lg 
                           focus:border-[#CD3A38] focus:outline-none transition-all bg-white shadow-sm text-[#295E7E]"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-2">
            <button
              onClick={handleConfirmClick}
              disabled={isLoading}
              className={`px-4 py-2 bg-[#295E7E] text-white font-semibold rounded-lg 
                         ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-[0_0_12px_rgba(41,94,126,0.6)]"} 
                         active:scale-95 transition-all shadow-md`}
            >
              {isLoading ? "Checking..." : "Confirm"}
            </button>

            <button
              onClick={resendOtp}
              className="px-4 py-2 bg-[#CD3A38] text-white font-semibold rounded-lg 
                         hover:shadow-[0_0_12px_rgba(205,58,56,0.6)] active:scale-95 transition-all shadow-md"
            >
              Resend
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;
