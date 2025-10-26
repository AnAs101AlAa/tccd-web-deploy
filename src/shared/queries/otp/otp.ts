
export const verifyOtp = async (otp: string): Promise<boolean> => {
  try {
    console.log("Sending OTP to API:", otp);
    // api vesification
    // const response = await fetch("/api/verify-otp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ otp }),
    // });
    // return response.ok;

    // testing
    return otp === "123456";
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};

export const resendOtp = async (): Promise<void> => {
  try {
    console.log("Resending OTP...");
    // api resend
    // await fetch("/api/resend-otp", { method: "POST" });
  } catch (error) {
    console.error("Error resending OTP:", error);
  }
};
