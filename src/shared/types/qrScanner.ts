export interface QRScanResultUser {
  id: string;
  englishName: string;
  arabicName: string;
  gender: string;
  status: string;
  nationalId: string | null;
  passportNumber: string | null;
  email: string;
  role: string;
  token: string | null;
  phoneNumber: string;
  studentProfile: any;
  volunteeringProfile: any;
  businessRepProfile: any;
  facultyMemberProfile: any;
}

export interface QRScanResult {
  id: string;
  userId: string;
  eventId: string;
  scannedAt: string;
  scanCount: number;
  maxScans: number;
  user?: QRScanResultUser;
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
