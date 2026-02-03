
import { z } from "zod";
import type { EventTypes } from "@/shared/types/events";
import EVENT_TYPES from "@/constants/EventTypes";

export const eventFormSchema = z.object({
  name: z.string({message: "Event name is required."}).min(5, {message: "Event name must be at least 5 characters long."}).max(100, {message: "Event name cannot exceed 100 characters."}),
  description: z.string()
    .min(20, { message: "Description is required." })
    .max(1000, { message: "Description cannot exceed 1000 characters." }),
  date: z.string()
    .min(1, { message: "Date is required." })
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format.",
    }),
  locations: z.array(z.string().min(1, {message: "Location cannot be empty."}), {message: "At least one location is required."}).min(1, {message: "At least one location is required."}),
  type: z.custom<EventTypes>((val) => EVENT_TYPES.map((t) => t.value).includes(val as EventTypes), {
    message: "Invalid event type.",
  }),
  eventImage: z.string({message: "Event image URL is required."}).min(1, {message: "Event image URL is required."}),
  registrationDeadline: z.string().optional(),
});
