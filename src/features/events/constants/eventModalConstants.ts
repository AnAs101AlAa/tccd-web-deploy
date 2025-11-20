export const EVENT_FORM_CONSTRAINTS = {
  title: {
    minLength: 5,
    maxLength: 200,
  },
  description: {
    minLength: 20,
    maxLength: 2000,
  },
  location: {
    minLength: 3,
    maxLength: 200,
  },
  category: {
    minLength: 3,
    maxLength: 100,
  },
  capacity: {
    min: 1,
    max: 10000,
  },
} as const;

export const ERROR_MESSAGES = {
  required: {
    title: "Event title is required",
    description: "Event description is required",
    eventPoster: "Event poster URL is required",
    date: "Event date is required",
    location: "Event location is required",
    eventType: "Event type is required",
    category: "Event category is required",
    capacity: "Event capacity is required",
    registeredCount: "Registered count is required",
    attendeeCount: "Attendee count is required",
  },
  length: {
    titleMin: `Title must be at least ${EVENT_FORM_CONSTRAINTS.title.minLength} characters`,
    titleMax: `Title must not exceed ${EVENT_FORM_CONSTRAINTS.title.maxLength} characters`,
    descriptionMin: `Description must be at least ${EVENT_FORM_CONSTRAINTS.description.minLength} characters`,
    descriptionMax: `Description must not exceed ${EVENT_FORM_CONSTRAINTS.description.maxLength} characters`,
    locationMin: `Location must be at least ${EVENT_FORM_CONSTRAINTS.location.minLength} characters`,
    locationMax: `Location must not exceed ${EVENT_FORM_CONSTRAINTS.location.maxLength} characters`,
    categoryMin: `Category must be at least ${EVENT_FORM_CONSTRAINTS.category.minLength} characters`,
    categoryMax: `Category must not exceed ${EVENT_FORM_CONSTRAINTS.category.maxLength} characters`,
  },
  format: {
    eventPoster: "Must be a valid image URL (jpg, jpeg, png, webp, gif)",
    invalidDate: "Invalid date format",
  },
  validation: {
    invalidEventType: "Invalid event type",
    capacityMin: `Capacity must be at least ${EVENT_FORM_CONSTRAINTS.capacity.min}`,
    capacityMax: `Capacity must not exceed ${EVENT_FORM_CONSTRAINTS.capacity.max.toLocaleString()}`,
    capacityLessThanRegistered: "Capacity cannot be less than registered count",
    registeredExceedsCapacity: "Registered count cannot exceed capacity",
    registeredNegative: "Registered count cannot be negative",
    attendeeExceedsRegistered: "Attendee count cannot exceed registered count",
    attendeeNegative: "Attendee count cannot be negative",
    mustBeNumber: "Must be a number",
  },
} as const;
