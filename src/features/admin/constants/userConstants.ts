import type { UserRole, UserStatus } from "@/shared/queries/admin/users/userTypes";
import type { Gender } from "@/shared/types";

export const GENDER_OPTIONS = [
  { value: "Male" as Gender, label: "Male" },
  { value: "Female" as Gender, label: "Female" },
];

export const ROLE_OPTIONS = [
  { value: "Student" as UserRole, label: "Student" },
  { value: "TA" as UserRole, label: "TA" },
  { value: "DR" as UserRole, label: "DR" },
  { value: "BusinessRep" as UserRole, label: "Business Representative" },
  { value: "Admin" as UserRole, label: "Admin" },
  { value: "VolunteeringMember" as UserRole, label: "Volunteering Member" },
];

export const STATUS_OPTIONS = [
  { value: "Pending" as UserStatus, label: "Pending" },
  { value: "Approved" as UserStatus, label: "Approved" },
  { value: "Rejected" as UserStatus, label: "Rejected" },
  { value: "Banned" as UserStatus, label: "Banned" },
];