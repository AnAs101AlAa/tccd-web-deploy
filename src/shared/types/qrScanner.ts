export interface ScannedUserInfo {
  id: string;
  name: string;
  email: string;
  university: string;
}

export interface ScannedEventInfo {
  id: string;
  eventName: string;
  eventDate: string;
  status: "not-started" | "ongoing" | "ended";
}

export interface QRScanResult {
  user: ScannedUserInfo;
  event: ScannedEventInfo;
  scannedAt: string;
}

export interface QRScanError {
  type: "invalid_qr" | "event_not_started" | "event_ended" | "camera_error" | "network_error" | "unknown";
  message: string;
}

export interface QRScannerState {
  isScanning: boolean;
  isVerifying: boolean;
  result: QRScanResult | null;
  error: QRScanError | null;
}
