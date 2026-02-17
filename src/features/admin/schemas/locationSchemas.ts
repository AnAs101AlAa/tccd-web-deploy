import { z } from "zod";

/**
 * Schema for location name validation
 */
const locationNameSchema = z
  .string()
  .trim()
  .min(1, "Location name is required")
  .min(3, "Location name must be at least 3 characters")
  .max(100, "Location name must not exceed 100 characters");

/**
 * Schema for location capacity validation
 */
const capacitySchema = z
  .number()
  .int("Capacity must be a whole number")
  .positive("Capacity must be greater than 0")
  .max(10000, "Capacity seems unrealistic (max 10,000)");

/**
 * Schema for room image ID validation (Google Drive ID)
 */
const roomImageSchema = z.string().trim().min(1, "Image ID is required");

/**
 * Edit Location Form Schema
 *
 * Validates location update form data
 *
 * @example
 * const { register, handleSubmit } = useForm({
 *   resolver: zodResolver(editLocationSchema)
 * });
 */
export const editLocationSchema = z.object({
  name: locationNameSchema,
  capacity: capacitySchema,
});

export type EditLocationFormData = z.infer<typeof editLocationSchema>;

/**
 * Create Location Form Schema
 */
export const createLocationSchema = z.object({
  name: locationNameSchema,
  capacity: capacitySchema,
  roomImageFileId: roomImageSchema,
});

export type CreateLocationFormData = z.infer<typeof createLocationSchema>;
