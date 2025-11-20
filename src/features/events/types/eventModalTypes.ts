import type Event from "@/shared/types/events";

export interface AddEditEventModalProps {
  event?: Event;
  onClose: () => void;
  onSave: (event: Event) => void;
}

export interface EventFormValues {
  title: string;
  description: string;
  eventPoster: string;
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
  date?: string;
  location?: string;
  eventType?: string;
  category?: string;
  capacity?: string;
  registeredCount?: string;
  attendeeCount?: string;
}
