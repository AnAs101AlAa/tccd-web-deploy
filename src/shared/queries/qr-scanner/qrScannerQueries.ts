import { useMutation } from "@tanstack/react-query";
import { qrScannerApi, type ValidateQRPayload } from "./qrScannerApi";

export const qrScannerKeys = {
  all: ["qr-scanner"] as const,
  validate: () => [...qrScannerKeys.all, "validate"] as const,
};

export const useValidateQRCode = () => {
  return useMutation({
    mutationFn: (payload: ValidateQRPayload) => qrScannerApi.validateQRCode(payload),
  });
};
