import type Event from "@/shared/types/events";

export interface EventFormData {
  id?: string;
  title: string;
  description: string;
  eventPoster: File | string; // File for new upload, string for existing URL
  eventType: string;
  media?: (File | string)[]; // Array of Files for new uploads, strings for existing URLs
  sponsors?: string[]; // Array of sponsor IDs
  date: string;
  location: string;
  category: string;
  capacity: number;
  registeredCount: number;
  attendeeCount: number;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  eventPoster: File;
  eventType: string;
  media?: File[];
  sponsors?: string[]; // Array of sponsor IDs
  date: string;
  location: string;
  category: string;
  capacity: number;
  registeredCount: number;
  attendeeCount: number;
}

export interface UpdateEventPayload {
  id: string;
  title: string;
  description: string;
  eventPoster: File | string;
  eventType: string;
  media?: (File | string)[];
  sponsors?: string[]; // Array of sponsor IDs
  date: string;
  location: string;
  category: string;
  capacity: number;
  registeredCount: number;
  attendeeCount: number;
}

export const convertEventToFormData = (event: Event): EventFormData => {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    eventPoster: event.eventPoster,
    eventType: event.eventType,
    media: event.media,
    sponsors: event.sponsors, // Array of sponsor IDs
    date: event.date,
    location: event.location,
    category: event.category,
    capacity: event.capacity,
    registeredCount: event.registeredCount,
    attendeeCount: event.attendeeCount,
  };
};

export const convertFormDataToCreatePayload = (
  formData: EventFormData
): CreateEventPayload | null => {
  // Validate eventPoster is a File
  if (typeof formData.eventPoster === "string") {
    console.error("Event poster must be a File for new events");
    return null;
  }

  const mediaFiles =
    formData.media?.filter((item): item is File => item instanceof File) || [];

  return {
    title: formData.title,
    description: formData.description,
    eventPoster: formData.eventPoster,
    eventType: formData.eventType,
    media: mediaFiles.length > 0 ? mediaFiles : undefined,
    sponsors: formData.sponsors, // Array of sponsor IDs
    date: formData.date,
    location: formData.location,
    category: formData.category,
    capacity: formData.capacity,
    registeredCount: formData.registeredCount,
    attendeeCount: formData.attendeeCount,
  };
};

export const convertFormDataToUpdatePayload = (
  formData: EventFormData
): UpdateEventPayload | null => {
  if (!formData.id) {
    console.error("Event ID is required for updates");
    return null;
  }

  return {
    id: formData.id,
    title: formData.title,
    description: formData.description,
    eventPoster: formData.eventPoster,
    eventType: formData.eventType,
    media: formData.media,
    sponsors: formData.sponsors, // Array of sponsor IDs
    date: formData.date,
    location: formData.location,
    category: formData.category,
    capacity: formData.capacity,
    registeredCount: formData.registeredCount,
    attendeeCount: formData.attendeeCount,
  };
};

export const convertToMultipartFormData = (
  payload: CreateEventPayload | UpdateEventPayload
): FormData => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("eventType", payload.eventType);
  formData.append("date", payload.date);
  formData.append("location", payload.location);
  formData.append("category", payload.category);
  formData.append("capacity", payload.capacity.toString());
  formData.append("registeredCount", payload.registeredCount.toString());
  formData.append("attendeeCount", payload.attendeeCount.toString());

  if (payload.eventPoster instanceof File) {
    formData.append("eventPoster", payload.eventPoster);
  } else if (typeof payload.eventPoster === "string") {
    formData.append("eventPosterUrl", payload.eventPoster);
  }

  if (payload.media) {
    payload.media.forEach((item, index) => {
      if (item instanceof File) {
        formData.append(`media`, item);
      } else if (typeof item === "string") {
        formData.append(`mediaUrls[${index}]`, item);
      }
    });
  }

  if (payload.sponsors) {
    payload.sponsors.forEach((sponsorId, index) => {
      formData.append(`sponsors[${index}]`, sponsorId);
    });
  }

  if ("id" in payload && payload.id) {
    formData.append("id", payload.id);
  }

  return formData;
};
