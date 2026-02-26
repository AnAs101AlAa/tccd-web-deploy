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
        formState: { errors },
    } = useForm<EditStudentProfileFormData>({
        resolver: zodResolver(editStudentProfileSchema),
        defaultValues: {
            englishFullName: user.englishFullName,
            arabicFullName: user.arabicFullName,
            phoneNumber: user.phoneNumber,
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
            phoneNumber: user.phoneNumber,
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
            const apiCalls: Promise<any>[] = [
                updateUserProfileMutation.mutateAsync({
                    englishName: formValues.englishFullName.trim(),
                    arabicName: formValues.arabicFullName.trim(),
                    phoneNumber: formValues.phoneNumber.trim(),
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

            await Promise.all(apiCalls);

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
                cv: formValues.cv?.trim() || undefined,
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
                                label="English Name"
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
                                label="Arabic Name"
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
                                label="Phone Number"
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
                                label="Gender"
                                options={genderOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select gender"
                                id="gender"
                            />
                        )}
                    />
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
                    {facultyValue === "Engineering" && (
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
                    )}
                    <Controller
                        name="graduationYear"
                        control={control}
                        render={({ field }) => (
                            <NumberField
                                id="graduationYear"
                                labelClassName="text-contrast  text-[13px] md:text-[14px] lg:text-[15px] mb-1"
                                label="Graduation Year"
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
                                label="GPA"
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
