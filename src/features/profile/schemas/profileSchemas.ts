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

const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(
    /^\+[1-9]\d{9,14}$/,
    "Please enter a valid phone number with country code (e.g., +201234567890)",
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
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      return val.trim().length >= 3;
    },
    {
      message: "Department name must be at least 3 characters",
    }
  )

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
  .nullable()
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
  .nullable()
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
 * CV URL Schema (optional)
 */
const cvSchema = z.string().optional().nullable();

/**
 * Nationality Schema
 */
const nationalitySchema = z.enum(["egyptian", "non-egyptian"], {
  message: "Please select your nationality",
});

/**
 * National ID Schema
 */
const nationalIdSchema = z.string().optional();

/**
 * Passport Number Schema
 */
const passportNumberSchema = z.string().optional();

/**
 * Edit Student Profile Schema
 * Used for validating student profile edit form
 */
export const editStudentProfileSchema = z
  .object({
    englishFullName: englishFullNameSchema,
    arabicFullName: arabicFullNameSchema,
    phoneNumber: phoneNumberSchema,
    gender: genderSchema,
    nationality: nationalitySchema,
    nationalId: nationalIdSchema,
    passportNumber: passportNumberSchema,
    university: universitySchema,
    faculty: facultySchema,
    department: departmentSchema,
    graduationYear: graduationYearSchema,
    gpa: gpaSchema,
    linkedin: linkedinSchema,
    gitHub: githubSchema,
    cv: cvSchema,
  })
  .refine(
    (data) => {
      if (data.nationality === "egyptian") {
        return data.nationalId && data.nationalId.trim().length > 0;
      }
      return true;
    },
    {
      message: "National ID is required for Egyptian citizens",
      path: ["nationalId"],
    },
  )
  .refine(
    (data) => {
      if (data.nationality === "egyptian") {
        return data.nationalId ? /^[0-9]{14}$/.test(data.nationalId) : false;
      }
      return true;
    },
    {
      message: "Egyptian National ID must be exactly 14 digits",
      path: ["nationalId"],
    },
  )
  .refine(
    (data) => {
      if (data.nationality === "non-egyptian") {
        return data.passportNumber && data.passportNumber.trim().length > 0;
      }
      return true;
    },
    {
      message: "Passport number is required for non-Egyptian citizens",
      path: ["passportNumber"],
    },
  )
  .refine(
    (data) => {
      if (data.nationality === "non-egyptian") {
        // Allow passport numbers with or without a leading letter, followed by 7 or 8 digits
        return data.passportNumber ? /^([A-Z]{1})?[0-9]{7,8}$/.test(data.passportNumber) : false;
      }
      return true;
    },
    {
      message: "Passport number must be 7 or 8 digits, optionally preceded by 1 letter (e.g., 12345678 or A1234567)",
      path: ["passportNumber"],
    },
  )
  .refine(
    (data) => {
      if (data.faculty === "Engineering") {
        return data.department && data.department.trim().length > 0;
      }
      return true;
    },
    {
      message: "Department is required for Engineering faculty",
      path: ["department"],
    },
  );

export type EditStudentProfileFormData = z.infer<typeof editStudentProfileSchema>;
