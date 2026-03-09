import { useMutation } from "@tanstack/react-query";
import { ticketsApi, type QRScanPayload } from "./ticketsApi";

export const qrScannerKeys = {
  all: ["qr-scanner"] as const,
  validate: () => [...qrScannerKeys.all, "scan"] as const,
};

export const useScanQRCode = () => {
  return useMutation({
    mutationFn: (payload: QRScanPayload) =>
      ticketsApi.scanQRCode(payload),
  });
};
