import { systemApi } from "../AxoisInstance";
import type { QRScanResult } from "@/shared/types";

const TICKET_ROUTE = "/v1/tickets";

export interface QRScanPayload {
  token: string;
  slotId: string;
}

export class TicketsApi {
  /**
   * Scan a user's ticket using a JWT token from their QR code
   * @param payload - Contains token and slotId
   * @returns Scan result with user and event information
   */
  async scanQRCode(payload: QRScanPayload): Promise<QRScanResult> {
    const response = await systemApi.post(
      `${TICKET_ROUTE}/slots/${payload.slotId}/scan`,
      { token: payload.token }
    );
    return response.data.data;
  }
}

export const ticketsApi = new TicketsApi();

