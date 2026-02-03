export type Gender = "Male" | "Female";

export type EntityRole = "Student" | "TA" | "DR" | "BusinessRep" | "Admin" | "Volunteer" | "company";

export type UserStatus = "Pending" | "Approved" | "Rejected" | "Banned";

export type Committee =
  | "Operations"
  | "HumanResources"
  | "IT"
  | "GraphicDesign"
  | "ExternalRelations"
  | "ContentCreation"
  | "Marketing"
  | "VideoEditing"
  | "HighBoard";

export type Position =
  | "Head"
  | "Member"
  | "President"
  | "VicePresident"
  | "Director";

interface Entity {
  id: string;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  status: UserStatus;
  role: EntityRole;
}

interface User extends Entity {
  englishFullName: string;
  arabicFullName: string;
  phoneNumber: string;
  email: string;
  gender: Gender;
  profilePicture?: string;
}

export interface CompanyUser extends Entity {
  companyName: string;
  businessType: string;
  description: string;
  website: string;
  brief: string;
  logo: string;
  businessReps?: string[]; // IDs of BusinessRepUser
}

export interface BusinessRepUser extends User {
  companyId: string;
  jobTitle: string;
  company?: CompanyUser;
}

export interface StudentUser extends User {
  gpa: number;
  graduationYear: number;
  department: string;
  faculty: string;
  university: string;
  cv?: string; // URL
  linkedin?: string;
  gitHub?: string;
}

export interface VolunteeringUser extends StudentUser {
  committeeAffiliation: Committee;
  position: Position;
}

export interface FacultyMemberUser extends User {
  university: string;
  faculty: string;
  department: string;
}

export interface AdminUser extends User {
  adminLevel: number;
}

/** Union every component can accept */
export type AnyUser =
  | StudentUser
  | VolunteeringUser
  | CompanyUser
  | BusinessRepUser
  | FacultyMemberUser
  | AdminUser;

/** Guards for Conditional Rendering */
export const isStudent = (u: AnyUser): u is StudentUser => u.role === "Student";
export const isBusinessRep = (u: AnyUser): u is BusinessRepUser =>
  u.role === "BusinessRep";
export const isTA = (u: AnyUser): u is FacultyMemberUser => u.role === "TA";
export const isDR = (u: AnyUser): u is FacultyMemberUser => u.role === "DR";
export const isAdmin = (u: AnyUser): u is AdminUser => u.role === "Admin";
export const isVolunteer = (u: AnyUser): u is VolunteeringUser =>
  u.role === "Volunteer";
export const isCompany = (u: AnyUser | CompanyUser): u is CompanyUser =>
  u.role === "company";
