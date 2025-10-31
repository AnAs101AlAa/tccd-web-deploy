import { systemApi } from "../AxoisInstance";
import type { QRScanResult } from "@/shared/types";

const QR_SCANNER_ROUTE = "/v1/qr-scanner";

export interface ValidateQRPayload {
  userId: string;
  eventId: string;
}

export class QRScannerApi {
  /**
   * Validate a scanned QR code
   * @param payload - Contains userId and eventId from scanned QR
   * @returns Scan result with user and event information
   */
  async validateQRCode(payload: ValidateQRPayload): Promise<QRScanResult> {
    const response = await systemApi.post(`${QR_SCANNER_ROUTE}/validate`, payload);
    return response.data;
  }
}

export const qrScannerApi = new QRScannerApi();
