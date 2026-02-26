import type { AnyUser, CompanyUser } from "@/shared/types";
import {
  isStudent,
  isVolunteer,
  isCompany,
  isBusinessRep,
} from "@/shared/types";

export const useProfileHeader = (user: AnyUser | CompanyUser) => {
  const normalUser = user as AnyUser; // Type assertion for easier access to common fields
  const companyUser = user as CompanyUser; // Type assertion for company-specific fields

  const getBio = () => {
    if (isStudent(normalUser) || isVolunteer(normalUser)) {
      const status =
        new Date().getFullYear() >= normalUser.graduationYear
          ? "Graduate of"
          : "Student in";
      return `${status} ${normalUser.university} batch of ${normalUser.graduationYear}`;
    }
    if (isCompany(companyUser)) {
      return companyUser.brief || companyUser.description;
    }
    if (isBusinessRep(normalUser)) {
      return normalUser.jobTitle;
    }
    return "TCCD Member";
  };

  const getDisplayName = () => {
    if ("englishFullName" in normalUser) {
      return normalUser.englishFullName;
    }
    if ("companyName" in companyUser) {
      return companyUser.companyName;
    }
    return "Unknown User";
  };

  return {
    getBio,
    getDisplayName,
  };
};
