import type Event from "@/shared/types/events";
import type { EventFormData } from "./eventFormTypes";

export interface AddEditEventModalProps {
  event?: Event;
  onClose: () => void;
  onSave: (eventFormData: EventFormData) => void;
}

export interface MediaItem {
  id?: string;
  file: File | string;
  preview?: string;
}

export interface SponsorItem {
  id?: string;
  companyName: string;
  banner: File | string;
  bannerPreview?: string;
}

export interface EventFormValues {
  title: string;
  description: string;
  eventPoster: File | string; // File for upload or string URL for existing
  eventPosterPreview?: string; // Preview URL for display
  media: MediaItem[]; // Array of media files/URLs
  sponsors: SponsorItem[]; // Array of sponsors with banners
  date: string;
  location: string;
  eventType: string;
  category: string;
  capacity: string;
  registeredCount: string;
  attendeeCount: string;
}

export interface FormErrors {
  title?: string;
  description?: string;
  eventPoster?: string;
  media?: string;
  sponsors?: string;
  date?: string;
  location?: string;
  eventType?: string;
  category?: string;
  capacity?: string;
  registeredCount?: string;
  attendeeCount?: string;
}
