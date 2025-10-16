import type { Control } from "react-hook-form";
import type { StudentInfoFormData } from "../../schemas";
import { Controller } from "react-hook-form";
import { useState } from "react";

interface StudentInfoStepProps {
  control: Control<StudentInfoFormData>;
}

/**
 * Step 3: Student Information Collection
 */
export const StudentInfoStep = ({ control }: StudentInfoStepProps) => {
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");

  // List of common Egyptian universities
  const universities = [
    "Cairo University",
    "Ain Shams University",
    "Alexandria University",
    "Helwan University",
    "Zagazig University",
    "Mansoura University",
    "Tanta University",
    "Assiut University",
    "Benha University",
    "Suez Canal University",
    "Other",
  ];

  // List of faculties
  const faculties = [
    "Engineering",
    "Medicine",
    "Science",
    "Commerce",
    "Arts",
    "Law",
    "Pharmacy",
    "Computer Science",
    "Mass Communication",
    "Education",
    "Other",
  ];

  // Engineering departments (only shown if faculty is Engineering)
  const engineeringDepartments = [
    "Computer Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Communications Engineering",
    "Architecture Engineering",
    "Biomedical Engineering",
    "Aerospace Engineering",
    "Other",
  ];

  // Generate graduation years (current year to 10 years in the future)
  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from(
    { length: 11 },
    (_, i) => currentYear + i
  );

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-[#3B3D41] mb-2">
          Student Information
        </h3>
        <p className="text-sm text-[#636569]">
          Tell us about your academic background
        </p>
      </div>

      {/* University */}
      <Controller
        name="university"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University
            </label>
            <select
              {...field}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            >
              <option value="">Select your university</option>
              {universities.map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Faculty */}
      <Controller
        name="faculty"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faculty
            </label>
            <select
              {...field}
              onChange={(e) => {
                field.onChange(e);
                setSelectedFaculty(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            >
              <option value="">Select your faculty</option>
              {faculties.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Department (only for Engineering) */}
      {selectedFaculty === "Engineering" && (
        <Controller
          name="department"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                {...field}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
              >
                <option value="">Select your department</option>
                {engineeringDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {error && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {error.message}
                </p>
              )}
            </div>
          )}
        />
      )}

      {/* Graduation Year */}
      <Controller
        name="graduationYear"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Graduation Year
            </label>
            <select
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            >
              <option value="">Select graduation year</option>
              {graduationYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};
