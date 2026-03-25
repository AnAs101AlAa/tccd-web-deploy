import React, { useEffect } from "react";
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
import { useUpdateUserProfile, useUpdateStudentProfile, useUpdateStudentCV } from "@/shared/queries/user/userQueries";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils";
import DepartmentList from "@/constants/departmentList";
import FacultyList from "@/constants/facultyList";
import UniversityList from "@/constants/universityList";
import { editStudentProfileSchema, type EditStudentProfileFormData } from "../schemas";
import { useDispatch } from "react-redux";
import { setUser } from "@/shared/store";
import extractDriveId from "@/shared/utils/googleDriveHelper";

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
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<EditStudentProfileFormData>({
        resolver: zodResolver(editStudentProfileSchema),
        mode: "onChange",
        defaultValues: {
            englishFullName: user.englishFullName,
            arabicFullName: user.arabicFullName,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            nationality: user.nationalId ? "egyptian" : "non-egyptian",
            nationalId: user.nationalId ? user.nationalId : "",
            passportNumber: user.passportNumber ? user.passportNumber : "",
            university: user.university,
            faculty: user.faculty,
            department: user.department,
            graduationYear: user.graduationYear.toString(),
            gpa: user.gpa.toString(),
            linkedin: user.linkedin || "",
            gitHub: user.gitHub || "",
            cv: user.cv || "",
        },
    });

    const facultyValue = watch("faculty");
    const nationality = watch("nationality");

    useEffect(() => {
        reset({
            englishFullName: user.englishFullName,
            arabicFullName: user.arabicFullName,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            nationality: user.nationalId ? "egyptian" : "non-egyptian",
            nationalId: user.nationalId ? user.nationalId : "",
            passportNumber: user.passportNumber ? user.passportNumber : "",
            university: user.university,
            faculty: user.faculty,
            department: user.department,
            graduationYear: user.graduationYear.toString(),
            gpa: user.gpa.toString(),
            linkedin: user.linkedin || "",
            gitHub: user.gitHub || "",
            cv: user.cv || "",
        });
    }, [user, reset]);

    // Clear department when faculty is not Engineering
    useEffect(() => {
        if (facultyValue !== "Engineering") {
            setValue("department", "");
        }
    }, [facultyValue, setValue]);

    const onSubmit = async (formValues: EditStudentProfileFormData) => {
        try {
            const baseProfile = {
                englishName: formValues.englishFullName.trim(),
                arabicName: formValues.arabicFullName.trim(),
                phoneNumber: formValues.phoneNumber.trim(),
                gender: formValues.gender,
            };

            // Build payload with proper handling of ID fields based on nationality - only include non-empty values
            const profilePayload: any = {
                ...baseProfile,
            };
            if (formValues.nationality === "egyptian" && formValues.nationalId?.trim()) {
                profilePayload.nationalId = formValues.nationalId?.trim() || "";
            }
            if (formValues.nationality === "non-egyptian" && formValues.passportNumber?.trim()) {
                profilePayload.passportNumber = formValues.passportNumber?.trim() || "";
            }

            const studentProfilePayload: any = {
                gpa: parseFloat(formValues.gpa.trim()),
                graduationYear: parseInt(formValues.graduationYear.trim(), 10),
                faculty: formValues.faculty.trim(),
                university: formValues.university.trim(),
            };

            // Only include department if faculty is Engineering
            if (formValues.faculty.trim() === "Engineering") {
                studentProfilePayload.department = formValues.department?.trim();
            }

            // Only include LinkedIn if it's not empty
            if (formValues.linkedin?.trim()) {
                studentProfilePayload.linkedIn = formValues.linkedin.trim();
            }

            // Only include GitHub if it's not empty
            if (formValues.gitHub?.trim()) {
                studentProfilePayload.gitHub = formValues.gitHub.trim();
            }

            const apiCalls: Promise<any>[] = [
                updateUserProfileMutation.mutateAsync(profilePayload),
                updateStudentProfileMutation.mutateAsync(studentProfilePayload),
            ];

            await Promise.all(apiCalls);

            const baseUpdatedUser = {
                ...user,
                englishFullName: formValues.englishFullName.trim(),
                arabicFullName: formValues.arabicFullName.trim(),
                gender: formValues.gender,
                phoneNumber: formValues.phoneNumber.trim(),
                university: formValues.university.trim(),
                faculty: formValues.faculty.trim(),
                department: formValues.faculty.trim() === "Engineering" ? formValues.department?.trim() : "",
                graduationYear: parseInt(formValues.graduationYear.trim(), 10),
                gpa: parseFloat(formValues.gpa.trim()),
                linkedin: formValues.linkedin?.trim() || undefined,
                gitHub: formValues.gitHub?.trim() || undefined,
                cv: formValues.cv?.trim() || undefined,
            };

            // Properly handle ID fields based on nationality - clear the unused one
            const updatedUser: StudentLikeUser = {
                ...baseUpdatedUser,
                nationalId: formValues.nationality === "egyptian" ? (formValues.nationalId?.trim() || "") : "",
                passportNumber: formValues.nationality === "non-egyptian" ? (formValues.passportNumber?.trim() || "") : "",
            };

            dispatch(setUser(updatedUser));
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
        <Modal title="Edit student information" isOpen onClose={onClose} className="max-w-4xl xl:max-w-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="englishFullName"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="English Name *"
                                value={field.value}
                                placeholder="Enter at least 3 names (e.g., John Michael Doe)"
                                onChange={(e) => field.onChange(e.target.value)}
                                id="englishFullName"
                                error={errors.englishFullName?.message}
                            />
                        )}
                    />
                    <Controller
                        name="arabicFullName"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="Arabic Name (الاسم بالعربية) *"
                                value={field.value}
                                placeholder="أدخل ثلاثة أسماء على الأقل"
                                onChange={(e) => field.onChange(e.target.value)}
                                id="arabicFullName"
                                error={errors.arabicFullName?.message}
                            />
                        )}
                    />
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="Phone Number *"
                                value={field.value}
                                placeholder="Enter your phone number"
                                onChange={(e) => field.onChange(e.target.value)}
                                id="phoneNumber"
                                error={errors.phoneNumber?.message}
                            />
                        )}
                    />
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <DropdownMenu
                                labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="Gender *"
                                options={genderOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select gender"
                                id="gender"
                            />
                        )}
                    />
                    <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                            <DropdownMenu
                                labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="Nationality *"
                                options={[
                                    { label: "Egyptian", value: "egyptian" },
                                    { label: "Non-Egyptian", value: "non-egyptian" },
                                ]}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select nationality"
                                id="nationality"
                                error={errors.nationality?.message}
                            />
                        )}
                    />
                    {nationality === "egyptian" ? (
                        <Controller
                            name="nationalId"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="National ID *"
                                    value={field.value || ""}
                                    placeholder="Enter your national ID number"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    id="nationalId"
                                    error={errors.nationalId?.message}
                                />
                            )}
                        />
                    ) : nationality === "non-egyptian" ? (
                        <Controller
                            name="passportNumber"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="Passport Number *"
                                    value={field.value || ""}
                                    placeholder="Enter your passport number"
                                    onChange={(e) => field.onChange(e.target.value)}
                                    id="passportNumber"
                                    error={errors.passportNumber?.message}
                                />
                            )}
                        />
                    ) : null}
                    <Controller
                        name="university"
                        control={control}
                        render={({ field }) => (
                            <DropdownMenu
                                labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="University *"
                                value={field.value}
                                options={UniversityList.map((uni) => ({ label: uni, value: uni }))}
                                placeholder="Enter university"
                                onChange={field.onChange}
                                id="university"
                                error={errors.university?.message}
                            />
                        )}
                    />
                    <Controller
                        name="faculty"
                        control={control}
                        render={({ field }) => (
                            <DropdownMenu
                                labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="Faculty *"
                                value={field.value}
                                options={FacultyList.map((faculty) => ({ label: faculty, value: faculty }))}
                                placeholder="Enter faculty"
                                onChange={field.onChange}
                                id="faculty"
                                error={errors.faculty?.message}
                            />
                        )}
                    />
                    {facultyValue === "Engineering" && (
                        <Controller
                            name="department"
                            control={control}
                            render={({ field }) => (
                                <DropdownMenu
                                    labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                    label="Department *"
                                    value={field.value}
                                    options={DepartmentList.map((dept) => ({ label: dept, value: dept }))}
                                    placeholder="Enter department"
                                    onChange={field.onChange}
                                    id="department"
                                    error={errors.department?.message}
                                />
                            )}
                        />
                    )}
                    <Controller
                        name="graduationYear"
                        control={control}
                        render={({ field }) => (
                            <NumberField
                                id="graduationYear"
                                labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="Graduation Year *"
                                value={field.value}
                                placeholder="Enter graduation year"
                                onChange={(val) => field.onChange(val.toString())}
                                error={errors.graduationYear?.message}
                            />
                        )}
                    />
                    <Controller
                        name="gpa"
                        control={control}
                        render={({ field }) => (
                            <NumberField
                                id="gpa"
                                labelClassName="text-contrast text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="GPA *"
                                value={field.value}
                                placeholder="Enter GPA"
                                onChange={(val) => field.onChange(val.toString())}
                                error={errors.gpa?.message}
                            />
                        )}
                    />
                    <Controller
                        name="linkedin"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                labelClassName="text-contrast text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="LinkedIn"
                                value={field.value ?? ""}
                                placeholder="https://linkedin.com/in/..."
                                onChange={(e) => field.onChange(e.target.value)}
                                id="linkedin"
                                error={errors.linkedin?.message}
                            />
                        )}
                    />
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
                    <Controller
                        name="cv"
                        control={control}
                        render={({ field }) => (
                            <InputField
                                labelClassName="text-contrast text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="Google Drive CV Link"
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(extractDriveId(e.target.value) ?? "")}
                                placeholder="https://drive.google.com/file/d/..."
                                id="cv"
                                error={errors.cv?.message}
                            />
                        )}
                    />
                </div>
                <div className="flex items-center justify-center gap-3">
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
