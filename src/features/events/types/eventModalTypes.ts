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

export interface EventFormValues {
  title: string;
  description: string;
  eventPoster: File | string; 
  eventPosterPreview?: string;
  media: MediaItem[]; 
  sponsors: string[]; 
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
