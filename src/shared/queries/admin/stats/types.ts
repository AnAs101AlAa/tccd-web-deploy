import type { EntityRole, UserStatus, Gender } from "@/shared/types";

export type StatsRole = Exclude<EntityRole, "company">;

export interface StatsApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface UsersGenderStats {
  males: number;
  females: number;
}

export interface UsersStatusItem {
  status: UserStatus | string;
  count: number;
}

export interface EventOverviewStats {
  eventId: string;
  totalRegistered: number;
  totalAttended: number;
  totalNoShow: number;
  totalCancelled: number;
  capacity: number;
  attendanceRate: number;
}

export interface GenderDistributionItem {
  gender: Gender | string;
  count: number;
}

export interface EventGenderDistributionStats {
  eventId: string;
  distribution: GenderDistributionItem[];
}

export interface UniversityDistributionItem {
  university: string;
  count: number;
}

export interface EventUniversityDistributionStats {
  eventId: string;
  distribution: UniversityDistributionItem[];
}

export interface DepartmentAttendanceItem {
  department: string;
  attended: number;
  noShow: number;
}

export interface EventDepartmentAttendanceStats {
  eventId: string;
  university?: string;
  departments: DepartmentAttendanceItem[];
}

export interface CommitteeDistributionItem {
  committeeName: string;
  count: number;
}

export interface CommitteesDistributionStats {
  distribution: CommitteeDistributionItem[];
}

export interface GraduationYearDistributionItem {
  graduationYear: number;
  count: number;
}

export interface UsersGraduationYearStats {
  distribution: GraduationYearDistributionItem[];
}

export interface FacultyDistributionItem {
  faculty: string;
  count: number;
}

export interface UsersFacultiesStats {
  distribution: FacultyDistributionItem[];
}

export interface UsersUniversitiesStats {
  distribution: UniversityDistributionItem[];
}

export interface DepartmentDistributionItem {
  department: string;
  count: number;
}

export interface UsersDepartmentsStats {
  distribution: DepartmentDistributionItem[];
}

export interface GpaDistributionItem {
  gpa: string;
  count: number;
}

export interface UsersGpaDistributionStats {
  distribution: GpaDistributionItem[];
}

export interface CompanyBusinessRepDistributionItem {
  companyName: string;
  businessRepCount: number;
}

export interface CompaniesBusinessRepresentativesStats {
  distribution: CompanyBusinessRepDistributionItem[];
}
