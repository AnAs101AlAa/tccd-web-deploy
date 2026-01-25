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
  title: string;
  description: string;
  eventPoster: string;
  eventType: string;
  media?: string[];
  sponsors?: string[]; // Array of sponsor IDs
  sponsorDetails?: Sponsor[]; // Array of sponsor objects with full details
  date: string;
  location: string;
  category: string;
  capacity: number;
  registeredCount: number;
  attendeeCount: number;
  timeSlot?: string;
}
