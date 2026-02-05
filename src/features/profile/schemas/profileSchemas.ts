import { z } from "zod";

/**
 * Validates that a name has at least 3 parts (first, middle, last)
 */
const validateNameParts = (value: string, minParts: number = 3) => {
  const nameParts = value.trim().split(/\s+/).filter(part => part.length > 0);
  return nameParts.length >= minParts;
};

/**
 * English Full Name Schema
 * Requires at least 3 names (first, middle, last) with only English characters
 */
const englishFullNameSchema = z
  .string()
  .trim()
  .min(1, "English name is required")
  .min(3, "English name must be at least 3 characters")
  .max(100, "English name must not exceed 100 characters")
  .regex(
    /^[a-zA-Z\s]+$/,
    "English name must contain only English characters"
  )
  .refine(
    (value) => validateNameParts(value, 3),
    {
      message: "Please enter at least 3 names (first, middle, last name)",
    }
  );

/**
 * Arabic Full Name Schema
 * Requires at least 3 names (first, middle, last) with only Arabic characters
 */
const arabicFullNameSchema = z
  .string()
  .trim()
  .min(1, "Arabic name is required")
  .min(3, "Arabic name must be at least 3 characters")
  .max(100, "Arabic name must not exceed 100 characters")
  .regex(
    /^[\u0600-\u06FF\s]+$/,
    "Arabic name must contain only Arabic characters"
  )
  .refine(
    (value) => validateNameParts(value, 3),
    {
      message: "Please enter at least 3 names (first, middle, last name)",
    }
  );

/**
 * Gender Schema
 */
const genderSchema = z.enum(["Male", "Female"], {
  message: "Please select your gender",
});

/**
 * University Schema
 */
const universitySchema = z
  .string()
  .trim()
  .min(1, "University is required")
  .min(3, "University name must be at least 3 characters");

/**
 * Faculty Schema
 */
const facultySchema = z
  .string()
  .trim()
  .min(1, "Faculty is required")
  .min(3, "Faculty name must be at least 3 characters");

/**
 * Department Schema
 */
const departmentSchema = z
  .string()
  .trim()
  .min(1, "Department is required")
  .min(3, "Department name must be at least 3 characters");

/**
 * Graduation Year Schema
 */
const graduationYearSchema = z
  .string()
  .min(1, "Graduation year is required")
  .refine(
    (val) => {
      const year = parseInt(val, 10);
      return !isNaN(year);
    },
    {
      message: "Invalid year",
    }
  )
  .refine(
    (val) => {
      const year = parseInt(val, 10);
      const currentYear = new Date().getFullYear();
      return year >= 1950 && year <= currentYear + 10;
    },
    {
      message: `Year must be between 1950 and ${new Date().getFullYear() + 10}`,
    }
  );

/**
 * GPA Schema
 */
const gpaSchema = z
  .string()
  .min(1, "GPA is required")
  .refine(
    (val) => {
      const gpa = parseFloat(val);
      return !isNaN(gpa);
    },
    {
      message: "Invalid GPA",
    }
  )
  .refine(
    (val) => {
      const gpa = parseFloat(val);
      return gpa >= 0 && gpa <= 4;
    },
    {
      message: "GPA must be between 0 and 4",
    }
  );

/**
 * LinkedIn URL Schema (optional)
 */
const linkedinSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      return /^https?:\/\/(www\.)?linkedin\.com\/.+/.test(val);
    },
    {
      message: "Invalid LinkedIn URL format",
    }
  );

/**
 * GitHub URL Schema (optional)
 */
const githubSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      return /^https?:\/\/(www\.)?github\.com\/.+/.test(val);
    },
    {
      message: "Invalid GitHub URL format",
    }
  );

/**
 * Edit Student Profile Schema
 * Used for validating student profile edit form
 */
export const editStudentProfileSchema = z.object({
  englishFullName: englishFullNameSchema,
  arabicFullName: arabicFullNameSchema,
  gender: genderSchema,
  university: universitySchema,
  faculty: facultySchema,
  department: departmentSchema,
  graduationYear: graduationYearSchema,
  gpa: gpaSchema,
  linkedin: linkedinSchema,
  gitHub: githubSchema,
  cv: z.string().optional(),
});

export type EditStudentProfileFormData = z.infer<typeof editStudentProfileSchema>;
