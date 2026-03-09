import { systemApi } from "../AxoisInstance";
import type { QRScanResult } from "@/shared/types";

const TICKET_ROUTE = "/v1/tickets";

export interface QRScanPayload {
  token: string;
}

export class TicketsApi {
  /**
   * Validate a scanned QR code
   * @param payload - Contains userId and eventId from scanned QR
   * @returns Scan result with user and event information
   */
  async scanQRCode(payload: QRScanPayload): Promise<QRScanResult> {
    const response = await systemApi.post(`${TICKET_ROUTE}/scan`, payload);
    return response.data;
  }
}

export const ticketsApi = new TicketsApi();
