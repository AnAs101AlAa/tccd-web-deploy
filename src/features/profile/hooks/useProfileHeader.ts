import type { AnyUser } from "@/shared/types";
import {
  isStudent,
  isVolunteer,
  isCompany,
  isBusinessRep,
} from "@/shared/types";

export const useProfileHeader = (user: AnyUser) => {

  const getBio = () => {
    if (isStudent(user) || isVolunteer(user)) {
      const status =
        new Date().getFullYear() >= user.graduationYear
          ? "Graduate of"
          : "Student in";
      return `${status} ${user.university} batch of ${user.graduationYear}`;
    }
    if (isCompany(user)) {
      return user.brief || user.description;
    }
    if (isBusinessRep(user)) {
      return user.jobTitle;
    }
    return "TCCD Member";
  };

  const getDisplayName = () => {
    if ("englishFullName" in user) {
      return user.englishFullName;
    }
    if ("companyName" in user) {
      return user.companyName;
    }
    return "Unknown User";
  };

  return {
    getBio,
    getDisplayName,
  };
};
