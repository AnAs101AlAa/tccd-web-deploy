import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { BasicInfoFormData } from "../../schemas";
import { FormInput } from "../FormInput";

interface BasicInfoStepProps {
  control: Control<BasicInfoFormData>;
}

/**
 * Step 2: Basic Information Collection
 */
export const BasicInfoStep = ({ control }: BasicInfoStepProps) => {
  const nationality = useWatch({
    control,
    name: "nationality",
  });

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-[#3B3D41] mb-2">
          Tell Us About Yourself
        </h3>
        <p className="text-sm text-[#636569]">
          Please provide your basic information
        </p>
      </div>

      {/* Full Name Inputs (Side by Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="englishFullName"
          control={control}
          label="Full Name (English)"
          type="text"
          placeholder="Enter your first three names"
          autoComplete="name"
        />

        <FormInput
          name="arabicFullName"
          control={control}
          label="Full Name (Arabic)"
          type="text"
          placeholder="أدخل اسمك الثلاثي"
          autoComplete="name"
          dir="rtl"
        />
      </div>

      {/* Email */}
      <FormInput
        name="email"
        control={control}
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
      />

      {/* Phone Number */}
      <FormInput
        name="phoneNumber"
        control={control}
        label="Phone Number"
        type="tel"
        placeholder="+201012345678"
        autoComplete="tel"
        helperText="Enter any valid international phone number with country code"
      />

      <FormInput
        name="gender"
        control={control}
        label="Gender"
        type="dropdown"
        options={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ]}
      />

      {/* Nationality */}
      <FormInput
        name="nationality"
        control={control}
        label="Nationality"
        type="dropdown"
        options={[
          { label: "Egyptian", value: "egyptian" },
          { label: "Non-Egyptian", value: "non-egyptian" },
        ]}
      />

      {/* Conditional ID Fields */}
      {nationality === "egyptian" ? (
        <FormInput
          name="nationalId"
          control={control}
          label="National ID"
          type="text"
          placeholder="Enter your national ID number"
        />
      ) : nationality === "non-egyptian" ? (
        <FormInput
          name="passportNumber"
          control={control}
          label="Passport Number"
          type="text"
          placeholder="Enter your passport number"
        />
      ) : null}

      {/* LinkedIn URL */}
      <FormInput
        id="linkedinUrl"
        name="linkedinUrl"
        control={control}
        label="LinkedIn Profile (Optional)"
        type="url"
        placeholder="https://www.linkedin.com/in/yourprofile"
      />

      {/* Password Inputs (Side by Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="password"
          control={control}
          label="Password"
          type="password"
          placeholder="Enter password"
          autoComplete="new-password"
          helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 number"
        />

        <FormInput
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
        />
      </div>
    </div>
  );
};
