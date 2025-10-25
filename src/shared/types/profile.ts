export interface Ticket {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventPoster: string;
  status: TicketStatus;
  qrCode: string;
}

export type TicketStatus = "Active" | "Scanned" | "Expired" | "Cancelled";

export type TicketFilter = TicketStatus | "All";

export const TicketFilterTabs = [
  "All",
  "Active",
  "Scanned",
  "Expired",
  "Cancelled",
];
