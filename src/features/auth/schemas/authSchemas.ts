import { z } from "zod";

/**
 * Validates that a name has at least 3 parts (first, middle, last)
 */
const validateNameParts = (value: string, minParts: number = 3) => {
  const nameParts = value.trim().split(/\s+/).filter(part => part.length > 0);
  return nameParts.length >= minParts;
};

const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(
    /^(\+?\d{1,3}[- ]?)?\d{10,}$/,
    "Please enter a valid phone number (at least 10 digits)"
  );

const fullNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .min(3, "Name must be at least 3 characters")
  .max(100, "Name must not exceed 100 characters")
  .refine(
    (value) => validateNameParts(value, 3),
    {
      message: "Please enter at least 3 names (first, middle, last name)",
    }
  );

const arabicNameSchema = z
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

const genderSchema = z.enum(["Male", "Female"], {
  message: "Please select your gender",
});

/**
 * Login Form Schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/**
 * User Type Schema
 */
export const userTypeSchema = z.enum(["student", "company_representative", "academic"], {
  message: "Please select an account type",
});

export type UserType = z.infer<typeof userTypeSchema>;

/**
 * Step 1: Account Type Selection Schema
 */
export const accountTypeSchema = z.object({
  userType: userTypeSchema,
});

export type AccountTypeFormData = z.infer<typeof accountTypeSchema>;

/**
 * Step 2: Basic Info Schema (with gender)
 */
export const basicInfoSchema = z
  .object({
    englishFullName: fullNameSchema.regex(
      /^[a-zA-Z\s]+$/,
      "English name must contain only English characters"
    ),
    arabicFullName: arabicNameSchema,
    phoneNumber: phoneNumberSchema,
    email: emailSchema,
    gender: genderSchema,
    linkedinUrl: z
      .string()
      .url("Please enter a valid URL")
      .regex(
        /^https?:\/\/(www\.)?linkedin\.com\/.+$/,
        "Please enter a valid LinkedIn profile URL"
      )
      .or(z.literal("")),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

/**
 * Step 3: Student Info Schema
 */
export const studentInfoSchema = z.object({
  university: z.string().min(1, "University is required"),
  faculty: z.string().min(1, "Faculty is required"),
  department: z.string().optional(),
})
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
  }
);

export type StudentInfoFormData = z.infer<typeof studentInfoSchema>;

/**
 * Step 3/4: Company Rep Info Schema
 */
export const companyRepInfoSchema = z.object({
  companyId: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  proofFile: z.instanceof(File, { message: "Proof file is required" }),
  // New company fields (conditional)
  isNewCompany: z.boolean(),
  newCompany: z.object({
    companyName: z.string().min(1, "Company name is required"),
    businessType: z.string().min(1, "Business type is required"),
    description: z.string()
      .min(20, "Description should be between 20 and 1000 characters")
      .max(1000, "Description should be between 20 and 1000 characters"),
    website: z.string().url("Please enter a valid website URL"),
    brief: z.string()
      .min(20, "Brief should be between 20 and 500 characters")
      .max(500, "Brief should be between 20 and 500 characters"),
  }).optional(),
}).refine(
  (data) => {
    // Either companyId or newCompany fields must be provided
    if (data.isNewCompany) {
      return data.newCompany !== undefined;
    } else {
      return data.companyId !== undefined && data.companyId !== "";
    }
  },
  {
    message: "Please select a company or register a new one",
    path: ["companyId"],
  }
);

export type CompanyRepInfoFormData = z.infer<typeof companyRepInfoSchema>;

/**
 * Step 3/4: Faculty Info Schema
 */
export const facultyInfoSchema = z.object({
  universityName: z.string().min(1, "University is required"),
  facultyName: z.string().min(1, "Faculty is required"),
  department: z.string().min(1, "Department is required"),
  role: z.string().min(1, "Role is required"),
  proofFile: z.instanceof(File, { message: "Proof file is required" }),
});

export type FacultyInfoFormData = z.infer<typeof facultyInfoSchema>;

/**
 * Complete Signup Schema
 */
export const signupSchema = z.object({
  userType: userTypeSchema,
  englishFullName: fullNameSchema,
  arabicFullName: arabicNameSchema,
  phoneNumber: phoneNumberSchema,
  email: emailSchema,
  gender: genderSchema,
  linkedinUrl: z.string().optional(),
  password: passwordSchema,
  confirmPassword: z.string(),
  // Student fields (optional)
  university: z.string().optional(),
  faculty: z.string().optional(),
  department: z.string().optional(),
  // Company rep fields (optional)
  companyId: z.string().optional(),
  position: z.string().optional(),
  proofFile: z.string().optional(),
  isNewCompany: z.boolean().optional(),
  newCompany: z.object({
    companyName: z.string(),
    businessType: z.string(),
    description: z.string(),
    website: z.string(),
    brief: z.string(),
  }).optional(),
  // Faculty fields (optional)
  universityName: z.string().optional(),
  facultyName: z.string().optional(),
  role: z.string().optional(),
});

/**
 * Type inference from schemas
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Password Reset Schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
