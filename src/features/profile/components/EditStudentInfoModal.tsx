import React, { useEffect, useState } from "react";
import {
    Button,
    ButtonTypes,
    ButtonWidths,
    Modal,
    InputField,
    DropdownMenu,
    NumberField,
} from "tccd-ui";
import type { Gender, StudentUser, VolunteeringUser } from "@/shared/types";
import FormFieldWithError from "./FormFieldWithError";

type StudentLikeUser = StudentUser | VolunteeringUser;

interface EditStudentInfoModalProps {
    user: StudentLikeUser;
    onClose: () => void;
    onSave: (updatedUser: StudentLikeUser) => void;
}

interface EditStudentFormValues {
    englishFullName: string;
    arabicFullName: string;
    email: string;
    phoneNumber: string;
    gender: Gender;
    university: string;
    faculty: string;
    department: string;
    graduationYear: string;
    gpa: string;
    linkedin?: string;
    cv?: string;
}

interface FormErrors {
    englishFullName?: string;
    arabicFullName?: string;
    email?: string;
    phoneNumber?: string;
    gender?: string;
    university?: string;
    faculty?: string;
    department?: string;
    graduationYear?: string;
    gpa?: string;
    linkedin?: string;
    cv?: string;
}

const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
];

const validateField = (field: keyof EditStudentFormValues, value: string): string | undefined => {
    switch (field) {
        case "englishFullName":
            if (!value.trim()) return "English name is required";
            if (value.trim().length < 3) return "English name must be at least 3 characters";
            if (!/^[a-zA-Z\s]+$/.test(value)) return "English name must contain only English letters";
            break;
        case "arabicFullName":
            if (!value.trim()) return "Arabic name is required";
            if (value.trim().length < 3) return "Arabic name must be at least 3 characters";
            if (!/^[\u0600-\u06FF\s]+$/.test(value))
                return "Arabic name must contain only Arabic letters";
            break;
        case "email":
            if (!value.trim()) return "Email is required";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
            break;
        case "phoneNumber":
            if (!value.trim()) return "Phone number is required";
            if (!/^[0-9+\s()-]+$/.test(value)) return "Invalid phone number format";
            if (value.replace(/\D/g, "").length < 10)
                return "Phone number must be at least 10 digits";
            break;
        case "university":
            if (!value.trim()) return "University is required";
            if (value.trim().length < 3) return "University name must be at least 3 characters";
            break;
        case "faculty":
            if (!value.trim()) return "Faculty is required";
            if (value.trim().length < 3) return "Faculty name must be at least 3 characters";
            break;
        case "department":
            if (!value.trim()) return "Department is required";
            if (value.trim().length < 3) return "Department name must be at least 3 characters";
            break;
        case "graduationYear":
            if (!value.trim()) return "Graduation year is required";
            const year = parseInt(value, 10);
            const currentYear = new Date().getFullYear();
            if (isNaN(year)) return "Invalid year";
            if (year < 1950 || year > currentYear + 10)
                return `Year must be between 1950 and ${currentYear + 10}`;
            break;
        case "gpa":
            if (!value.trim()) return "GPA is required";
            const gpa = parseFloat(value);
            if (isNaN(gpa)) return "Invalid GPA";
            if (gpa < 0 || gpa > 4) return "GPA must be between 0 and 4";
            break;
        case "linkedin":
            if (value.trim() && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(value)) {
                return "Invalid LinkedIn URL format";
            }
            break;
        case "cv":
            if (value.trim() && !/^https?:\/\/.+/.test(value)) {
                return "CV must be a valid URL";
            }
            break;
    }
    return undefined;
};

const EditStudentInfoModal: React.FC<EditStudentInfoModalProps> = ({ user, onClose, onSave }) => {
    const [formValues, setFormValues] = useState<EditStudentFormValues>({
        englishFullName: user.englishFullName,
        arabicFullName: user.arabicFullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        university: user.university,
        faculty: user.faculty,
        department: user.department,
        graduationYear: user.graduationYear.toString(),
        gpa: user.gpa.toString(),
        linkedin: user.linkedin,
        cv: user.cv,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        setFormValues({
            englishFullName: user.englishFullName,
            arabicFullName: user.arabicFullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            university: user.university,
            faculty: user.faculty,
            department: user.department,
            graduationYear: user.graduationYear.toString(),
            gpa: user.gpa.toString(),
            linkedin: user.linkedin,
            cv: user.cv,
        });
    }, [user]);

    const handleInputChange =
        (field: keyof EditStudentFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;
            setFormValues((prev) => ({ ...prev, [field]: value }));

            if (errors[field]) {
                setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
        };

    const handleNumberChange = (field: keyof EditStudentFormValues) => (value: string | number) => {
        const stringValue = String(value);
        setFormValues((prev) => ({ ...prev, [field]: stringValue }));

        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleGenderChange = (value: string) => {
        setFormValues((prev) => ({ ...prev, gender: value as Gender }));

        if (errors.gender) {
            setErrors((prev) => ({ ...prev, gender: undefined }));
        }
    };

    const handleSave = () => {
        const newErrors: FormErrors = {};

        (Object.keys(formValues) as Array<keyof EditStudentFormValues>).forEach((field) => {
            const value = formValues[field];
            if (value !== undefined) {
                const error = validateField(field, String(value));
                if (error) {
                    newErrors[field] = error;
                }
            }
        });

        if (!formValues.gender) {
            newErrors.gender = "Gender is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const updatedUser: StudentLikeUser = {
            ...user,
            englishFullName: formValues.englishFullName.trim(),
            arabicFullName: formValues.arabicFullName.trim(),
            email: formValues.email.trim(),
            phoneNumber: formValues.phoneNumber.trim(),
            gender: formValues.gender,
            university: formValues.university.trim(),
            faculty: formValues.faculty.trim(),
            department: formValues.department.trim(),
            graduationYear: parseInt(formValues.graduationYear.trim(), 10),
            gpa: parseFloat(formValues.gpa.trim()),
            linkedin: formValues.linkedin?.trim() || undefined,
            cv: formValues.cv?.trim() || undefined,
        };

        onSave(updatedUser);
    };

    return (
        <Modal title="Edit student information" isOpen onClose={onClose} className="max-w-3xl">
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormFieldWithError error={errors.englishFullName}>
                        <InputField
                            label="English Name"
                            value={formValues.englishFullName}
                            placeholder="Enter English full name"
                            onChange={handleInputChange("englishFullName")}
                            id="englishFullName"
                            error={errors.englishFullName}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.arabicFullName}>
                        <InputField
                            label="Arabic Name"
                            value={formValues.arabicFullName}
                            placeholder="Enter Arabic full name"
                            onChange={handleInputChange("arabicFullName")}
                            id="arabicFullName"
                            error={errors.arabicFullName}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.email}>
                        <InputField
                            label="Email"
                            value={formValues.email}
                            placeholder="Enter email address"
                            onChange={handleInputChange("email")}
                            id="email"
                            error={errors.email}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.phoneNumber}>
                        <InputField
                            label="Phone Number"
                            value={formValues.phoneNumber}
                            placeholder="Enter phone number"
                            onChange={handleInputChange("phoneNumber")}
                            id="phoneNumber"
                            error={errors.phoneNumber}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.gender}>
                        <DropdownMenu
                            label="Gender"
                            options={genderOptions}
                            value={formValues.gender}
                            onChange={handleGenderChange}
                            placeholder="Select gender"
                            id="gender"
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.university}>
                        <InputField
                            label="University"
                            value={formValues.university}
                            placeholder="Enter university"
                            onChange={handleInputChange("university")}
                            id="university"
                            error={errors.university}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.faculty}>
                        <InputField
                            label="Faculty"
                            value={formValues.faculty}
                            placeholder="Enter faculty"
                            onChange={handleInputChange("faculty")}
                            id="faculty"
                            error={errors.faculty}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.department}>
                        <InputField
                            label="Department"
                            value={formValues.department}
                            placeholder="Enter department"
                            onChange={handleInputChange("department")}
                            id="department"
                            error={errors.department}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.graduationYear}>
                        <NumberField
                            label="Graduation Year"
                            value={formValues.graduationYear}
                            placeholder="Enter graduation year"
                            onChange={handleNumberChange("graduationYear")}
                            error={errors.graduationYear}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.gpa}>
                        <NumberField
                            label="GPA"
                            value={formValues.gpa}
                            placeholder="Enter GPA"
                            onChange={handleNumberChange("gpa")}
                            error={errors.gpa}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.linkedin}>
                        <InputField
                            label="LinkedIn"
                            value={formValues.linkedin ?? ""}
                            placeholder="https://linkedin.com/in/..."
                            onChange={handleInputChange("linkedin")}
                            id="linkedin"
                            error={errors.linkedin}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.cv}>
                        <InputField
                            label="Curriculum Vitae"
                            value={formValues.cv ?? ""}
                            placeholder="https://resume-link"
                            onChange={handleInputChange("cv")}
                            id="cv"
                            error={errors.cv}
                        />
                    </FormFieldWithError>
                </div>
                <div className="flex items-center justify-end gap-3">
                    <Button
                        buttonText="Cancel"
                        onClick={onClose}
                        type={ButtonTypes.BASIC}
                        width={ButtonWidths.FIT}
                    />
                    <Button
                        buttonText="Save changes"
                        onClick={handleSave}
                        type={ButtonTypes.PRIMARY}
                        width={ButtonWidths.FIT}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditStudentInfoModal;
