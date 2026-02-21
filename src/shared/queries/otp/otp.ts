
import { systemApi } from "../AxoisInstance";
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

export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
  try {
    const { data } = await systemApi.post<OtpApiResponse>("/v1/Auth/verify-otp", {
      email,
      otp,
    });
    return data.success;
  } catch (error) {
    throw new Error(getVerifyOtpErrorMessage(error));
  }
};

export const resendOtp = async (email: string): Promise<void> => {
  try {
    await systemApi.post("/v1/Auth/forgot-password", { email });
  } catch (error) {
    throw new Error(
      "Failed to resend the code. Please check your connection and try again."
    );
  }
};
