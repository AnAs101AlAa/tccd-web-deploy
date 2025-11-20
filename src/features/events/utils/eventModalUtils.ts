import EVENT_TYPES from "@/constants/EventTypes";
import type Event from "@/shared/types/events";
import type { EventFormValues, FormErrors } from "../types/eventModalTypes";
import {
  EVENT_FORM_CONSTRAINTS,
  ERROR_MESSAGES,
} from "../constants/eventModalConstants";

export const validateField = (
  field: keyof EventFormValues,
  value: string,
  formValues?: EventFormValues
): string | undefined => {
  switch (field) {
    case "title": {
      if (!value.trim()) return ERROR_MESSAGES.required.title;
      if (value.trim().length < EVENT_FORM_CONSTRAINTS.title.minLength) {
        return ERROR_MESSAGES.length.titleMin;
      }
      if (value.trim().length > EVENT_FORM_CONSTRAINTS.title.maxLength) {
        return ERROR_MESSAGES.length.titleMax;
      }
      break;
    }

    case "description": {
      if (!value.trim()) return ERROR_MESSAGES.required.description;
      if (value.trim().length < EVENT_FORM_CONSTRAINTS.description.minLength) {
        return ERROR_MESSAGES.length.descriptionMin;
      }
      if (value.trim().length > EVENT_FORM_CONSTRAINTS.description.maxLength) {
        return ERROR_MESSAGES.length.descriptionMax;
      }
      break;
    }

    case "eventPoster": {
      if (!value.trim()) return ERROR_MESSAGES.required.eventPoster;
      if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(value)) {
        return ERROR_MESSAGES.format.eventPoster;
      }
      break;
    }

    case "date": {
      if (!value.trim()) return ERROR_MESSAGES.required.date;
      const eventDate = new Date(value);
      if (isNaN(eventDate.getTime())) return ERROR_MESSAGES.format.invalidDate;
      // Allow past dates for past events
      break;
    }

    case "location": {
      if (!value.trim()) return ERROR_MESSAGES.required.location;
      if (value.trim().length < EVENT_FORM_CONSTRAINTS.location.minLength) {
        return ERROR_MESSAGES.length.locationMin;
      }
      if (value.trim().length > EVENT_FORM_CONSTRAINTS.location.maxLength) {
        return ERROR_MESSAGES.length.locationMax;
      }
      break;
    }

    case "eventType": {
      if (!value.trim()) return ERROR_MESSAGES.required.eventType;
      const validTypes = EVENT_TYPES.map((t) => t.value);
      if (!validTypes.includes(value))
        return ERROR_MESSAGES.validation.invalidEventType;
      break;
    }

    case "category": {
      if (!value.trim()) return ERROR_MESSAGES.required.category;
      if (value.trim().length < EVENT_FORM_CONSTRAINTS.category.minLength) {
        return ERROR_MESSAGES.length.categoryMin;
      }
      if (value.trim().length > EVENT_FORM_CONSTRAINTS.category.maxLength) {
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

  (Object.keys(formValues) as Array<keyof EventFormValues>).forEach((field) => {
    const value = formValues[field];
    const error = validateField(field, value, formValues);
    if (error) {
      newErrors[field] = error;
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
      date: "",
      location: "",
      eventType: "",
      category: "",
      capacity: "",
      registeredCount: "0",
      attendeeCount: "0",
    };
  }

  return {
    title: event.title,
    description: event.description,
    eventPoster: event.eventPoster,
    date: new Date(event.date).toISOString().slice(0, 16),
    location: event.location,
    eventType: event.eventType,
    category: event.category,
    capacity: event.capacity.toString(),
    registeredCount: event.registeredCount.toString(),
    attendeeCount: event.attendeeCount.toString(),
  };
};

export const convertFormValuesToEvent = (
  formValues: EventFormValues,
  existingEvent?: Event
): Event => {
  return {
    id: existingEvent?.id || `temp-${Date.now()}`,
    title: formValues.title.trim(),
    description: formValues.description.trim(),
    eventPoster: formValues.eventPoster.trim(),
    media: existingEvent?.media || [],
    date: new Date(formValues.date).toISOString(),
    location: formValues.location.trim(),
    eventType: formValues.eventType,
    category: formValues.category.trim(),
    capacity: parseInt(formValues.capacity, 10),
    registeredCount: parseInt(formValues.registeredCount, 10),
    attendeeCount: parseInt(formValues.attendeeCount, 10),
    sponsors: existingEvent?.sponsors,
  };
};
