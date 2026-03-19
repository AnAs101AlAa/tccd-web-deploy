
import { z } from "zod";
import EVENT_TYPES from "@/constants/EventTypes";

export const eventFormSchema = z.object({
  name: z.string({message: "Event name is required."}).min(5, {message: "Event name must be at least 5 characters long."}).max(100, {message: "Event name cannot exceed 100 characters."}),
  description: z.string()
    .min(20, { message: "Description cannot be less than 20 characters." })
    .max(1000, { message: "Description cannot exceed 1000 characters." }),
  date: z.string()
    .min(1, { message: "Date is required." })
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format.",
    }),
  locations: z.array(z.string().min(1, {message: "Location cannot be empty."}), {message: "At least one location is required."}).min(1, {message: "At least one location is required."}),
  type: z.string({message: "Event type is required."}).min(1, {message: "Event type is required."}).refine((val) => EVENT_TYPES.some((option) => option.value === val), {
    message: "Invalid event type.",
  }),
  capacity: z.number({message: "Capacity is required."}).min(1, {message: "Capacity must be at least 1."}),
  eventImage: z.string({message: "Event image URL is required."}).min(1, {message: "Event image URL is required."}).optional(),
  registrationDeadline: z.string().optional(),
  slots: z.array(z.object({
    startTime: z.string().min(1, {message: "Start time is required."}),
    endTime: z.string().min(1, {message: "End time is required."}),
    capacity: z.number().min(1, {message: "Can't allocate a slot with no capacity."}),
  })).min(1, {message: "At least one time slot is required."}),
}).refine((data) => {
  return data.slots.every(slot => {
    const getMinutes = (d: string) => {
      const date = new Date(d);
      return date.getHours() * 60 + date.getMinutes();
    };
    const startMinutes = getMinutes(slot.startTime);
    const endMinutes = getMinutes(slot.endTime);
    return startMinutes !== endMinutes;
  });
}, {
  message: "All event slots must have different start and end times.",
  path: ["slots"],
});
