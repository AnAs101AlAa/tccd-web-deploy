import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Modal,
    InputField,
    DropdownMenu,
    NumberField,
} from "tccd-ui";
import type { StudentUser, VolunteeringUser } from "@/shared/types";
import FormFieldWithError from "./FormFieldWithError";
import { useUpdateUserProfile, useUpdateStudentProfile, useUpdateStudentCV } from "@/shared/queries/user/userQueries";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils";
import { FileUploadField } from "@/shared/components/FileUploadField";
import DepartmentList from "@/constants/departmentList";
import FacultyList from "@/constants/facultyList";
import UniversityList from "@/constants/universityList";
import { editStudentProfileSchema, type EditStudentProfileFormData } from "../schemas";

type StudentLikeUser = StudentUser | VolunteeringUser;

interface EditStudentInfoModalProps {
    user: StudentLikeUser;
    onClose: () => void;
    onSave: (updatedUser: StudentLikeUser) => void;
}

const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
];

const EditStudentInfoModal: React.FC<EditStudentInfoModalProps> = ({ user, onClose, onSave }) => {
    const updateUserProfileMutation = useUpdateUserProfile();
    const updateStudentProfileMutation = useUpdateStudentProfile();
    const updateStudentCVMutation = useUpdateStudentCV();

    const [cvFile, setCvFile] = useState<File | null>(null);

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<EditStudentProfileFormData>({
        resolver: zodResolver(editStudentProfileSchema),
        defaultValues: {
            englishFullName: user.englishFullName,
            arabicFullName: user.arabicFullName,
            gender: user.gender,
            university: user.university,
            faculty: user.faculty,
            department: user.department,
            graduationYear: user.graduationYear.toString(),
            gpa: user.gpa.toString(),
            linkedin: user.linkedin,
            gitHub: user.gitHub,
            cv: user.cv,
        },
    });

    const facultyValue = watch("faculty");

    useEffect(() => {
        reset({
            englishFullName: user.englishFullName,
            arabicFullName: user.arabicFullName,
            gender: user.gender,
            university: user.university,
            faculty: user.faculty,
            department: user.department,
            graduationYear: user.graduationYear.toString(),
            gpa: user.gpa.toString(),
            linkedin: user.linkedin,
            gitHub: user.gitHub,
            cv: user.cv,
        });
    }, [user, reset]);

    const onSubmit = async (formValues: EditStudentProfileFormData) => {
        try {
            // Build array of API calls - always call first two, conditionally call CV upload
            const apiCalls: Promise<any>[] = [
                updateUserProfileMutation.mutateAsync({
                    englishName: formValues.englishFullName.trim(),
                    arabicName: formValues.arabicFullName.trim(),
                    gender: formValues.gender,
                }),
                updateStudentProfileMutation.mutateAsync({
                    gpa: parseFloat(formValues.gpa.trim()),
                    graduationYear: parseInt(formValues.graduationYear.trim(), 10),
                    department: formValues.department.trim(),
                    faculty: formValues.faculty.trim(),
                    university: formValues.university.trim(),
                    linkedIn: formValues.linkedin?.trim() || undefined,
                    gitHub: formValues.gitHub?.trim() || undefined,
                }),
            ];

            // Only upload CV if a new file has been selected
            if (cvFile) {
                apiCalls.push(updateStudentCVMutation.mutateAsync(cvFile));
            }

            const results = await Promise.all(apiCalls);

            // Update local user state with all form values
            const updatedUser: StudentLikeUser = {
                ...user,
                englishFullName: formValues.englishFullName.trim(),
                arabicFullName: formValues.arabicFullName.trim(),
                gender: formValues.gender,
                university: formValues.university.trim(),
                faculty: formValues.faculty.trim(),
                department: formValues.department.trim(),
                graduationYear: parseInt(formValues.graduationYear.trim(), 10),
                gpa: parseFloat(formValues.gpa.trim()),
                linkedin: formValues.linkedin?.trim() || undefined,
                gitHub: formValues.gitHub?.trim() || undefined,
                // If CV was uploaded, use the URL from the response, otherwise keep the existing value
                cv: cvFile && results.length === 3 ? (results[2] as any).cv : formValues.cv?.trim() || undefined,
            };

            toast.success("Profile updated successfully!");
            onSave(updatedUser);
            onClose();
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message || "Failed to update profile. Please try again.");
            console.error("Failed to update profile:", error);
        }
    };

    return (
        <Modal title="Edit student information" isOpen onClose={onClose} className="max-w-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormFieldWithError error={errors.englishFullName?.message}>
                        <Controller
                            name="englishFullName"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="English Name"
                                    value={field.value}
                                    placeholder="Enter at least 3 names (e.g., John Michael Doe)"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    id="englishFullName"
                                    error={errors.englishFullName?.message}
                                />
                            )}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.arabicFullName?.message}>
                        <Controller
                            name="arabicFullName"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="Arabic Name"
                                    value={field.value}
                                    placeholder="أدخل ثلاثة أسماء على الأقل"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    id="arabicFullName"
                                    error={errors.arabicFullName?.message}
                                />
                            )}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.gender?.message}>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <DropdownMenu
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="Gender"
                                    options={genderOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select gender"
                                    id="gender"
                                />
                            )}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.university?.message}>
                        <Controller
                            name="university"
                            control={control}
                            render={({ field }) => (
                                <DropdownMenu
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="University"
                                    value={field.value}
                                    options={UniversityList.map((uni) => ({ label: uni, value: uni }))}
                                    placeholder="Enter university"
                                    onChange={field.onChange}
                                    id="university"
                                    error={errors.university?.message}
                                />
                            )}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.faculty?.message}>
                        <Controller
                            name="faculty"
                            control={control}
                            render={({ field }) => (
                                <DropdownMenu
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="Faculty"
                                    value={field.value}
                                    options={FacultyList.map((faculty) => ({ label: faculty, value: faculty }))}
                                    placeholder="Enter faculty"
                                    onChange={field.onChange}
                                    id="faculty"
                                    error={errors.faculty?.message}
                                />
                            )}
                        />
                    </FormFieldWithError>
                    {facultyValue === "Engineering" && (
                        <FormFieldWithError error={errors.department?.message}>
                            <Controller
                                name="department"
                                control={control}
                                render={({ field }) => (
                                    <DropdownMenu
                                        labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                        label="Department"
                                        value={field.value}
                                        options={DepartmentList.map((dept) => ({ label: dept, value: dept }))}
                                        placeholder="Enter department"
                                        onChange={field.onChange}
                                        id="department"
                                        error={errors.department?.message}
                                    />
                                )}
                            />
                        </FormFieldWithError>
                    )}
                    <FormFieldWithError error={errors.graduationYear?.message}>
                        <Controller
                            name="graduationYear"
                            control={control}
                            render={({ field }) => (
                                <NumberField
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="Graduation Year"
                                    value={field.value}
                                    placeholder="Enter graduation year"
                                    onChange={field.onChange}
                                    error={errors.graduationYear?.message}
                                />
                            )}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.gpa?.message}>
                        <Controller
                            name="gpa"
                            control={control}
                            render={({ field }) => (
                                <NumberField
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="GPA"
                                    value={field.value}
                                    placeholder="Enter GPA"
                                    onChange={field.onChange}
                                    error={errors.gpa?.message}
                                />
                            )}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.linkedin?.message}>
                        <Controller
                            name="linkedin"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="LinkedIn"
                                    value={field.value ?? ""}
                                    placeholder="https://linkedin.com/in/..."
                                    onChange={(e) => field.onChange(e.target.value)}
                                    id="linkedin"
                                    error={errors.linkedin?.message}
                                />
                            )}
                        />
                    </FormFieldWithError>
                    <FormFieldWithError error={errors.gitHub?.message}>
                        <Controller
                            name="gitHub"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="GitHub Profile"
                                    value={field.value ?? ""}
                                    placeholder="https://github.com/username"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    id="gitHub"
                                    error={errors.gitHub?.message}
                                />
                            )}
                        />
                    </FormFieldWithError>
                    <div className="col-span-1 md:col-span-2">
                        <FormFieldWithError error={errors.cv?.message}>
                            <FileUploadField
                                id="cv"
                                label="Curriculum Vitae"
                                value={cvFile || watch("cv") || ""}
                                onChange={(file) => setCvFile(file)}
                                accept=".pdf,.doc,.docx"
                                acceptedFormats="PDF, DOC, or DOCX"
                                maxSize={10}
                                error={errors.cv?.message}
                            />
                        </FormFieldWithError>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                    <Button
                        buttonText="Cancel"
                        onClick={onClose}
                        type="basic"
                        width="fit"
                        disabled={updateUserProfileMutation.isPending || updateStudentProfileMutation.isPending || updateStudentCVMutation.isPending}
                    />
                    <Button
                        buttonText={(updateUserProfileMutation.isPending || updateStudentProfileMutation.isPending || updateStudentCVMutation.isPending) ? "Saving..." : "Save changes"}
                        onClick={handleSubmit(onSubmit)}
                        type="primary"
                        width="fit"
                        disabled={updateUserProfileMutation.isPending || updateStudentProfileMutation.isPending || updateStudentCVMutation.isPending}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default EditStudentInfoModal;
