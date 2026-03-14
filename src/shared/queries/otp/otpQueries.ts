import { useMutation } from "@tanstack/react-query";
import { systemApi } from "../AxoisInstance";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

interface OtpApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: string;
}

const getVerifyOtpErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<OtpApiResponse>;

  if (!axiosError.response) {
    return "Unable to connect. Please check your internet connection and try again.";
  }

  const { status } = axiosError.response;

  if (status === 400) {
    return "The code you entered is incorrect or has expired. Please double-check and try again.";
  }
  if (status === 500) {
    return "Something went wrong on our end. Please try again in a moment.";
  }

  return "Verification failed. Please try again.";
};

const getResendOtpErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<OtpApiResponse>;

  if (!axiosError.response) {
    return "Unable to connect. Please check your internet connection and try again.";
  }

  const { status } = axiosError.response;

  if (status === 400) {
    return "Invalid email address. Please check and try again.";
  }
  if (status === 429) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  if (status === 500) {
    return "Something went wrong on our end. Please try again in a moment.";
  }

  return "Failed to resend the code. Please check your connection and try again.";
};

export const otpKeys = {
  all: ["otp"] as const,
  verify: () => [...otpKeys.all, "verify"] as const,
  resend: () => [...otpKeys.all, "resend"] as const,
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }): Promise<boolean> => {
      try {
        const { data } = await systemApi.post<OtpApiResponse>("/v1/Auth/verify-otp", {
          email,
          otp,
        });
        return data.success;
      } catch (error) {
        throw new Error(getVerifyOtpErrorMessage(error));
      }
    },
    onSuccess: () => {
      toast.success("OTP verified successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      try {
        await systemApi.post("/v1/Auth/forgot-password", { email });
      } catch (error) {
        throw new Error(getResendOtpErrorMessage(error));
      }
    },
    onSuccess: () => {
      toast.success("OTP resent to your email!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
