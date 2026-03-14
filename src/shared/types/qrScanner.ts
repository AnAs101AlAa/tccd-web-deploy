export interface QRScanResult {
  id: string;
  userId: string;
  eventId: string;
  scannedAt: string;
  scanCount: number;
  maxScans: number;
}

export interface QRScanError {
  type: "invalid_qr" | "event_not_started" | "event_ended" | "camera_error" | "network_error" | "scan_limit_reached" | "unknown";
  message: string;
}

export interface QRScannerState {
  isScanning: boolean;
  isVerifying: boolean;
  result: QRScanResult | null;
  error: QRScanError | null;
}
