import type { Control } from "react-hook-form";
import type { StudentInfoFormData } from "../../schemas";
import { Controller } from "react-hook-form";
import UniversityList from "@/constants/universityList";
import FacultyList from "@/constants/facultyList";
import DepartmentList from "@/constants/departmentList";

interface StudentInfoStepProps {
  control: Control<StudentInfoFormData>;
}

/**
 * Step 3: Student Information Collection
 */
export const StudentInfoStep = ({ control }: StudentInfoStepProps) => {
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
              University <span className="text-red-500">*</span>
            </label>
            <select
              {...field}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            >
              <option value="">Select your university</option>
              {UniversityList.map((uni) => (
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
              Faculty <span className="text-red-500">*</span>
            </label>
            <select
              {...field}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            >
              <option value="">Select your faculty</option>
              {FacultyList.map((faculty) => (
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

      {/* Department (Optional) */}
      <Controller
        name="department"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department (Optional)
            </label>
            <select
              {...field}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            >
              <option value="">Select your department</option>
              {DepartmentList.map((dept) => (
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
    </div>
  );
};

