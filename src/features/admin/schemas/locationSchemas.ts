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
  .max(100000, "Capacity seems unrealistic (max 100,000)");

/**
 * Schema for base64 image validation
 */
const base64ImageSchema = z
  .string()
  .min(1, "Image is required")
  .refine(
    (value) => {
      // Check if it's a valid base64 data URL
      const base64Regex = /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/;
      return base64Regex.test(value);
    },
    {
      message: "Invalid image format. Please upload a valid image file.",
    }
  );

/**
 * Schema for address validation (optional)
 */
const addressSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value || value.length === 0) return true;
      return value.length >= 10;
    },
    {
      message: "Please provide a complete address",
    }
  );

/**
 * Schema for description validation (optional)
 */
const descriptionSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value || value.length === 0) return true;
      return value.length >= 10;
    },
    {
      message: "Description should be at least 10 characters",
    }
  )
  .refine(
    (value) => {
      if (!value) return true;
      return value.length <= 500;
    },
    {
      message: "Description must not exceed 500 characters",
    }
  );

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
  image: base64ImageSchema,
  address: addressSchema,
  description: descriptionSchema,
});

export type EditLocationFormData = z.infer<typeof editLocationSchema>;

/**
 * Create Location Form Schema
 *
 * Same as edit schema for now, but separated for future flexibility
 */
export const createLocationSchema = editLocationSchema;

export type CreateLocationFormData = z.infer<typeof createLocationSchema>;
