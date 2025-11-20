import EVENT_TYPES from "@/constants/EventTypes";
import type Event from "@/shared/types/events";
import type { EventFormValues, FormErrors } from "../types/eventModalTypes";
import type { EventFormData } from "../types/eventFormTypes";
import {
  EVENT_FORM_CONSTRAINTS,
  ERROR_MESSAGES,
} from "../constants/eventModalConstants";

export const validateFile = (file: File): string | undefined => {
  // Check file size
  if (file.size > EVENT_FORM_CONSTRAINTS.file.maxSize) {
    return ERROR_MESSAGES.format.fileTooLarge;
  }
  // Check file type
  const allowedTypes = EVENT_FORM_CONSTRAINTS.file.allowedImageTypes;
  if (!allowedTypes.some((type) => type === file.type)) {
    return ERROR_MESSAGES.format.eventPosterFile;
  }

  return undefined;
};

export const validateEventPoster = (
  value: File | string
): string | undefined => {
  if (!value) return ERROR_MESSAGES.required.eventPoster;

  if (value instanceof File) {
    return validateFile(value);
  }

  // If it's a string, validate as URL
  if (typeof value === "string") {
    if (!value.trim()) return ERROR_MESSAGES.required.eventPoster;
    if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(value)) {
      return ERROR_MESSAGES.format.eventPoster;
    }
  }

  return undefined;
};

export const validateField = (
  field: keyof EventFormValues,
  value: string | File,
  formValues?: EventFormValues
): string | undefined => {
  // Special handling for eventPoster which can be File or string
  if (field === "eventPoster") {
    return validateEventPoster(value);
  }

  // For all other fields, ensure value is a string
  if (value instanceof File) {
    return "Invalid field type";
  }

  const stringValue = value as string;

  switch (field) {
    case "title": {
      if (!stringValue.trim()) return ERROR_MESSAGES.required.title;
      if (stringValue.trim().length < EVENT_FORM_CONSTRAINTS.title.minLength) {
        return ERROR_MESSAGES.length.titleMin;
      }
      if (stringValue.trim().length > EVENT_FORM_CONSTRAINTS.title.maxLength) {
        return ERROR_MESSAGES.length.titleMax;
      }
      break;
    }

    case "description": {
      if (!stringValue.trim()) return ERROR_MESSAGES.required.description;
      if (
        stringValue.trim().length < EVENT_FORM_CONSTRAINTS.description.minLength
      ) {
        return ERROR_MESSAGES.length.descriptionMin;
      }
      if (
        stringValue.trim().length > EVENT_FORM_CONSTRAINTS.description.maxLength
      ) {
        return ERROR_MESSAGES.length.descriptionMax;
      }
      break;
    }

    case "date": {
      if (!stringValue.trim()) return ERROR_MESSAGES.required.date;
      const eventDate = new Date(stringValue);
      if (isNaN(eventDate.getTime())) return ERROR_MESSAGES.format.invalidDate;
      // Allow past dates for past events
      break;
    }

    case "location": {
      if (!stringValue.trim()) return ERROR_MESSAGES.required.location;
      if (
        stringValue.trim().length < EVENT_FORM_CONSTRAINTS.location.minLength
      ) {
        return ERROR_MESSAGES.length.locationMin;
      }
      if (
        stringValue.trim().length > EVENT_FORM_CONSTRAINTS.location.maxLength
      ) {
        return ERROR_MESSAGES.length.locationMax;
      }
      break;
    }

    case "eventType": {
      if (!stringValue.trim()) return ERROR_MESSAGES.required.eventType;
      const validTypes = EVENT_TYPES.map((t) => t.value);
      if (!validTypes.includes(stringValue))
        return ERROR_MESSAGES.validation.invalidEventType;
      break;
    }

    case "category": {
      if (!stringValue.trim()) return ERROR_MESSAGES.required.category;
      if (
        stringValue.trim().length < EVENT_FORM_CONSTRAINTS.category.minLength
      ) {
        return ERROR_MESSAGES.length.categoryMin;
      }
      if (
        stringValue.trim().length > EVENT_FORM_CONSTRAINTS.category.maxLength
      ) {
        return ERROR_MESSAGES.length.categoryMax;
      }
      break;
    }

    case "capacity": {
      if (!value.trim()) return ERROR_MESSAGES.required.capacity;
      const capacity = parseInt(value, 10);
      if (isNaN(capacity)) return ERROR_MESSAGES.validation.mustBeNumber;
      if (capacity < EVENT_FORM_CONSTRAINTS.capacity.min) {
        return ERROR_MESSAGES.validation.capacityMin;
      }
      if (capacity > EVENT_FORM_CONSTRAINTS.capacity.max) {
        return ERROR_MESSAGES.validation.capacityMax;
      }

      // Check if capacity is less than registered count
      if (formValues) {
        const registered = parseInt(formValues.registeredCount || "0", 10);
        if (!isNaN(registered) && capacity < registered) {
          return ERROR_MESSAGES.validation.capacityLessThanRegistered;
        }
      }
      break;
    }

    case "registeredCount": {
      if (!value.trim()) return ERROR_MESSAGES.required.registeredCount;
      const registered = parseInt(value, 10);
      if (isNaN(registered)) return ERROR_MESSAGES.validation.mustBeNumber;
      if (registered < 0) return ERROR_MESSAGES.validation.registeredNegative;

      // Check if registered count exceeds capacity
      if (formValues) {
        const capacity = parseInt(formValues.capacity || "0", 10);
        if (!isNaN(capacity) && registered > capacity) {
          return ERROR_MESSAGES.validation.registeredExceedsCapacity;
        }
      }
      break;
    }

    case "attendeeCount": {
      if (!value.trim()) return ERROR_MESSAGES.required.attendeeCount;
      const attendees = parseInt(value, 10);
      if (isNaN(attendees)) return ERROR_MESSAGES.validation.mustBeNumber;
      if (attendees < 0) return ERROR_MESSAGES.validation.attendeeNegative;

      // Check if attendee count exceeds registered count
      if (formValues) {
        const registered = parseInt(formValues.registeredCount || "0", 10);
        if (!isNaN(registered) && attendees > registered) {
          return ERROR_MESSAGES.validation.attendeeExceedsRegistered;
        }
      }
      break;
    }
  }
  return undefined;
};

export const validateAllFields = (formValues: EventFormValues): FormErrors => {
  const newErrors: FormErrors = {};

  // Validate each field, skip eventPosterPreview as it's just for display
  (Object.keys(formValues) as Array<keyof EventFormValues>).forEach((field) => {
    if (
      field === "eventPosterPreview" ||
      field === "media" ||
      field === "sponsors"
    )
      return; // Skip preview, media, and sponsors fields

    const value = formValues[field];
    if (value !== undefined) {
      const error = validateField(field, value as string | File, formValues);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    }
  });

  return newErrors;
};

export const convertEventToFormValues = (event?: Event): EventFormValues => {
  if (!event) {
    return {
      title: "",
      description: "",
      eventPoster: "",
      eventPosterPreview: "",
      media: [],
      sponsors: [],
      date: "",
      location: "",
      eventType: "",
      category: "",
      capacity: "",
      registeredCount: "0",
      attendeeCount: "0",
    };
  }

  // Convert media array to MediaItem[]
  const mediaItems =
    event.media?.map((url, index) => ({
      id: `media-${index}`,
      file: url,
      preview: url,
    })) || [];

  return {
    title: event.title,
    description: event.description,
    eventPoster: event.eventPoster, // Keep as string URL
    eventPosterPreview: event.eventPoster, // Set preview to existing URL
    media: mediaItems,
    sponsors: event.sponsors || [], // Array of sponsor IDs
    date: new Date(event.date).toISOString().slice(0, 16),
    location: event.location,
    eventType: event.eventType,
    category: event.category,
    capacity: event.capacity.toString(),
    registeredCount: event.registeredCount.toString(),
    attendeeCount: event.attendeeCount.toString(),
  };
};

export const convertFormValuesToEventFormData = (
  formValues: EventFormValues,
  existingEvent?: Event
): EventFormData => {
  const eventPoster = formValues.eventPoster;
  const posterValue =
    typeof eventPoster === "string" ? eventPoster.trim() : eventPoster;

  // Convert media items to File | string array
  const mediaArray = formValues.media.map((item) => item.file);

  return {
    id: existingEvent?.id,
    title: formValues.title.trim(),
    description: formValues.description.trim(),
    eventPoster: posterValue,
    eventType: formValues.eventType,
    media: mediaArray.length > 0 ? mediaArray : undefined,
    sponsors: formValues.sponsors.length > 0 ? formValues.sponsors : undefined, // Array of sponsor IDs
    date: new Date(formValues.date).toISOString(),
    location: formValues.location.trim(),
    category: formValues.category.trim(),
    capacity: parseInt(formValues.capacity, 10),
    registeredCount: parseInt(formValues.registeredCount, 10),
    attendeeCount: parseInt(formValues.attendeeCount, 10),
  };
};
