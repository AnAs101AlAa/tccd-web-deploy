export default interface Event {
  id: string;
  title: string;
  description: string;
  eventPoster: string;
  eventType: string;
  media?: string[];
  sponsors?: string[]; // Array of sponsor IDs
  date: string;
  location: string;
  category: string;
  capacity: number;
  registeredCount: number;
  attendeeCount: number;
}
