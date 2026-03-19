export interface UserQueryParams {
  EnglishName?: string;
  ArabicName?: string;
  Gender?: Gender;
  IsDeleted?: boolean;
  Role?: UserRole;
  Status?: UserStatus;
  PageNumber: number;
  PageSize: number;
  OrderBy?: string;
  Descending?: boolean;
}

export interface User {
  id: string;
  englishName?: string;
  arabicName?: string;
  gender: Gender;
  profileImage?: string;
  status: UserStatus;
  role?: UserRole;
  email?: string;
  phoneNumber?: string;
  studentProfile?: StudentProfile;
  businessRepProfile?: BusinessRepProfile;
  facultyMemberProfile?: FacultyMemberProfile;
  volunteeringProfile?: VolunteeringProfile;
}

export interface VolunteeringProfile {
  committeeAffiliation: CommitteeAffiliation;
  position: CommitteePosition;
}

export interface StudentProfile {
  gpa: number;
  graduationYear: number;
  department?: string;
  faculty?: string;
  university?: string;
  cv?: string;
  linkedIn?: string;
  github?: string;
  volunteeringProfile?: VolunteeringProfile;
}

export interface BusinessRepProfile {
  position?: string;
  proofFileUrl?: string;
  companyName?: string;
}

export interface FacultyMemberProfile {
  proofFileUrl?: string;
  universityName?: string;
  facultyName?: string;
  department?: string;
}

export interface UserResponse {
  items: User[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type Gender = "Male" | "Female";
export type UserStatus = "Pending" | "Approved" | "Rejected" | "Banned";
export type UserRole =
  | "Student"
  | "TA"
  | "DR"
  | "BusinessRep"
  | "Admin"
  | "VolunteeringMember";
export type CommitteeAffiliation =
  | "Operations"
  | "HumanResources"
  | "IT"
  | "GraphicDesign"
  | "ExternalRelations"
  | "ContentCreation"
  | "Marketing"
  | "VideoEditing"
  | "HighBoard";
export type CommitteePosition =
  | "Member"
  | "Head"
  | "Director"
  | "VicePresident"
  | "President";

