export interface Sponsor {
  id: string;
  companyName: string;
  businessType: string;
  description: string;
  website: string;
  brief: string;
  logo: string; // This is the banner/logo image URL
}

export default interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  locations: string[];
  isApproved: boolean;
  type: EventTypes;
  attendeeCount: number;
  registeredCount: number;
  capacity: number;
  eventImage: string;
  registrationDeadline: string;
  createdBy?: string;
  createdAt?: string;
  updatedOn?: string;
  media?: string[];
}

export interface EventResponse {
  items: Event[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface EventQueryParams {
  Name?: string;
  Type?: EventTypes;
  StartDate?: string;
  EndDate?: string;
  Locations?: string[];
  OrderBy?: EventOrderBy;
  Descending?: boolean;
  PageNumber?: number;
  PageSize?: number;
}

export type EventTypes = "Workshop" | "Jobfair" | "Researchday" | "Fieldtrip" | "Sessions" | "Recruitment" | "Orientation"
export type EventOrderBy = "Name" | "Date" | "Location" | "Type";