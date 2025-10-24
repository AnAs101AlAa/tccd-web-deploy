export interface Ticket {
  id: string;
  eventTitle: string;
  eventPoster: string;
  status: TicketStatus;
}

export type TicketStatus = "Active" | "Scanned" | "Expired" | "Cancelled";

export type TicketFilter = TicketStatus | "All";

export const TicketFilterTabs = ["All", "Active", "Scanned", "Expired", "Cancelled"];
