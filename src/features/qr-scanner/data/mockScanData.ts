import type { QRScanResult } from "@/shared/types";

/**
 * Mock QR scan result data for testing the UI
 */
export const mockSuccessfulScan: QRScanResult = {
  user: {
    id: "user-123",
    name: "Ahmed Mohamed Hassan",
    email: "ahmed.hassan@eng.cu.edu.eg",
    university: "Cairo University - Faculty of Engineering",
  },
  event: {
    id: "event-456",
    eventName: "TCCD AI Workshop 2024",
    eventDate: "2024-11-15T14:00:00Z",
    status: "ongoing",
  },
  scannedAt: new Date().toISOString(),
};

export const mockNotStartedEventScan: QRScanResult = {
  user: {
    id: "user-789",
    name: "Sarah Ali Ibrahim",
    email: "sarah.ibrahim@eng.cu.edu.eg",
    university: "Cairo University - Faculty of Engineering",
  },
  event: {
    id: "event-789",
    eventName: "Web Development Bootcamp",
    eventDate: "2024-12-01T10:00:00Z",
    status: "not-started",
  },
  scannedAt: new Date().toISOString(),
};

export const mockEndedEventScan: QRScanResult = {
  user: {
    id: "user-321",
    name: "Mohamed Khaled Samir",
    email: "mohamed.samir@eng.cu.edu.eg",
    university: "Cairo University - Faculty of Engineering",
  },
  event: {
    id: "event-321",
    eventName: "TCCD Orientation Day",
    eventDate: "2024-10-15T09:00:00Z",
    status: "ended",
  },
  scannedAt: new Date().toISOString(),
};

/**
 * Mock QR code data (what would be in the QR code itself)
 */
export const mockQRCodeData = {
  valid: {
    userId: "user-123",
    eventId: "event-456",
  },
  invalid: "invalid-qr-code-string",
  malformed: '{"userId": "user-123"}', // Missing eventId
};
