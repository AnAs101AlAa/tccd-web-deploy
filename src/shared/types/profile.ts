import type Event from "./events";

export interface Tickets {
  items: Ticket[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Ticket {
  eventSlotId: string;
  status: TicketStatus;
  registeredAt: string;
  event: Event;
}

export type TicketStatus = "Pending" | "Approved" | "Rejected";

export type TicketFilter = TicketStatus | "All";

export const TicketFilterTabs = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
];
