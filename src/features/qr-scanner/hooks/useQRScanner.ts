import { useState } from "react";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { QRScanResult, QRScanError } from "@/shared/types";
import { useValidateQRCode } from "@/shared/queries/qr-scanner";
import toast from "react-hot-toast";

export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [error, setError] = useState<QRScanError | null>(null);

  const validateQRCode = useValidateQRCode();

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length === 0) return;

    setIsScanning(false);
    setIsVerifying(true);
    setError(null);

    try {
      // Parse QR code data
      const qrData = JSON.parse(detectedCodes[0].rawValue);
      
      if (!qrData.userId || !qrData.eventId) {
        throw new Error("Invalid QR code format");
      }

      // Validate with backend
      const result = await validateQRCode.mutateAsync({
        userId: qrData.userId,
        eventId: qrData.eventId,
      });

      setScanResult(result);
      toast.success("QR code scanned successfully!");
    } catch (err: unknown) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      toast.error(errorMessage.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleScanError = (err: unknown) => {
    console.error("QR Scanner error:", err);
    const errorMessage: QRScanError = {
      type: "camera_error",
      message: "Unable to access camera. Please check your permissions.",
    };
    setError(errorMessage);
    setIsScanning(false);
  };

  const reset = () => {
    setIsScanning(true);
    setIsVerifying(false);
    setScanResult(null);
    setError(null);
  };

  return {
    isScanning,
    isVerifying,
    scanResult,
    error,
    handleScan,
    handleScanError,
    reset,
  };
}

function handleError(err: unknown): QRScanError {
  // Handle JSON parse errors
  if (err instanceof SyntaxError) {
    return {
      type: "invalid_qr",
      message: "Invalid QR code format. Please scan a valid event QR code.",
    };
  }

  // Handle API errors
  if (err && typeof err === "object" && "response" in err) {
    const response = (err as { response?: { status?: number; data?: { message?: string } } }).response;
    
    if (response?.status === 403) {
      const message = response.data?.message || "";
      
      if (message.toLowerCase().includes("not started")) {
        return {
          type: "event_not_started",
          message: "This event has not started yet. Please try again later.",
        };
      }
      
      if (message.toLowerCase().includes("ended")) {
        return {
          type: "event_ended",
          message: "This event has already ended.",
        };
      }
    }

    if (response?.status === 404) {
      return {
        type: "invalid_qr",
        message: "User or event not found. Please scan a valid QR code.",
      };
    }

    if (response?.data?.message) {
      return {
        type: "network_error",
        message: response.data.message,
      };
    }
  }

  // Handle generic errors
  if (err instanceof Error) {
    return {
      type: "unknown",
      message: err.message || "An unexpected error occurred.",
    };
  }

  return {
    type: "unknown",
    message: "An unexpected error occurred. Please try again.",
  };
}
