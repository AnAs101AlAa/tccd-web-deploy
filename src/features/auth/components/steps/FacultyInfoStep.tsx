import type { Control } from "react-hook-form";
import type { FacultyInfoFormData } from "../../schemas";
import { Controller } from "react-hook-form";
import { useState } from "react";
import UniversityList from "@/constants/universityList";
import FacultyList from "@/constants/facultyList";
import DepartmentList from "@/constants/departmentList";
import { FiUpload, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

interface FacultyInfoStepProps {
  control: Control<FacultyInfoFormData>;
}

/**
 * Step 3/4: Faculty Member Information Collection
 */
export const FacultyInfoStep = ({ control }: FacultyInfoStepProps) => {
  const [fileName, setFileName] = useState<string>("");

  const roles = [
    "Teaching Assistant",
    "Assistant Lecturer",
    "Lecturer",
    "Assistant Professor",
    "Associate Professor",
    "Professor",
  ];

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (PDF or images)
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or image file (JPEG, JPG, PNG)");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setFileName(file.name);
      onChange(file);
    }
  };

  const clearFile = (onChange: (value: File | null) => void) => {
    setFileName("");
    onChange(null as unknown as File);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-[#3B3D41] mb-2">
          Academic Information
        </h3>
        <p className="text-sm text-[#636569]">
          Tell us about your academic position and institution
        </p>
      </div>

      {/* University */}
      <Controller
        name="universityName"
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
        name="facultyName"
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

      {/* Department */}
      <Controller
        name="department"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
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

      {/* Role */}
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Role <span className="text-red-500">*</span>
            </label>
            <select
              {...field}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            >
              <option value="">Select your role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
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

      {/* Proof File */}
      <Controller
        name="proofFile"
        control={control}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proof of Employment <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Upload a document that proves your employment (ID card, contract, etc.)
            </p>

            {!fileName ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPEG, JPG, or PNG (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleFileChange(e, onChange)}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiUpload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => clearFile(onChange)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}

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
