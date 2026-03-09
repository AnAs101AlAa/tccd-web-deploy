
import { systemApi } from "../AxoisInstance";

interface OtpApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: string;
}

export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
  const { data } = await systemApi.post<OtpApiResponse>("/v1/Auth/verify-otp", {
    email,
    otp,
  });
  return data.success;
};

export const resendOtp = async (email: string): Promise<void> => {
    await systemApi.post("/v1/Auth/forgot-password", { email });
};
