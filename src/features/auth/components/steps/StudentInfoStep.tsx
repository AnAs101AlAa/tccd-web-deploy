import type { Control } from "react-hook-form";
import type { StudentInfoFormData } from "../../schemas";
import UniversityList from "@/constants/universityList";
import FacultyList from "@/constants/facultyList";
import DepartmentList from "@/constants/departmentList";
import { FormInput } from "../FormInput";
import { useWatch } from "react-hook-form";

interface StudentInfoStepProps {
  control: Control<StudentInfoFormData>;
}

/**
 * Step 3: Student Information Collection
 */
export const StudentInfoStep = ({ control }: StudentInfoStepProps) => {
  const faculty = useWatch({ control, name: "faculty" });
  const isDepartmentRequired = faculty === "Engineering";

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

      <FormInput
        name="university"
        control={control}
        label="University"
        type="dropdown"
        placeholder="Select your university"
        options={UniversityList.map((uni) => ({ label: uni, value: uni }))}
      />

      <FormInput
        name="faculty"
        control={control}
        label="Faculty"
        type="dropdown"
        placeholder="Select your faculty"
        options={FacultyList.map((fac) => ({ label: fac, value: fac }))}
      />

      {faculty === "Engineering" && (
        <FormInput
          name="department"
          control={control}
          type="dropdown"
          label={isDepartmentRequired ? "Department" : "Department (Optional)"}
          placeholder="Select your department"
          options={DepartmentList.map((dept) => ({ label: dept, value: dept }))}
        />
      )}
    </div>
  );
};

