import { z } from "zod";

const emailSchema = z
  .email("Please enter a valid email address")
  .min(1, "Email is required");

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
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
  .max(100, "Name must not exceed 100 characters");

const arabicNameSchema = z
  .string()
  .trim()
  .min(1, "Arabic name is required")
  .min(3, "Arabic name must be at least 3 characters")
  .max(100, "Arabic name must not exceed 100 characters")
  .regex(
    /^[\u0600-\u06FF\s]+$/,
    "Arabic name must contain only Arabic characters"
  );

/**
 * Login Form Schema
 *
 * Validates login credentials
 *
 * @example
 * const { register, handleSubmit } = useForm({
 *   resolver: zodResolver(loginSchema)
 * });
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
 * Step 2: Basic Info Schema
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
  graduationYear: z
    .number()
    .min(2000, "Graduation year must be after 2000")
    .max(2050, "Graduation year must be before 2050"),
});

export type StudentInfoFormData = z.infer<typeof studentInfoSchema>;

/**
 * Step 4: Company Rep Info Schema
 */
export const companyRepInfoSchema = z.object({
  companyId: z.string().min(1, "Please select a company"),
});

export type CompanyRepInfoFormData = z.infer<typeof companyRepInfoSchema>;

/**
 * Complete Signup Schema
 */
export const signupSchema = z.object({
  userType: userTypeSchema,
  englishFullName: fullNameSchema,
  arabicFullName: arabicNameSchema,
  phoneNumber: phoneNumberSchema,
  email: emailSchema,
  linkedinUrl: z.string().optional(),
  password: passwordSchema,
  confirmPassword: z.string(),
  // Student fields (optional)
  university: z.string().optional(),
  faculty: z.string().optional(),
  department: z.string().optional(),
  graduationYear: z.number().optional(),
  // Company rep fields (optional)
  companyId: z.string().optional(),
});

/**
 * Type inference from schemas
 * Use these types in your components for type safety
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Password Reset Schema (for future use)
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Schema (for future use)
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
