export interface Event {
  id: number;
  Title: string;
  Description: string;
  EventImageId: string | null;
  Date: string; // ISO date string
  Category: EventCategory;
  Capacity: number;
  RegistrationCount: number;
  AttendeeCount: number;
}

export type EventCategory =
  | "Workshop"
  | "Seminar"
  | "Competition"
  | "Social"
  | "Training"
  | "Conference"
  | "Other";
